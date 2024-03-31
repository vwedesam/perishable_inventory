import type { Response } from 'express';
import prisma from '../prisma';
import type { IAddItemRequest, IGetItemQuantityRequest, ISellItemRequest } from 'src/types';
const asyncHandler = require('express-async-handler')

/**
 * Add a lot of item to the system
 * 
 * @param req HTTPs Request
 * @param res HTTPs Response
 * 
 * @returns {}
 */
const addItem = asyncHandler(async (req: IAddItemRequest, res: Response) => {

  const { quantity, expiry } = req.body;
  const { item } = req.params;

  const inventoryItem = await prisma.inventoryItem.upsert({
    where: { name: item },
    update: {
      lots: {
        create: {
          quantity,
          expiry: new Date(Date.now() + expiry),
        },
      },
    },
    create: {
      name: item,
      lots: {
        create: {
          quantity,
          expiry: new Date(Date.now() + expiry),
        },
      },
    },
  });

  return res.json({});

})

/**
 * Sell a quantity of an item and reduce its inventory from the database.
 * 
 * @param req HTTPs Request
 * @param res HTTPs Response
 * 
 * @returns {}
 */
const sellItem = asyncHandler(async (req: ISellItemRequest, res: Response) => {

  const { quantity } = req.body;
  const { item } = req.params;

  const inventoryItem = await prisma.inventoryItem.findFirst({
    where: { name: item },
    include: { 
      lots: { 
        where: { expiry: { gte: new Date() } }, 
        orderBy: { expiry: 'asc' } } 
    },
  });

  const nonExpiredQuantity = inventoryItem?.lots?.reduce((acc, _lot)=> acc += _lot?.quantity, 0) || 0!;

  if(!inventoryItem || quantity > nonExpiredQuantity){
    return res.status(400).json({
      status: 'failed',
      message: `Can't sell more than the non-expired quantity of the ${item} item. avaliable quantity ${nonExpiredQuantity}`
    })
  }

  let remainingQuantity = quantity;

  for (const lot of inventoryItem.lots) {

    if (lot.quantity >= remainingQuantity) {
      // lot can accomodate quantity
      await prisma.lot.update({
        where: { id: lot.id },
        data: { quantity: { decrement: remainingQuantity } },
      });
      break;

    } else {
      // sell quantity is less than quantity in a particular lot
      await prisma.lot.delete({ where: { id: lot.id } });
      remainingQuantity -= lot.quantity;

    }
  }

  return res.json({});
  
})

/**
 * Get non-expired quantity of the item from the system
 * 
 * @param req HTTPs Request
 * @param res HTTPs Response
 * 
 * @returns 
 */
const getItemQuantity = asyncHandler(async (req: IGetItemQuantityRequest, res: Response) => {

  const { item } = req.params;

  const inventoryItem = await prisma.inventoryItem.findFirst({
    where: { name: item },
    include: {
      lots: { 
        where: { 
          expiry: { gte: new Date() } 
        }, 
        orderBy: { expiry: 'asc' },
        select: { quantity: true, expiry: true },
      }
    },
  });

  if (inventoryItem && inventoryItem.lots.length > 0) {
    // validTill - lots closest to expiration
    const validTill = inventoryItem?.lots[0]?.expiry.getTime();
    const quantity = inventoryItem?.lots?.reduce((acc, lot) => acc + lot.quantity, 0);

    return res.json({
      quantity,
      validTill,
    });

  } else {

    return res.json({
      quantity: 0,
      validTill: null,
    });

  }

})

export default {
  addItem,
  sellItem,
  getItemQuantity
}
