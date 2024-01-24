import { NoteProperties } from "../../../domain/roots/note.domain";

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
