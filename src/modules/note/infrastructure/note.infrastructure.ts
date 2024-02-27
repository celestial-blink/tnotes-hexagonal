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

export type TaskFilterResult = Result<
    [entities: FilterNoteDto[], total: number],
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
            const { id } = note.properties();
            const result = await this.prisma.note.upsert({
                create: {
                    ...noteEntity,
                },
                update: {
                    ...noteEntity,
                },
                where: { id },
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

    async getFilter(userId: string, filters: Partial<FilterNoteDto>, pagination: TypePagination): Promise<TaskFilterResult> {
        try {
            const countTask = await this.prisma.task.count({
                where: {
                    userId,
                    ...filters
                }
            });

            const notes = await this.prisma.task.findMany({
                select: { id: true, title: true, createdAt: true, isDraft: true, endDate: true, isComplete: true },
                where: {
                    userId,
                    ...filters
                },
                skip: (pagination.page - 1) * pagination.pageSize,
                take: pagination.pageSize,
            });

            const result = notes.map(note => {
                return FilterDto.fromDataToResponse(note);
            });

            return ok([result, countTask]);
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }
}
