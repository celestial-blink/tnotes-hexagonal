import { PrismaClient } from "@prisma/client";
import { Result, err, ok } from "neverthrow";
import { TaskRepository } from "../domain/repositories/task.repository";
import Task from "../domain/roots/task.domain";
import TaskModelDto, { FromDataToResponse } from "./dtos/task.model.dto";
import DataBaseException from "../../../core/exceptions/database.exception";

export type TaskResult = Result<
    FromDataToResponse | FromDataToResponse[],
    DataBaseException
>;
export type TaskDomainResult = Result<Task, DataBaseException>;
export type TaskGetAndTotal = Result<
    [entities: FromDataToResponse[], total: number],
    DataBaseException
>;


export default class TaskInfrastructure implements TaskRepository {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    async save(task: Task): Promise<TaskResult> {
        try {
            const taskEntity = TaskModelDto.fromDomainToData(task);
            const { id } = task.properties();
            const result = await this.prisma.task.upsert({
                create: {
                    ...taskEntity,
                },
                update: {
                    ...taskEntity,
                },
                where: { id },
            });

            return ok(TaskModelDto.fromDataToResponse(result));
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getAll(): Promise<TaskResult> {
        try {
            const result = await this.prisma.task.findMany();
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

    async getByTitle(title: string, page: number, pageSize: number): Promise<TaskGetAndTotal> {
        try {
            const total = await this.prisma.task.count({
                where: {
                    title: {
                        contains: title
                    }
                }
            });

            const result = await this.prisma.task.findMany({
                where: {
                    title: {
                        contains: title
                    }
                },
                skip: page * pageSize,
                take: pageSize,
            });

            const entities = TaskModelDto.fromDataToResponse(
                result
            ) as FromDataToResponse[];

            return ok([entities, total]);
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getByDraft(page: number, pageSize: number): Promise<TaskGetAndTotal> {
        try {
            const total = await this.prisma.task.count({
                where: { isDraft: true }
            });

            const result = await this.prisma.task.findMany({
                where: {
                    isDraft: true
                },
                skip: page * pageSize,
                take: pageSize,
            });

            const entities = TaskModelDto.fromDataToResponse(
                result
            ) as FromDataToResponse[];

            return ok([entities, total]);
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }
    async getByDeletedAt(page: number, pageSize: number): Promise<TaskGetAndTotal> {
        try {
            const total = await this.prisma.task.count({
                where: {
                    deletedAt: {
                        not: { not: null }
                    }
                }
            });
            const result = await this.prisma.task.findMany({
                where: {
                    deletedAt: {
                        not: { not: null }
                    }
                },
                skip: page * pageSize,
                take: pageSize,
            });

            const entities = TaskModelDto.fromDataToResponse(
                result
            ) as FromDataToResponse[];

            return ok([entities, total]);
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }
    async getByPage(page: number, pageSize: number): Promise<TaskGetAndTotal> {
        try {
            const total = await this.prisma.task.count({
                where: { deletedAt: null },
            });
            const note = await this.prisma.task.findMany({
                where: { deletedAt: null },
                skip: page * pageSize,
                take: pageSize,
            });

            const entities = TaskModelDto.fromDataToResponse(
                note
            ) as FromDataToResponse[];
            return ok([entities, total]);
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getByComplete(page: number, pageSize: number): Promise<TaskGetAndTotal> {
        try {
            const total = await this.prisma.task.count({
                where: { isComplete: true },
            });
            const note = await this.prisma.task.findMany({
                where: { isComplete: true },
                skip: page * pageSize,
                take: pageSize,
            });

            const entities = TaskModelDto.fromDataToResponse(
                note
            ) as FromDataToResponse[];
            return ok([entities, total]);
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }
    async getByEndDate(page: number, pageSize: number): Promise<TaskGetAndTotal> {
        try {

            const total = await this.prisma.task.count({
                where: { endDate: { not: null } } ,
            });

            const note = await this.prisma.task.findMany({
                where: { endDate: { not: null } },
                skip: page * pageSize,
                take: pageSize,
            });

            const entities = TaskModelDto.fromDataToResponse(
                note
            ) as FromDataToResponse[];
            return ok([entities, total]);
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }
}
