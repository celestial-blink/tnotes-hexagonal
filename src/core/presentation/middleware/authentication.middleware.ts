import { NextFunction, Request, Response } from 'express';

import Token from "../../helpers/token";
import ErrorInterface from "../../error/error.interface";

export default class AuthenticationMiddleware {
    static async canActive(req: Request, res: Response, next: NextFunction) {
        const { authorization } = req.headers;

        if (!authorization) {
            const error: ErrorInterface = new Error("User not authenticated");
            error.name = "User unauthenticated";
            error.status = 401;

            return next(error);
        }

        const parts = authorization.split("Bearer");
        if (parts.length !== 2) {
            const error: ErrorInterface = new Error("User not authenticated");
            error.name = "User unauthenticated";
            error.status = 401;

            return next(error);
        }

        const [_, token = ""] = parts;

        const payloadAccessToken = await Token.validateAccessToken(token.trim());

        if (payloadAccessToken.isErr()) {
            const error: ErrorInterface = new Error("User not authenticated");
            error.name = "User unauthenticated";
            error.status = 401;
            return next(error);
        } else {
            res.locals.user = payloadAccessToken.value;
        }

        next();
    }
}
