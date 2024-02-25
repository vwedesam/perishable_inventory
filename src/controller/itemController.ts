import type { Request, Response } from 'express';
import prisma from '../prisma';
import type { IAddItemRequest, IGetItemQuantityRequest, ISellItemRequest } from 'src/types';

/**
 * 
 * 
 * @param req HTTPs Request
 * @param res HTTPs Response
 * 
 * @returns {}
 */
const addItem = async (req: IAddItemRequest, res: Response) => {

  const { quantity, expiry } = req.body;
  const { item } = req.params;

  const inventoryItem = await prisma.inventoryItem.upsert({
    where: { name: item },
    update: {
      lots: {
        create: {
          quantity,
          expiry: new Date(new Date().setMilliseconds(expiry)),
        },
      },
    },
    create: {
      name: item,
      lots: {
        create: {
          quantity,
          expiry: new Date(expiry),
        },
      },
    },
  });

  return res.json({});

}

/**
 * 
 * @param req HTTPs Request
 * @param res HTTPs Response
 * 
 * @returns {}
 */
const sellItem = async (req: ISellItemRequest, res: Response) => {

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

  if (inventoryItem) {

    let remainingQuantity = quantity;

    for (const lot of inventoryItem.lots) {

      if (lot.quantity >= remainingQuantity) {

        await prisma.lot.update({
          where: { id: lot.id },
          data: { quantity: { decrement: remainingQuantity } },
        });
        break;

      } else {

        await prisma.lot.delete({ where: { id: lot.id } });
        remainingQuantity -= lot.quantity;

      }
    }
  }

  return res.json({});
}

/**
 * 
 * @param req HTTPs Request
 * @param res HTTPs Response
 * 
 * @returns 
 */
const getItemQuantity = async (req: IGetItemQuantityRequest, res: Response) => {

  const { item } = req.params;

  const inventoryItem = await prisma.inventoryItem.findFirst({
    where: { name: item },
    include: {
      lots: { 
        where: { 
          expiry: { gte: new Date() } 
        }, 
        orderBy: { expiry: 'asc' } 
      }
    },
  });

  console.log(inventoryItem)

  if (inventoryItem && inventoryItem.lots.length > 0) {

    const validTill = inventoryItem?.lots[0]?.expiry.getTime();
    const quantity = inventoryItem.lots.reduce((acc, lot) => acc + lot.quantity, 0);

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

}

export default {
  addItem,
  sellItem,
  getItemQuantity
}
