export interface TaskRequired {
    id: string;
    userId: string;
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
