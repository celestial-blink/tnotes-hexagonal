import { PrismaClient } from "@prisma/client";

import { Result, err, ok } from "neverthrow";
import { TaskRepository } from "../domain/repositories/task.repository";
import Task from "../domain/roots/task.domain";
import TaskModelDto, { FromDataToResponse } from "./dtos/task.model.dto";
import DataBaseException from "../../../core/exceptions/database.exception";
import { CountPendingFromDataToResponse } from "../application/response/count-pending.dto";
import FilterDto, { FilterDtoFromDataToResponse } from "../application/response/filter.dto";
import { TypePagination } from "../../../core/application/dto/TypePagination";
import Parameters from "../../../core/helpers/parameters";

export type TaskResult = Result<
    FromDataToResponse | FromDataToResponse[],
    DataBaseException
>;
export type TaskDomainResult = Result<Task, DataBaseException>;

export type TaskFilterResult = Result<
    { entities: FilterDtoFromDataToResponse[], total: number },
    DataBaseException
>;

export type TaskOnlyFilterResult = Result<
    FilterDtoFromDataToResponse[],
    DataBaseException
>;

export type getCountPendingResult = Result<CountPendingFromDataToResponse, DataBaseException>;

export default class TaskInfrastructure implements TaskRepository {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    async save(task: Task): Promise<TaskResult> {
        try {
            const taskEntity = TaskModelDto.fromDomainToData(task);
            const { id, userId, ...rest } = taskEntity;

            const result = await this.prisma.task.upsert({
                where: { id },
                create: {
                    ...rest,
                    user: {
                        connect: {
                            id: userId
                        }
                    }
                },
                update: { ...rest },
                include: { user: true }
            });

            return ok(TaskModelDto.fromDataToResponse(result));
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getById(id: string): Promise<TaskDomainResult> {
        try {
            const result = await this.prisma.task.findFirst({
                where: { id }
            });

            return ok(TaskModelDto.fromDataToDomain(result));
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getCountPending(userId: string): Promise<getCountPendingResult> {
        try {
            const countTask = await this.prisma.task.count({
                where: { userId, isDraft: false }
            });

            const notes = await this.prisma.task.count({
                where: {
                    userId,
                    isComplete: true,
                    isDraft: false,
                }
            });

            return ok({ total: countTask, totalComplete: notes });
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getFilter(userId: string, filters: Partial<FilterDtoFromDataToResponse>, pagination: TypePagination, sort: "asc" | "desc"): Promise<TaskFilterResult> {
        try {
            const countTask = await this.prisma.task.count({
                where: { userId, isDraft: false, deletedAt: null }
            });

            const tasks = await this.prisma.task.findMany({
                select: { id: true, title: true, createdAt: true, isDraft: true, endDate: true, isComplete: true },
                orderBy: { createdAt: sort },
                where: {
                    userId,
                    deletedAt: null,
                    ...filters
                },
                skip: (pagination.page - 1) * pagination.pageSize,
                take: pagination.pageSize
            });

            const result = tasks.map(task => {
                return FilterDto.fromDataToResponse(task);
            });

            return ok({ entities: result, total: countTask });
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getOnlyFilter(userId: string, filters: Partial<FilterDtoFromDataToResponse>, pagination: TypePagination, sort: "asc" | "desc"): Promise<TaskOnlyFilterResult> {
        try {
            const tasks = await this.prisma.task.findMany({
                select: { id: true, title: true, createdAt: true, isDraft: true, endDate: true, isComplete: true },
                orderBy: { createdAt: sort },
                where: {
                    userId,
                    deletedAt: null,
                    ...filters
                },
                skip: (pagination.page - 1) * Parameters.FILTER_PER_PAGE,
                take: Parameters.FILTER_PER_PAGE
            });

            const result = tasks.map(task => {
                return FilterDto.fromDataToResponse(task);
            });

            return ok(result);
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }
}
