import { NextFunction, Request, Response } from 'express';

import Token from "../../helpers/token";
import ErrorInterface from "../../error/error.interface";
import UserApplication from '../../../modules/user/application/user.application';
import UserInfrastructure from '../../../modules/user/infrastructure/user.infrastructure';
import Parameters from '../../helpers/parameters';

const infrastructure = new UserInfrastructure();
const userApplication = new UserApplication(infrastructure);

export default class AuthenticationMiddleware {
    static async canActive(req: Request, res: Response, next: NextFunction) {
        const { authorization } = req.headers;

        if (!authorization) {
            const error: ErrorInterface = new Error("User not authenticated");
            error.status = 401;

            return next(error);
        }

        const parts = authorization.split("Bearer");
        if (parts.length !== 2) {
            const error: ErrorInterface = new Error("User not authenticated");
            error.status = 401;

            return next(error);
        }

        const [_, token] = parts;

        const payloadAccessToken = await Token.validateAccessToken(token.trim());
        if (payloadAccessToken.isErr()) {
            if (payloadAccessToken.error.name === "TokenExpiredError") {
                const { refresh_token = "" } = req?.cookies ?? {};

                const payloadRefreshToken = await Token.validateRefreshToken(refresh_token);
                if (payloadRefreshToken.isErr()) {
                    const error: ErrorInterface = new Error("User not authenticated");
                    error.status = 401;
                    return next(error);
                }

                const userResult = await userApplication.getById(payloadRefreshToken.value.id);
                if (userResult.isErr()) {
                    const error: ErrorInterface = new Error("User not authenticated");
                    error.status = 401;

                    return next(error);
                }

                const newAccessToken = Token.generateAccessToken(userResult.value);

                const newRefreshToken = Token.generateRefreshToken(payloadRefreshToken.value.id);

                res.cookie("refresh_token", newRefreshToken, Parameters.REFRESH_TOKEN_COOKIE_OPTIONS);
                res.locals.accessToken = newAccessToken;
            }
        }

        next();
    }
}
