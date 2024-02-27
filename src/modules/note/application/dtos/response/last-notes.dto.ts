import type { NoteProperties } from "../../../domain/roots/types";

export type LastNotesFromDataToResponse = {
    id: string,
    title: string
}

export default class LastNotesDto {
    static fromDataToResponse(note: Partial<NoteProperties>): LastNotesFromDataToResponse {
        return {
            id: note.id,
            title: note.title
        }
    }
}
