import { QRL } from "@builder.io/qwik";

export type Props = {
    id?: string;
    action?: string;
    onSuccessForm$?: QRL<() => void>
}

export interface CreateTaskResult {
    id: string;
    title: string;
    description: string;
    isDraft: boolean;
    isComplete: boolean;
    endDate: Date | null;
    createdAt: Date;
    deletedAt: null;
}


export type TaskFormFields = Omit<CreateTaskResult, "createdAt" | "deletedAt" | "id">;
