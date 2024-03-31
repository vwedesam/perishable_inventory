import { describe, expect, test } from '@jest/globals';
import { notFoundMiddleware } from '../../../middleware';
import { getMockReq, getMockRes } from '@jest-mock/express'

describe('notFoundMiddleware MiddleWare ', () => {

    test('should return appropraite error. ', async () => {

      const req = getMockReq();
      const { res, next } = getMockRes();

      notFoundMiddleware(req, res);
      
      expect(res.status).toBeCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
            status: "error",
            message: "Sorry, can't find the resource you're looking for. visit `/docs` for guide." 
        }),
      );
      
    });

});

