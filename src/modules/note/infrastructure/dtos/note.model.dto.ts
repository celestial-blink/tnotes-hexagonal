import Note from "../../domain/roots/note.domain";
import type { NoteProperties } from "../../domain/roots/types";
import { Note as NoteEntity } from "@prisma/client";

export interface FromDataToResponse {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly isDraft: boolean;
    readonly createdAt: Date;
    readonly deletedAt: Date | null;
}

export default class NoteModelDto {
    static fromDomainToData(note: Note): NoteEntity {
        const properties = note.properties();

        const noteEntity: NoteEntity = {
            id: properties.id,
            userId: properties.userId,
            title: properties.title,
            description: properties.description,
            createdAt: properties.deletedAt,
            isDraft: properties.isDraft,
            updatedAt: properties.updatedAt,
            deletedAt: properties.deletedAt
        };

        return noteEntity;
    }

    static fromDataToResponse(
        noteEntity: NoteEntity | NoteEntity[]
    ): FromDataToResponse | FromDataToResponse[] {
        if (Array.isArray(noteEntity)) {
            return noteEntity.map((note) => {
                return {
                    id: note.id,
                    title: note.title,
                    description: note.description,
                    isDraft: note.isDraft,
                    createdAt: note.createdAt,
                    deletedAt: note.deletedAt
                };
            });
        }

        return {
            id: noteEntity.id,
            title: noteEntity.title,
            description: noteEntity.description,
            isDraft: noteEntity.isDraft,
            createdAt: noteEntity.createdAt,
            deletedAt: noteEntity.deletedAt
        };
    }

    static fromDataToDomain(noteEntity: NoteEntity): Note {
        const properties: NoteProperties = {
            id: noteEntity.id,
            userId: noteEntity.userId,
            title: noteEntity.title,
            description: noteEntity.description,
            isDraft: noteEntity.isDraft,
            createdAt: noteEntity.createdAt,
            updatedAt: noteEntity.updatedAt,
            deletedAt: noteEntity.deletedAt
        };

        return Note.reconstitute(properties);
    }
}
