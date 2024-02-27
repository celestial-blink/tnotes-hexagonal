export type TaskProperties = {
    id: string,
    userId: string;
    title: string;
    description: string;
    isDraft: boolean;
    isComplete: boolean;
    endDate: Date | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}


export type TaskFilters = {
    id: string,
    userId: string;
    title: string;
    isDraft: boolean,
    isComplete: boolean;
    endDate: Date;
    createdAt: Date,
    page: number,
    pageSize: number,
    sort: "asc" | "desc"
}

export type TaskCreateParams = Omit<TaskProperties, "id" | "createdAt" | "userId" | "updatedAt" | "deletedAt">;

export type TaskUpdateParams = Omit<TaskProperties, "userId" | "createdAt" | "updatedAt" | "deletedAt">;

export type TaskFilterResult = {
    entities: Omit<TaskProperties, "userId" | "updatedAt" | "deletedAt">[],
    total: number
}

export type TaskOnlyFilterResult = Omit < TaskProperties, "userId" | "updatedAt" | "deletedAt" > [];

export type TaskCountPendingResult = {
    total: number;
    totalComplete: number;
}

