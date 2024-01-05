import { Request, Response, NextFunction } from "express";

import NoteApplication from "../application/note.application";
import { NoteProperties } from "../domain/roots/note.domain";
import NoteFactory from "../domain/roots/note.factory";

export default class NoteController {
    private readonly application: NoteApplication;
    constructor(application: NoteApplication) {
        this.application = application;
    }

    async save(req: Request, res: Response, next: NextFunction) {
        const { title, description, isDraft } = req.body;
        const { idUser } = res.locals;

        const noteProperties: NoteProperties = {
            title,
            description,
            isDraft,
            idUser,
            id: null,
            createdAt: null
        }

        const noteFactory = NoteFactory.create(noteProperties);

        if (noteFactory.isErr()) return next(noteFactory.error);

        const userCreated = await this.application.save(noteFactory.value);

        if (userCreated.isErr()) return next(userCreated.error);

        return res.status(200).json(userCreated.value);
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const notes = await this.application.getAll();
        if (notes.isErr()) return next(notes.error);

        return res.status(200).json(notes.value);
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const note = await this.application.getById(id);

        if (note.isErr()) return next(note.error);

        return res.status(200).json(note.value);
    }

    async getByTitle(req: Request, res: Response, next: NextFunction) {
        const { page, pageSize, title } = req.params;

        const notes = await this.application.getByTitle(title, +page, +pageSize);

        if (notes.isErr()) return next(notes.error);

        return res.status(200).json(notes.value);
    }

    async getByDraft(req: Request, res: Response, next: NextFunction) {
        const { page, pageSize } = req.params;

        const notes = await this.application.getByDraft(+page, +pageSize);

        if (notes.isErr()) return next(notes.error);

        return res.status(200).json(notes.value);
    }

    async getByDeletedAt(req: Request, res: Response, next: NextFunction) {
        const { page, pageSize } = req.params;

        const notes = await this.application.getByDraft(+page, +pageSize);

        if (notes.isErr()) return next(notes.error);

        return res.status(200).json(notes.value);
    }

    async getByPage(req: Request, res: Response, next: NextFunction) {
        const { page, pageSize } = req.params;

        const notes = await this.application.getByPage(+page, +pageSize);

        if (notes.isErr()) return next(notes.error);

        return res.status(200).json(notes.value);
    }
}
