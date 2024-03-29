import { QRL } from "@builder.io/qwik";

export type Props = {
    id?: string;
    action?: string;
    onSuccessForm$?: QRL<() => void>
}

export type CreateNoteResult = {
    id: string;
    title: string;
    description: string;
    isDraft: boolean;
    createdAt: Date;
    deletedAt: null;
}

export type NoteFormFields = Omit<CreateNoteResult, "createdAt" | "deletedAt" | "id">;
