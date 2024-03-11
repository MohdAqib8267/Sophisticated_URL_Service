import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let token = req.headers['authorization'];
    if (!token) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }
    try {
      token = token.split(' ')[1];

      // Verify token
      jwt.verify(token, process.env.JWTKEY, (err, valid) => {
        if (err) {
          res.status(HttpStatus.FORBIDDEN).json('Token is not valid');
        } else {
          // Assign the user information to the request
          (req as any).user = valid;
          next();
        }
      });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.FORBIDDEN).json('You are not authorized');
    }
  }
}
