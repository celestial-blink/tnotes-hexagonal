import { NoteRepository } from "../domain/repositories/note.repository";
import Note from "../domain/roots/note.domain";

export default class NoteApplication {
    private readonly noteRepository: NoteRepository;

    constructor(noteRepository: NoteRepository) {
        this.noteRepository = noteRepository;
    }

    async save(note: Note) {
        return await this.noteRepository.save(note);
    }

    async getAll() {
        return await this.noteRepository.getAll();
    }

    async getById(id: string) {
        return await this.noteRepository.getById(id);
    }

    async getByTitle(title: string, page: number, pageSize: number) {
        return await this.noteRepository.getByTitle(title, page, pageSize);
    }

    async getByDraft(page: number, pageSize: number) {
        return await this.noteRepository.getByDraft(page, pageSize);
    }

    async getByDeletedAt(page: number, pageSize: number) {
        return await this.noteRepository.getByDeletedAt(page, pageSize);
    }

    async getByPage(page: number, pageSize: number) {
        return await this.noteRepository.getByPage(page, pageSize);
    }

    async getLastNotes(idUser: string) {
        return await this.noteRepository.getLastNotes(idUser);
    }
}
