import {Response, Send} from 'express';

type ResponseData = Record<string, any> | Record<string, any>[];

/**
 * This class is responsible for handling api responses.
 */
class ResponseHandler {

    // Share method to send the response as per DRY principle.
    private static send(res: Response, status: number, body: Record<string, any>) {
        return res.status(status).json(body);
    }

    /**
     * Send success response back to the requester.
     * @param res
     * @param message
     * @param code
     * @param data
     */
    static sendSuccess(res: Response, message: string, code: number = 200, data?: ResponseData) {
        return this.send(res, code, {
            status: 'success',
            message,
            data: data ?? {},
        });
    }

    /**
     * Send error response back to the requester.
     * @param res
     * @param message
     * @param code
     * @param errors
     */
    static sendError(res: Response, message: string, code = 500, errors?: any) {
        const body: Record<string, any> = {
            status: 'error',
            message,
        };

        if (errors) {
            body.errors = errors;
        }

        return this.send(res, code, body);
    }
}

export default ResponseHandler;
