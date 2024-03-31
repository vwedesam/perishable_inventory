import { describe, expect, test } from '@jest/globals';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import prisma from '../../prisma';
import type { PrismaClient } from '@prisma/client';
import ItemController from '../../controller/itemController';
import { schemaValidator } from '../../middleware';
import { addItemSchema, sellItemSchema } from '../../utils';
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mockItem, mockLots } from '../__mocks__/models';

jest.mock('../../prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

beforeEach(() => {
  mockReset(prismaMock)
})

describe('Test controller.addItem ', () => {

  test('should add item successfully with valid body param  ', async () => {

    const req = getMockReq({
      body: {
        "quantity": 20,
        "expiry": 10000
      }
    });
    const { res, next } = getMockRes({
      statusCode: 200
    });

    schemaValidator(addItemSchema)(req, res, next);
    
    expect(next).toBeCalled();
  
    prismaMock.inventoryItem.upsert.mockResolvedValue(mockItem);

    await ItemController.addItem(req, res);

    expect(res.statusCode).toEqual(200);
    expect(res.json).toBeCalledWith({});
    
  });

})

describe('Test controller.sellItem ', () => {

  test('should return error when item does not exist. ', async () => {

    const req = getMockReq({
      body: {
        "quantity": 20
      },
      params: {
        item: "bar-foo"
      }
    });
    const { res, next } = getMockRes();

    schemaValidator(sellItemSchema)(req, res, next);
    
    expect(next).toBeCalled();
  
    prismaMock.inventoryItem.findFirst.mockResolvedValue(null);

    await ItemController.sellItem(req, res);

    expect(res.status).toBeCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'failed',
      }),
    );
    
  });

  test('should return error when item to sell is greater than available item . ', async () => {

    const item = "bar-foo"; 
    const nonExpiredQuantity = mockLots.reduce((total, _lot)=> total += _lot?.quantity, 0)
    const req = getMockReq({
      body: {
        "quantity": 20
      },
      params: {
        item: item
      }
    });
    const { res, next } = getMockRes();

    schemaValidator(sellItemSchema)(req, res, next);
    
    expect(next).toBeCalled();
  
    prismaMock.inventoryItem.findFirst.mockResolvedValue(mockItem);

    await ItemController.sellItem(req, res);

    expect(res.status).toBeCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'failed',
        message: `Can't sell more than the non-expired quantity of the ${item} item. avaliable quantity ${nonExpiredQuantity}`
      }),
    );
    
  });

  test('should sell item successfully. ', async () => {

    const item = "bar-foo"; 
    const nonExpiredQuantity = mockLots.reduce((total, _lot)=> total += _lot?.quantity, 0)
    const req = getMockReq({
      body: {
        "quantity": 4
      },
      params: {
        item: item
      }
    });
    const { res, next } = getMockRes({
      statusCode: 200
    });

    schemaValidator(sellItemSchema)(req, res, next);
    
    expect(next).toBeCalled();
  
    prismaMock.inventoryItem.findFirst.mockResolvedValue(mockItem);

    await ItemController.sellItem(req, res);

    expect(res.statusCode).toEqual(200);
    expect(res.json).toBeCalledWith({});
    
  });

})

describe('Test controller.getItemQuantity ', () => {

  test('should return quantity: 0 and validTill: null; when item does not exist. ', async () => {

    const req = getMockReq({
      params: {
        item: "bar"
      }
    });
    const { res, next } = getMockRes();
  
    prismaMock.inventoryItem.findFirst.mockResolvedValue(null);

    await ItemController.getItemQuantity(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        quantity: 0,
        validTill: null,
      })
    );
    
  });

  test('should return quantity: 0 and validTill: null for an item with expired lots ', async () => {

    const req = getMockReq({
      params: {
        item: "bar"
      }
    });
    const { res, next } = getMockRes();

    const _mockItem  = {
      ...mockItem,
      lots: []
    };
  
    prismaMock.inventoryItem.findFirst.mockResolvedValue(_mockItem);

    await ItemController.getItemQuantity(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        quantity: 0,
        validTill: null,
      })
    );
    
  });

  test('should return correct number of quantity and validTill for an item with non-expired lots ', async () => {

    const nonExpiredQuantity = mockLots.reduce((total, _lot)=> total += _lot?.quantity, 0);
    const _lots = mockItem?.lots!
    const validTill = _lots[0]?.expiry.getTime();
    const req = getMockReq({
      params: {
        item: "bar"
      }
    });
    const { res, next } = getMockRes({
      statusCode: 200
    });
  
    prismaMock.inventoryItem.findFirst.mockResolvedValue(mockItem);

    await ItemController.getItemQuantity(req, res);

    expect(res.statusCode).toEqual(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        quantity: nonExpiredQuantity,
        validTill: validTill,
      })
    );
    
  });

})

