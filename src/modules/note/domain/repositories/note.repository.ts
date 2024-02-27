import Note from "../roots/note.domain";
import { NoteResult, NoteDomainResult, LastNotesResult, TaskFilterResult } from "../../infrastructure/note.infrastructure";
import { FilterNoteDto } from "../../application/dtos/response/filter.dto";
import { TypePagination } from "../../../../core/application/dto/TypePagination";

export interface NoteRepository {
    save(note: Note): Promise<NoteResult>;
    getById(id: string): Promise<NoteDomainResult>;
    getFilter(userId: string, filters: Partial<FilterNoteDto>, pagination: TypePagination): Promise<TaskFilterResult>;
    getLastNotes(userId: string): Promise<LastNotesResult>;
}
