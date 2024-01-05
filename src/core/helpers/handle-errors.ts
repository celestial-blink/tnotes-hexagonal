import { NextFunction, Request, Response } from "express";
import ErrorInterface from "../error/error.interface";
import Parameters from "./parameters";

export default class HandleErrors {
    static notFound(req: Request, res: Response, next: NextFunction) {
        const err: ErrorInterface = new Error();
        err.status = 404;
        err.name = "NotFound";
        err.message = "Not Found";

        next(err);
    }

    static generic(error: ErrorInterface, req: Request, res: Response, next: NextFunction) {
        const messageError: Record<string, any> = {
            name: error.name || "Internal Server Error",
            message: error.message || 'Internal Server Error',
        }

        if (Parameters.ENVIRONMENT !== 'production') messageError['stack'] = error.stack;
        
        res.status(error.status || 500).json(messageError);
    }
}