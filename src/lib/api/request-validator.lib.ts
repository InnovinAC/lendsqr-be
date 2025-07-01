import { type Request, type Response, type NextFunction } from 'express'
import createError from 'http-errors'
import { z, type ZodSchema } from 'zod'

class RequestValidator {
    static validate = function (
        schema: ZodSchema<any>,
        property: 'params' | 'query' | 'body' = 'body'
    ) {
        return (req: Request , _: Response, next: NextFunction) => {
            let data = req[property]

            try {
                schema.parse(data)
                next()
            } catch (error) {
                if (error instanceof z.ZodError) {
                    // Extract error messages from Zod errors
                    const message = error.errors
                        .map((err) => `${err.path.join('.')}: ${err.message}`)
                        .join(', ')

                    next(createError.UnprocessableEntity(message))
                } else {
                    next(createError.InternalServerError('Validation error'))
                }
            }
        }
    }
}

export default RequestValidator;