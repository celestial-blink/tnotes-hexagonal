import { NextFunction, Request, Response } from "express";
import AuthApplication from "../application/auth.application";
import ErrorInterface from "../../../core/error/error.interface";
import Token from "../../../core/helpers/token";
import ResponseApi from "../../../core/helpers/response-api";
import AuthSessionDto from "./dtos/response/auth-session.dto";
import type { UserProperties } from "../../user/domain/roots/types";
import crypto from "crypto";

export default class AuthController {
    private readonly application: AuthApplication;

    constructor(application: AuthApplication) {
        this.application = application;
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        const userMatchResult = await this.application.existingUser(email, password);

        if (!userMatchResult) {
            const err: ErrorInterface = new Error("User not found");
            err.name = "User";
            err.status = 404;

            return next(err);
        }

        const idToken = crypto.randomUUID();

        const accessToken = Token.generateAccessToken(userMatchResult, idToken);

        const { id } = userMatchResult.properties();
        const newRefreshToken = Token.generateRefreshToken(id, idToken);

        return res
            .status(200)
            .json(
                ResponseApi.success({ accessToken, refreshToken: newRefreshToken })
            );
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        const { user } = res.locals;
        const { id } = (user as UserProperties)
        const userResult = await this.application.getById(id);

        if (!userResult) {
            const err: ErrorInterface = new Error("User not found");
            err.status = 404;

            return next(err);
        }

        const logoutUser = await this.application.logout(userResult);
        if (logoutUser.isErr()) return next(logoutUser.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(logoutUser.value)
            );
    }

    async session(req: Request, res: Response, next: NextFunction) {
        const { user } = res.locals;

        return res
            .status(200)
            .json(
                ResponseApi.success(AuthSessionDto.fromDataToResponse(user))
            );
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        const { refreshtoken = "", authorization = "" } = req.headers;
        const parts = authorization.split("Bearer");
        const [_, token = ""] = parts;
        const payloadAccessToken = await Token.decodedAccessToken(token?.trim());

        const payloadRefreshToken = await Token.validateRefreshToken(refreshtoken as string, payloadAccessToken?.idToken ?? "");
        if (payloadRefreshToken.isErr()) {
            const error: ErrorInterface = new Error("User not authenticated");
            error.status = 401;
            return next(error);
        }

        const userResult = await this.application.getById(payloadRefreshToken.value.id);
        if (!userResult) {
            const error: ErrorInterface = new Error("User not authenticated");
            error.status = 401;

            return next(error);
        }

        const idToken = crypto.randomUUID();
        const newAccessToken = Token.generateAccessToken(userResult, idToken);
        const newRefreshToken = Token.generateRefreshToken(payloadRefreshToken.value.id, idToken);

        res.status(200).json(ResponseApi.success({ accessToken: newAccessToken, refreshToken: newRefreshToken }));
    }

    async validatePassword(req: Request, res: Response, next: NextFunction) {
        const { user } = res.locals;
        const { id: userId } = (user as UserProperties);

        const { password } = res.locals.body;

        const passwordMatchResult = await this.application.validatePassword(userId, password);

        if (!passwordMatchResult) {
            const err: ErrorInterface = new Error("Password not match");
            err.name = "Password";
            err.status = 404;

            return next(err);
        }

        return res
            .status(200)
            .json(
                ResponseApi.success({ password: passwordMatchResult })
            );
    }
}

