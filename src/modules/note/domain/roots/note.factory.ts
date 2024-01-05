import { err, ok, Result } from "neverthrow";
import Note, { NoteProperties } from "./note.domain";
import ErrorInterface from "../../../../core/error/error.interface";


export type NoteFactoryResult = Result<Note, Error>

export default class NoteFactory {
    static create(properties: NoteProperties): NoteFactoryResult {
        const noteProperties: NoteProperties = {
            ...properties,
            id: properties.id ?? crypto.randomUUID(),
            createdAt: properties.createdAt ?? new Date(),
            isDraft: false
        }

        let error: ErrorInterface;
        if (noteProperties.title.length > 120) {
            error ??= new Error();
            error.name = "Invalid note.title";
            error.message = "String max 120 characters";
            error.status = 412;
            return err(error);
        }

        if (noteProperties.description.length > 500) {
            error ??= new Error();
            error.name = "Invalid note.description";
            error.message = "String max 500 characters";
            error.status = 412;
            return err(error);
        }

        return ok(new Note(noteProperties));
    }
}
