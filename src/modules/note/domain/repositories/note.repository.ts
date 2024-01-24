import Note from "../roots/note.domain";
import { NoteResult, NoteDomainResult, NoteGetAndTotal, LastNotesResult } from "../../infrastructure/note.infrastructure";

export interface NoteRepository {
    save(note: Note): Promise<NoteResult>;
    getAll(): Promise<NoteResult>;
    getById(id: string): Promise<NoteDomainResult>;
    getByTitle(title: string, page: number, pageSize: number): Promise<NoteGetAndTotal>;
    getByDraft(page: number, pageSize: number): Promise<NoteGetAndTotal>;
    getByDeletedAt(page: number, pageSize: number): Promise<NoteGetAndTotal>;
    getByPage(page: number, pageSize: number): Promise<NoteGetAndTotal>;
    getLastNotes(idUser: string): Promise<LastNotesResult>;
}
