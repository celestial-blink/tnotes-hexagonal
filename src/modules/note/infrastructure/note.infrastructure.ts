import { PrismaClient } from "@prisma/client";
import { Result, err, ok } from "neverthrow";
import { NoteRepository } from "../domain/repositories/note.repository";
import Note from "../domain/roots/note.domain";
import NoteModelDto, { FromDataToResponse } from "./dtos/note.model.dto";
import DataBaseException from "../../../core/exceptions/database.exception";
import LastNotesDto, { LastNotesFromDataToResponse } from "../application/dtos/response/last-notes.dto";
import FilterDto, { FilterNoteDto } from "../application/dtos/response/filter.dto";


export type NoteResult = Result<
    FromDataToResponse | FromDataToResponse[],
    DataBaseException
>;

export type LastNotesResult = Result<LastNotesFromDataToResponse[], DataBaseException>;

export type NoteDomainResult = Result<Note, DataBaseException>;

export type NoteFilterResult = Result<
    { entities: FilterNoteDto[], total: number },
    DataBaseException
    >;

export type NoteOnlyFilterResult = Result<
    FilterNoteDto[],
    DataBaseException
>;

import { TypePagination } from "../../../core/application/dto/TypePagination";

export default class NoteInfrastructure implements NoteRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async save(note: Note): Promise<NoteResult> {
        try {
            const noteEntity = NoteModelDto.fromDomainToData(note);
            const { id, userId, ...rest } = noteEntity;

            const result = await this.prisma.note.upsert({
                where: { id },
                create: {
                    ...rest,
                    user: {
                        connect: {
                            id: userId
                        }
                    }
                },
                update: {
                    ...rest,
                },
                include: {
                    user: true
                }
            });

            return ok(NoteModelDto.fromDataToResponse(result));
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getById(id: string): Promise<NoteDomainResult> {
        try {
            const result = await this.prisma.note.findFirst({
                where: { id }
            });

            return ok(NoteModelDto.fromDataToDomain(result));
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getLastNotes(userId: string): Promise<LastNotesResult> {
        try {
            const notes = await this.prisma.note.findMany({
                select: { id: true, title: true },
                where: { userId },
                take: 10,
                orderBy: { createdAt: "desc" }
            });

            const entities = notes.map(note => LastNotesDto.fromDataToResponse({
                id: note.id, title: note.title
            }));

            return ok(entities);
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getFilter(userId: string, filters: Partial<FilterNoteDto>, pagination: TypePagination, sort: "asc" | "desc"): Promise<NoteFilterResult> {
        try {
            const countTask = await this.prisma.note.count({
                where: {
                    userId,
                    ...filters
                }
            });

            const notes = await this.prisma.note.findMany({
                select: { id: true, title: true, createdAt: true, isDraft: true },
                orderBy: { createdAt: sort },
                where: {
                    userId,
                    deletedAt: null,
                    ...filters
                },
                skip: (pagination.page - 1) * pagination.pageSize,
                take: pagination.pageSize,
            });

            const result = notes.map(note => {
                return FilterDto.fromDataToResponse(note);
            });

            return ok({ entities: result, total: countTask });
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getOnlyFilter(userId: string, filters: Partial<FilterNoteDto>, pagination: TypePagination, sort: "asc" | "desc"): Promise<NoteOnlyFilterResult> {
        try {
            const notes = await this.prisma.note.findMany({
                select: { id: true, title: true, createdAt: true, isDraft: true },
                orderBy: { createdAt: sort },
                where: {
                    userId,
                    deletedAt: null,
                    ...filters
                },
                skip: (pagination.page - 1) * pagination.pageSize,
                take: pagination.pageSize,
            });

            const result = notes.map(note => {
                return FilterDto.fromDataToResponse(note);
            });

            return ok(result);
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }
}
