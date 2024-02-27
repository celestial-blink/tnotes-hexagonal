export interface NoteRequired {
    id: string;
    userId: string;
    title: string;
    description: string;
    isDraft: boolean;
    createdAt: Date;
}

export interface NoteOptional {
    updatedAt: Date;
    deletedAt: Date;
}

export type NoteProperties = NoteRequired & Partial<NoteOptional>;
