export type NoteProperties = {
    id: string;
    userId: string;
    title: string;
    description: string;
    isDraft: boolean;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export type NoteFilterParams = {
    id: string,
    createdAt: Date,
    isDraft: boolean,
    title: string,
    page: number,
    pageSize: number,
    sort: "asc" | "desc"
}


export type NoteCreateParams = Omit<NoteProperties, "userId" | "id" | "createdAt" | "updatedAt" | "deletedAt">;

export type NoteUpdateParams = Omit<NoteProperties, "userId" | "createdAt" | "updatedAt" | "deletedAt">;

export type NoteFilterEntitiesResult = Pick<NoteProperties, "id" | "title" | "createdAt" | "isDraft">;

export type NoteFilterResult = {
    entities: NoteFilterEntitiesResult[],
    total: number
}

export type NoteLastNotesResult = Pick<NoteProperties, "id" | "title">[];
