import NoteFactory from "./note.factory";

import type { NoteProperties } from "./types";

export default class Note {
    private readonly id: string;
    private readonly userId: string;
    private title: string;
    private description: string;
    private isDraft: boolean;
    private readonly createdAt: Date;
    private updatedAt: Date;
    private deletedAt: Date;

    constructor(properties: NoteProperties) {
        this.id = properties.id;
        this.userId = properties.userId;
        this.title = properties.title;
        this.description = properties.description;
        this.isDraft = properties.isDraft;
        this.createdAt = properties.createdAt;
        this.updatedAt = properties.updatedAt;
        this.deletedAt = properties.deletedAt;
    }

    properties(): NoteProperties {
        return {
            id: this.id,
            userId: this.userId,
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

    update(fields: Partial<NoteProperties>) {
        const fieldsFiltered = Object.fromEntries(
            Object.entries(fields).filter(([_, v]) => v !== null && v !== undefined)
        );
        this.updatedAt = new Date();
        Object.assign(this, fieldsFiltered);
    }

    static reconstitute(properties: NoteProperties): Note {
        const result = NoteFactory.create(properties);
        if (result.isErr()) throw result.error;
        return result.value;
    }
}
