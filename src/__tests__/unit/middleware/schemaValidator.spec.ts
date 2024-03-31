import { describe, expect, test } from '@jest/globals';
import { schemaValidator } from '../../../middleware';
import { addItemSchema, sellItemSchema } from '../../../utils';
import { getMockReq, getMockRes } from '@jest-mock/express'

describe('Test addItemSchema with schemaValidator MiddleWare', () => {

  test('should return error with status 422 -- when body is empty ', async () => {

    const req = getMockReq({
      body: {}
    });
    const { res, next } = getMockRes();

    schemaValidator(addItemSchema)(req, res, next);
    
    expect(res.status).toBeCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'failed',
      }),
    );
    
  });

  test('should return error with status 422 -- when body contain param with negative number ', async () => {

    const req = getMockReq();
    const { res, next } = getMockRes({
      body: {
        "quantity": -20,
        "expiry": 10000
      }
    });

    schemaValidator(addItemSchema)(req, res, next);
    
    expect(res.status).toBeCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'failed',
      }),
    );
    
  });

  test('should return error with status 422 -- when body contain param with zero ', async () => {

    const req = getMockReq();
    const { res, next } = getMockRes({
      body: {
        "quantity": 0,
        "expiry": 10000
      }
    });

    schemaValidator(addItemSchema)(req, res, next);
    
    expect(res.status).toBeCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'failed',
      }),
    );
    
  });

  test('should return error with status 422 -- when body param contain a string ', async () => {

    const req = getMockReq();
    const { res, next } = getMockRes({
      body: {
        "quantity": "20",
        "expiry": 10000
      }
    });

    schemaValidator(addItemSchema)(req, res, next);
    
    expect(res.status).toBeCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'failed',
      }),
    );
    
  });

  test('should return error with status 422 -- when expiry is not valid ', async () => {

    const req = getMockReq();
    const { res, next } = getMockRes({
      body: {
        "quantity": 20,
        "expiry": -10000
      }
    });

    schemaValidator(addItemSchema)(req, res, next);
    
    expect(res.status).toBeCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'failed',
      }),
    );
    
  });

  test('should call next(Request) -- with valid request body  ', async () => {

    const req = getMockReq({
      body: {
        "quantity": 20,
        "expiry": 10000
      }
    });
    const { res, next } = getMockRes();

    schemaValidator(addItemSchema)(req, res, next);
    
    expect(next).toBeCalled();
    
  });

})

describe('Test sellItemSchema with schemaValidator MiddleWare', () => {

  test('should return error with status 422 -- when body is empty ', async () => {

    const req = getMockReq({
      body: {}
    });
    const { res, next } = getMockRes();

    schemaValidator(sellItemSchema)(req, res, next);
    
    expect(res.status).toBeCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'failed',
      }),
    );
    
  });

  test('should return error with status 422 -- when body contain param with negative number ', async () => {

    const req = getMockReq();
    const { res, next } = getMockRes({
      body: {
        "quantity": -20,
      }
    });

    schemaValidator(sellItemSchema)(req, res, next);
    
    expect(res.status).toBeCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'failed',
      }),
    );
    
  });

  test('should return error with status 422 -- when body contain param with zero ', async () => {

    const req = getMockReq();
    const { res, next } = getMockRes({
      body: {
        "quantity": -20,
      }
    });

    schemaValidator(sellItemSchema)(req, res, next);
    
    expect(res.status).toBeCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'failed',
      }),
    );
    
  });

  test('should return error with status 422 -- when body param contain a string ', async () => {

    const req = getMockReq();
    const { res, next } = getMockRes({
      body: {
        "quantity": "20"
      }
    });

    schemaValidator(sellItemSchema)(req, res, next);
    
    expect(res.status).toBeCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'failed',
      }),
    );
    
  });

  test('should call next(Request) -- with valid request body  ', async () => {

    const req = getMockReq({
      body: {
        "quantity": 20
      }
    });
    const { res, next } = getMockRes();

    schemaValidator(sellItemSchema)(req, res, next);
    
    expect(next).toBeCalled();
    
  });

})

