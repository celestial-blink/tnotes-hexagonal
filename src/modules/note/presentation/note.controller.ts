import { Request, Response, NextFunction } from "express";

import NoteApplication from "../application/note.application";
import type { NoteProperties } from "../domain/roots/types";
import NoteFactory from "../domain/roots/note.factory";
import ResponseApi from "../../../core/helpers/response-api";
import type { UserProperties } from "../../user/domain/roots/types";
import { TypeNoteFilterDto } from "./dtos/request/note-filter.dto";
import { FilterNoteDto } from "../application/dtos/response/filter.dto";

export default class NoteController {
    private readonly application: NoteApplication;
    constructor(application: NoteApplication) {
        this.application = application;
    }

    async save(req: Request, res: Response, next: NextFunction) {
        const { title, description, isDraft } = req.body;
        const { user } = res.locals;
        const { id: userId } = user as UserProperties

        const noteProperties: NoteProperties = {
            title,
            description,
            isDraft,
            userId,
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

    async getLastNotes(req: Request, res: Response, next: NextFunction) {
        const { user } = res.locals;
        const { id: userId } = user as UserProperties;

        const notes = await this.application.getLastNotes(userId);

        if (notes.isErr()) return next(notes.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(notes.value)
            );
    }

    async getFilter(req: Request, res: Response, next: NextFunction) {
        const { user } = res.locals;
        const { id: userId } = user as UserProperties;

        const query = res.locals.query as TypeNoteFilterDto;

        const filterParams: Partial<FilterNoteDto> = {
            id: query.id,
            createdAt: query.createdAt,
            isDraft: query.isDraft,
            title: query.title
        }

        const getFilterResult = await this.application.filter(userId, filterParams, { page: query.page, pageSize: query.pageSize }, query.sort);

        if (getFilterResult.isErr()) return next(getFilterResult.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(getFilterResult.value)
            );
    }

    async getOnlyFilter(req: Request, res: Response, next: NextFunction) {
        const { user } = res.locals;
        const { id: userId } = user as UserProperties;

        const query = res.locals.query as TypeNoteFilterDto;

        const filterParams: Partial<TypeNoteFilterDto> = {
            id: query.id,
            createdAt: query.createdAt,
            isDraft: query.isDraft,
            title: query.title
        };

        const getFilterResult = await this.application.onlyFilter(userId, filterParams, { page: query.page, pageSize: query.pageSize }, query.sort);

        if (getFilterResult.isErr()) return next(getFilterResult.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(getFilterResult.value)
            );
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const note = await this.application.getById(id);

        if (note.isErr()) return next(note.error);

        const noteResult = note.value;
        noteResult.delete();

        const noteRemovedResult = await this.application.remove(noteResult);

        if (noteRemovedResult.isErr()) return next(noteRemovedResult.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(noteRemovedResult.value)
            );
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { title, description, isDraft } = req.body;

        const note = await this.application.getById(id);

        if (note.isErr()) return next(note.error);

        const noteResult = note.value;
        noteResult.update({
            title,
            description,
            isDraft
        });

        const noteUpdatedResult = await this.application.update(noteResult);

        if (noteUpdatedResult.isErr()) return next(noteUpdatedResult.error);

        return res
            .status(200)
            .json(
                ResponseApi.success(noteUpdatedResult.value)
            );
    }
}
