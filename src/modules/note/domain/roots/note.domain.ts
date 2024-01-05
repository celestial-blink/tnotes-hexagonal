import NoteFactory from "./note.factory";

export interface NoteRequired {
    id: string;
    idUser: string;
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

export default class Note {
    private readonly id: string;
    private readonly idUser: string;
    private title: string;
    private description: string;
    private isDraft: boolean;
    private readonly createdAt: Date;
    private updatedAt: Date;
    private deletedAt: Date;

    constructor(properties: NoteProperties) {
        this.id = properties.id;
        this.idUser = properties.idUser;
        this.title = properties.title;
        this.isDraft = properties.isDraft;
        this.createdAt = properties.createdAt;
        this.updatedAt = properties.updatedAt;
        this.deletedAt = properties.deletedAt;
    }

    properties(): NoteProperties {
        return {
            id: this.id,
            idUser: this.idUser,
            title: this.title,
            description: this.description,
            isDraft: this.isDraft,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
        };
    }

    delete() {
        this.deletedAt = new Date();
    }

    update(fields: NoteProperties) {
        const fieldsFiltered = Object.fromEntries(
            Object.entries(fields).filter(([_, v]) => v !== null)
        );
        Object.assign(this, fieldsFiltered);
        this.updatedAt = new Date();
    }

    static reconstitute(properties: NoteProperties): Note {
        const result = NoteFactory.create(properties);
        if (result.isErr()) throw result.error;
        return result.value;
    }
}
