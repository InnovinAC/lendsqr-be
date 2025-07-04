import { type Request, type Response, type NextFunction } from 'express';
import createError from 'http-errors';
import { z, type ZodSchema } from 'zod';

class RequestValidator {
  static validate = function (
    schema: ZodSchema<any>,
    property: 'params' | 'query' | 'body' = 'body',
  ) {
    return (req: Request, _: Response, next: NextFunction) => {
      let data = req[property];

      try {
        schema.parse(data);
        return next();
      } catch (error) {
        if (error instanceof z.ZodError) {
          const message = error.errors
            .map((err) => {
              const path = err.path.length > 0 ? err.path.join('.') : property;
              return `${path}: ${err.message}`;
            })
            .join('; ');

          return next(createError.UnprocessableEntity(message));
        } else {
          return next(createError.InternalServerError('Validation error'));
        }
      }
    };
  };
}

export default RequestValidator;
