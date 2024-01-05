import TaskFactory from "./task.factory";

export interface TaskRequired {
    id: string;
    idUser: string;
    title: string;
    description: string;
    isDraft: boolean;
    isComplete: boolean;
    createdAt: Date;
}

export interface TaskOptional {
    endDate: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export type TaskProperties = TaskRequired & Partial<TaskOptional>;

export default class Task {
    private readonly id: string;
    private readonly idUser: string;
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
        this.idUser = properties.idUser;
        this.title = properties.title;
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
            idUser: this.idUser,
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

    update(fields: TaskProperties) {
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
