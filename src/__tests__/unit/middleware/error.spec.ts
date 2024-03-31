import { describe, expect, test } from '@jest/globals';
import { errorMiddleware } from '../../../middleware';
import { getMockReq, getMockRes } from '@jest-mock/express';



describe('errorMiddleware MiddleWare ', () => {

    test('should return appropriate error. ', async () => {

      const msg = "Internal Server Error";

      const req = getMockReq();
      const { res, next } = getMockRes();
      const err = new Error();
      err.message = msg;

      jest.spyOn(console, 'error').mockImplementation()

      errorMiddleware(err, req, res, next);
      
      expect(res.status).toBeCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ 
            status: "error",
            message: msg
        }),
      );
      
    });

});

