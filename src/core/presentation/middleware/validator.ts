import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import ErrorInterface from "../../error/error.interface";

export default class Validator {
    static execute(validator: Record<string, any>) {
        return async (req: Request, res: Response, next: NextFunction) => {

            Object.keys(validator).forEach((key) => {
                const validatorDto = validator[key];
                let dataDto = {};

                if (["body", "params", "query", "headers"].includes(key))
                    dataDto = req[key as keyof Request];

                const validation = validatorDto.validate(dataDto);

                if (!validation.success) {
                    const error: ErrorInterface = new Error();
                    error.name = "ValidationError";
                    error.message = req.path + " - Validation Error";
                    error.stack = JSON.stringify(validation.error);
                    error.status = 411;

                    return next(error);
                }
            });
            return next();
        };
    }
}
