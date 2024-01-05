import Task, { TaskProperties } from "../../domain/roots/task.domain";
import { Task as TaskEntity } from "@prisma/client";

export interface FromDataToResponse {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly isDraft: boolean;
    readonly isComplete: boolean;
    readonly endDate: Date;
    readonly createdAt: Date;
    readonly deletedAt: Date | null;
}

export default class TaskModelDto {
    static fromDomainToData(note: Task): TaskEntity {
        const properties = note.properties();

        const taskEntity: TaskEntity = {
            id: properties.id,
            idUser: properties.idUser,
            title: properties.title,
            description: properties.description,
            isDraft: properties.isDraft,
            isComplete: properties.isComplete,
            endDate: properties.endDate,
            createdAt: properties.deletedAt,
            updatedAt: properties.updatedAt,
            deletedAt: properties.deletedAt
        };

        return taskEntity;
    }

    static fromDataToResponse(
        taskEntity: TaskEntity | TaskEntity[]
    ): FromDataToResponse | FromDataToResponse[] {
        if (Array.isArray(taskEntity)) {
            return taskEntity.map((task) => {
                return {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    isDraft: task.isDraft,
                    isComplete: task.isComplete,
                    endDate: task.endDate,
                    createdAt: task.createdAt,
                    deletedAt: task.deletedAt
                };
            });
        }

        return {
            id: taskEntity.id,
            title: taskEntity.title,
            description: taskEntity.description,
            isDraft: taskEntity.isDraft,
            isComplete: taskEntity.isComplete,
            endDate: taskEntity.endDate,
            createdAt: taskEntity.createdAt,
            deletedAt: taskEntity.deletedAt
        };
    }

    static fromDataToDomain(taskEntity: TaskEntity): Task {
        const properties: TaskProperties = {
            id: taskEntity.id,
            idUser: taskEntity.idUser,
            title: taskEntity.title,
            description: taskEntity.description,
            isDraft: taskEntity.isDraft,
            isComplete: taskEntity.isComplete,
            endDate: taskEntity.endDate,
            createdAt: taskEntity.createdAt,
            updatedAt: taskEntity.updatedAt,
            deletedAt: taskEntity.deletedAt
        };

        return Task.reconstitute(properties);
    }
}
