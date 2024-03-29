import { Request, Response, NextFunction } from "express";

import TaskApplication from "../application/task.application";
import type { TaskProperties } from "../domain/roots/types";
import TaskFactory from "../domain/roots/task.factory";
import ResponseApi from "../../../core/helpers/response-api";
import type { UserProperties } from "../../user/domain/roots/types";
import { TypeTaskFilterDto } from "./dto/request/task-filter.dto";

export default class TaskController {
    private application;

    constructor(application: TaskApplication) {
        this.application = application;
    }

    async save(req: Request, res: Response, next: NextFunction) {
        const { title, description, isDraft, isComplete, endDate } = req.body;

        const { user } = res.locals;
        const { id: userId } = user as UserProperties;
        const taskProperties: TaskProperties = {
            id: null,
            createdAt: null,
            description,
            userId,
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

    async getCountPending(req: Request, res: Response, next: NextFunction) {
        const { user } = res.locals;
        const { id: userId } = user as UserProperties;

        const getCountPendingResult = await this.application.getCountPending(userId);
        if (getCountPendingResult.isErr()) return next(getCountPendingResult.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(getCountPendingResult.value)
            );
    }

    async getFilter(req: Request, res: Response, next: NextFunction) {
        const { user } = res.locals;
        const { id: userId } = user as UserProperties;

        const query = res.locals.query as TypeTaskFilterDto;

        const filterParams: Partial<TypeTaskFilterDto> = {
            id: query.id,
            title: query.title,
            createdAt: query.createdAt,
            endDate: query.endDate,
            isComplete: query.isComplete,
            isDraft: query.isDraft,
        };

        const getFilterResult = await this.application.filter(userId, filterParams, { page: query.page, pageSize: query.pageSize }, query.sort);

        if (getFilterResult.isErr()) return next(getFilterResult.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(getFilterResult.value)
            );
    }

    async getOnlyFilter(req: Request, res: Response, next: NextFunction) {
        const { user } = res.locals;
        const { id: userId } = user as UserProperties;

        const query = res.locals.query as TypeTaskFilterDto;

        const filterParams: Partial<TypeTaskFilterDto> = {
            id: query.id,
            createdAt: query.createdAt,
            title: query.title,
            endDate: query.endDate,
            isComplete: query.isComplete,
            isDraft: query.isDraft
        };

        const getFilterResult = await this.application.onlyFilter(userId, filterParams, { page: query.page, pageSize: query.pageSize }, query.sort);

        if (getFilterResult.isErr()) return next(getFilterResult.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(getFilterResult.value)
            );
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const taskResult = await this.application.getById(id);
        if (taskResult.isErr()) {
            return next(taskResult.error);
        }

        const task = taskResult.value;
        task.delete();

        const taskRemoveResult = await this.application.remove(task);
        if (taskRemoveResult.isErr()) {
            return next(taskRemoveResult.error);
        }

        return res
            .status(200)
            .json(
                ResponseApi.success(taskRemoveResult.value)
            );
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { title, description, isDraft, isComplete, endDate } = req.body;

        const taskResult = await this.application.getById(id);
        if (taskResult.isErr()) {
            return next(taskResult.error);
        }

        const task = taskResult.value;
        task.update({
            title,
            description,
            isDraft,
            isComplete,
            endDate
        })

        const taskUpdatedResult = await this.application.update(task);
        if (taskUpdatedResult.isErr()) {
            return next(taskUpdatedResult.error);
        }

        return res
            .status(200)
            .json(
                ResponseApi.success(taskUpdatedResult.value)
            );
    }
}
