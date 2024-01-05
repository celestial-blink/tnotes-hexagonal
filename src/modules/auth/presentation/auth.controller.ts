import { NextFunction, Request, Response } from "express";
import AuthApplication from "../application/auth.application";
import ErrorInterface from "../../../core/error/error.interface";
import Token from "../../../core/helpers/token";
import User from "../../user/domain/roots/user";
import Parameters from "../../../core/helpers/parameters";

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
            err.status = 404;

            return next(err);
        }

        const token = {
            accessToken: Token.generateAccessToken(userMatchResult)
        }

        const { id } = userMatchResult.properties();
        const newRefreshToken = Token.generateRefreshToken(id);

        res.cookie("refresh_token", newRefreshToken, Parameters.REFRESH_TOKEN_COOKIE_OPTIONS);
        return res.status(200).json(token);
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        const { id } = res.locals;
        const userResult = await this.application.getById(id);

        if (!userResult) {
            const err: ErrorInterface = new Error("User not found");
            err.status = 404;

            return next(err);
        }

        const logoutUser = await this.application.logout(userResult);
        if (logoutUser.isErr()) return next(logoutUser.error);

        res.cookie("refresh_token", "", { maxAge: Date.now() - 1, httpOnly: true, secure: true });
        return res.status(200).json(true);
    }
}

