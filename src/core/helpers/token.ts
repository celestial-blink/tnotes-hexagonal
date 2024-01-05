import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ok, err, Result } from "neverthrow";

import User from "../../modules/user/domain/roots/user";
import Parameters from "./parameters";
import ErrorInterface from "../error/error.interface";

export type PayloadTokenResult = {
    iat: number,
    exp: number,
    name: string,
    email: string,
    id: string
}
export type PayloadRefreshTokenResult = {
    iat: number,
    exp: number,
    id: string
}

export type ValidateAccessTokenResult = Result<PayloadTokenResult, ErrorInterface>;
export type ValidateRefreshTokenResult = Result<PayloadRefreshTokenResult, ErrorInterface>;

export default class Token {
    static generateAccessToken(user: User): string {
        const currentDate = new Date();
        const { name, email, id } = user.properties();

        const payload: PayloadTokenResult = {
            iat: currentDate.getTime(),
            exp: Parameters.TOKEN_EXPIRES_TIME,
            id,
            name,
            email,
        };

        return jwt.sign(payload, Parameters.TOKEN_SECRET_KEY);
    }

    static generateRefreshToken(id: string): string {
        const currentDate = new Date();

        const payload: PayloadRefreshTokenResult = {
            iat: currentDate.getTime(),
            exp: Parameters.REFRESH_TOKEN_EXPIRES_TIME,
            id
        };

        return jwt.sign(payload, Parameters.REFRESH_TOKEN_SECRET_KEY);
    }

    static async validateAccessToken(accessToken: string): Promise<ValidateAccessTokenResult> {
        try {

            const payload = jwt.verify(accessToken, Parameters.TOKEN_SECRET_KEY) as PayloadTokenResult;
            if (payload.exp < Date.now()) {
                const errorToken: ErrorInterface = new Error();
                errorToken.name = "TokenExpiredError";
                errorToken.message = "jwt expired";
                errorToken.status = 401;

                return err(errorToken);
            }

            return ok(payload);
        } catch (error) {
            return err(error);
        }
    }

    static async decodedAccessToken(accessToken: string) {
        return jwt.decode(accessToken) as PayloadTokenResult;
    }

    static async validateRefreshToken(refreshToken: string): Promise<ValidateRefreshTokenResult> {
        try {
            const payload = jwt.verify(refreshToken, Parameters.REFRESH_TOKEN_SECRET_KEY) as PayloadRefreshTokenResult;
            if (payload.exp < Date.now()) {
                const errorToken: ErrorInterface = new Error();
                errorToken.name = "TokenExpiredError";
                errorToken.message = "jwt expired";
                errorToken.status = 401;

                return err(errorToken);
            }
            return ok(payload);
        } catch (error) {
            return err(error);
        }

    }
}
