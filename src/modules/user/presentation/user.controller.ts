import { NextFunction, Request, Response } from "express";
import UserApplication from "../application/user.application";
import { UserProperties } from "../domain/roots/user";
import UserFactory from "../domain/roots/user.factory";
import ResponseApi from "../../../core/helpers/response-api";

export default class UserController {
    private readonly application: UserApplication;
    constructor(application: UserApplication) {
        this.application = application;
    }

    async insert(req: Request, res: Response, next: NextFunction) {
        const { name, email, password } = req.body;
        const userProperties: UserProperties = {
            name,
            email,
            password,
            id: null,
            createdAt: null,
        };

        const userFactoryResult = UserFactory.create(userProperties);

        if (userFactoryResult.isErr()) return next(userFactoryResult.error);
        const user = userFactoryResult.value;

        const userCreateResult = await this.application.create(user);

        if (userCreateResult.isErr()) return next(userCreateResult.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(userCreateResult.value)
            );
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, password } = req.body;
        const userResult = await this.application.getById(id);

        if (userResult.isErr()) return next(userResult.error);

        const user = userResult.value;
        user.update({
            name,
            password,
        });

        const userUpdatedResult = await this.application.update(user);
        if (userUpdatedResult.isErr()) return next(userUpdatedResult.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(userUpdatedResult.value)
            );
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const users = await this.application.getAll();
        if (users.isErr()) return next(users.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(users.value)
            );
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const user = await this.application.getById(id);
        if (user.isErr()) return next(user.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(user.value)
            );
    }

    async getByEmail(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body;
        const user = await this.application.getByEmail(email);
        if (user.isErr()) return next(user.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(user.value)
            );
    }

    async getByPage(req: Request, res: Response, next: NextFunction) {
        const { page, pageSize } = req.params;
        const users = await this.application.getByPage(+page, +pageSize);
        if (users.isErr()) return next(users.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(users.value)
            );
    }
}

