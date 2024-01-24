import { Request, Response, NextFunction } from "express";

import NoteApplication from "../application/note.application";
import { NoteProperties } from "../domain/roots/note.domain";
import NoteFactory from "../domain/roots/note.factory";
import ResponseApi from "../../../core/helpers/response-api";
import { UserProperties } from "../../user/domain/roots/user";

export default class NoteController {
    private readonly application: NoteApplication;
    constructor(application: NoteApplication) {
        this.application = application;
    }

    async save(req: Request, res: Response, next: NextFunction) {
        const { title, description, isDraft } = req.body;
        const { user } = res.locals;
        const { id: idUser } = user as UserProperties

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

        return res
            .status(200)
            .json(
                ResponseApi.success(userCreated.value)
            );
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const notes = await this.application.getAll();
        if (notes.isErr()) return next(notes.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(notes.value)
            );
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const note = await this.application.getById(id);

        if (note.isErr()) return next(note.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(note.value)
            );
    }

    async getByTitle(req: Request, res: Response, next: NextFunction) {
        console.log("getByTitle");

        const { page, pageSize, title } = req.params;

        const notes = await this.application.getByTitle(title, +page, +pageSize);

        if (notes.isErr()) return next(notes.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(notes.value)
            );
    }

    async getByDraft(req: Request, res: Response, next: NextFunction) {
        console.log("getByDraft");

        const { page, pageSize } = req.params;

        const notes = await this.application.getByDraft(+page, +pageSize);

        if (notes.isErr()) return next(notes.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(notes.value)
            );
    }

    async getByDeletedAt(req: Request, res: Response, next: NextFunction) {
        const { page, pageSize } = req.params;

        const notes = await this.application.getByDraft(+page, +pageSize);

        if (notes.isErr()) return next(notes.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(notes.value)
            );
    }

    async getByPage(req: Request, res: Response, next: NextFunction) {
        console.log("getByPage");

        const { page, pageSize } = req.params;

        const notes = await this.application.getByPage(+page, +pageSize);

        if (notes.isErr()) return next(notes.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(notes.value)
            );
    }

    async getLastNotes(req: Request, res: Response, next: NextFunction) {
        const { user } = res.locals;
        const { id: idUser } = user as UserProperties;

        const notes = await this.application.getLastNotes(idUser);

        if (notes.isErr()) return next(notes.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(notes.value)
            );
    }
}
