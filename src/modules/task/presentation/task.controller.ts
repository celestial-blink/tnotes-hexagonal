import { Request, Response, NextFunction } from "express";


import TaskApplication from "../application/task.application";
import { TaskProperties } from "../domain/roots/task.domain";
import TaskFactory from "../domain/roots/task.factory";
import ResponseApi from "../../../core/helpers/response-api";
import { UserProperties } from "../../user/domain/roots/user";

export default class TaskController {
    private application;

    constructor(application: TaskApplication) {
        this.application = application;
    }

    async save(req: Request, res: Response, next: NextFunction) {
        const { title, description, isDraft, isComplete, endDate } = req.body;
        const { user } = res.locals;
        const { id: idUser } = user as UserProperties;
        const taskProperties: TaskProperties = {
            id: null,
            createdAt: null,
            description,
            idUser,
            title,
            isDraft,
            isComplete,
            endDate
        }

        const factoryTask = TaskFactory.create(taskProperties);
        if (factoryTask.isErr()) return next(factoryTask.error);

        const saveResult = await this.application.save(factoryTask.value);
        if (saveResult.isErr()) return next(saveResult.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(saveResult.value)
            );
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const getAllResult = await this.application.getAll();

        return res
            .status(200)
            .json(
                ResponseApi.success(getAllResult)
            );
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getByIdResult = await this.application.getById(id);
        if (getByIdResult.isErr()) return next(getByIdResult.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(getByIdResult.value)
            );
    }

    async getByTitle(req: Request, res: Response, next: NextFunction) {
        const { title, page, pageSize } = req.params;

        const getByTitleResult = await this.application.getByTitle(title, +page, +pageSize);
        if (getByTitleResult.isErr()) return next(getByTitleResult.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(getByTitleResult.value)
            );
    }

    async getByDraft(req: Request, res: Response, next: NextFunction) {
        const { page, pageSize } = req.params;

        const getByDraftResult = await this.application.getByDraft(+page, +pageSize);
        if (getByDraftResult.isErr()) return next(getByDraftResult.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(getByDraftResult.value)
            );
    }

    async getByDeletedAt(req: Request, res: Response, next: NextFunction) {
        const { page, pageSize } = req.params;

        const getByDeletedAtResult = await this.application.getByDeletedAt(+page, +pageSize);
        if (getByDeletedAtResult.isErr()) return next(getByDeletedAtResult.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(getByDeletedAtResult.value)
            );
    }

    async getByPage(req: Request, res: Response, next: NextFunction) {
        const { page, pageSize } = req.params;

        const getByPageResult = await this.application.getByPage(+page, +pageSize);
        if (getByPageResult.isErr()) return next(getByPageResult.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(getByPageResult.value)
            );
    }

    async getCountPending(req: Request, res: Response, next: NextFunction) {
        const { user } = res.locals;
        const { id: idUser } = user as UserProperties;

        const getCountPendingResult = await this.application.getCountPending(idUser);
        if (getCountPendingResult.isErr()) return next(getCountPendingResult.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(getCountPendingResult.value)
            );
    }
}
