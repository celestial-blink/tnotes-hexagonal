import TaskFactory from "./task.factory";

import type { TaskProperties } from "./types";

export default class Task {
    private readonly id: string;
    private readonly userId: string;
    private title: string;
    private description: string;
    private isDraft: boolean;
    private isComplete: boolean;
    private endDate: Date;
    private readonly createdAt: Date;
    private updatedAt: Date;
    private deletedAt: Date;

    constructor(properties: TaskProperties) {
        this.id = properties.id;
        this.userId = properties.userId;
        this.title = properties.title;
        this.description = properties.description;
        this.isDraft = properties.isDraft;
        this.isComplete = properties.isComplete;
        this.endDate = properties.endDate;
        this.createdAt = properties.createdAt;
        this.updatedAt = properties.updatedAt;
        this.deletedAt = properties.deletedAt;
    }

    properties(): TaskProperties {
        return {
            id: this.id,
            userId: this.userId,
            title: this.title,
            description: this.description,
            isDraft: this.isDraft,
            isComplete: this.isComplete,
            endDate: this.endDate,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt
        };
    }

    delete() {
        this.deletedAt = new Date();
    }

    update(fields: Partial<TaskProperties>) {
        const fieldsFiltered = Object.fromEntries(
            Object.entries(fields).filter(([_, v]) => v !== null)
        );
        Object.assign(this, fieldsFiltered);
        this.updatedAt = new Date();
    }

    static reconstitute(properties: TaskProperties): Task {
        const result = TaskFactory.create(properties);
        if (result.isErr()) throw result.error;
        return result.value;
    }
}
