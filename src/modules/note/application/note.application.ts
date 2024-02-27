import { NoteRepository } from "../domain/repositories/note.repository";
import Note from "../domain/roots/note.domain";
import { TypePagination } from "../../../core/application/dto/TypePagination";
import { FilterNoteDto } from "./dtos/response/filter.dto";

export default class NoteApplication {
    private readonly noteRepository: NoteRepository;

    constructor(noteRepository: NoteRepository) {
        this.noteRepository = noteRepository;
    }

    async save(note: Note) {
        return await this.noteRepository.save(note);
    }

    async getById(id: string) {
        return await this.noteRepository.getById(id);
    }

    async getLastNotes(userId: string) {
        return await this.noteRepository.getLastNotes(userId);
    }

    async filter(userId: string, filter: Partial<FilterNoteDto>, pagination: TypePagination) {
        return await this.noteRepository.getFilter(userId, filter, pagination);
    }

    async remove(note: Note) {
        return await this.noteRepository.save(note);
    }

    async update(note: Note) {
        return await this.noteRepository.save(note);
    }
}
