import { NoteProperties } from "~/api/NoteApi/types";

export type TypeDataResult = {
    id: string,
    title: string,
    createdAt: string,
    isDraft: boolean,
    isComplete: boolean,
    endDate: string
};

export type TypeDataTotal = {
    total: number,
    totalPages: number,
    currentPage: number
};

export type TypeTaskResult = {
    data: TypeDataResult[] | null;
    total: TypeDataTotal | null
};
