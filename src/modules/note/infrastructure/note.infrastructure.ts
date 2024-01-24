import { PrismaClient } from "@prisma/client";
import { Result, err, ok } from "neverthrow";
import { NoteRepository } from "../domain/repositories/note.repository";
import Note from "../domain/roots/note.domain";
import NoteModelDto, { FromDataToResponse } from "./dtos/note.model.dto";
import DataBaseException from "../../../core/exceptions/database.exception";
import LastNotesDto, { LastNotesFromDataToResponse } from "../application/dtos/response/last-notes.dto";

export type NoteResult = Result<
    FromDataToResponse | FromDataToResponse[],
    DataBaseException
    >;

export type LastNotesResult = Result<LastNotesFromDataToResponse [], DataBaseException>;

export type NoteDomainResult = Result<Note, DataBaseException>;
export type NoteGetAndTotal = Result<
    [entities: FromDataToResponse[], total: number],
    DataBaseException
>;


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

    async getAll(): Promise<NoteResult> {
        try {
            const result = await this.prisma.note.findMany();
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

    async getByTitle(title: string, page: number, pageSize: number): Promise<NoteGetAndTotal> {
        try {
            const total = await this.prisma.note.count({
                where: {
                    title: {
                        contains: title
                    }
                }
            });

            const result = await this.prisma.note.findMany({
                where: {
                    title: {
                        contains: title
                    }
                },
                skip: page * pageSize,
                take: pageSize,
            });

            const entities = NoteModelDto.fromDataToResponse(
                result
            ) as FromDataToResponse[];

            return ok([entities, total]);
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getByDraft(page: number, pageSize: number): Promise<NoteGetAndTotal> {
        try {
            const total = await this.prisma.note.count({
                where: { isDraft: { not: null } }
            });

            const result = await this.prisma.note.findMany({
                where: {
                    isDraft: { not: null }
                },
                skip: page * pageSize,
                take: pageSize,
            });

            const entities = NoteModelDto.fromDataToResponse(
                result
            ) as FromDataToResponse[];

            return ok([entities, total]);
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }
    async getByDeletedAt(page: number, pageSize: number): Promise<NoteGetAndTotal> {
        try {
            const total = await this.prisma.note.count({
                where: {
                    deletedAt: {
                        not: null
                    }
                }
            });
            const result = await this.prisma.note.findMany({
                where: {
                    deletedAt: {
                        not: null
                    }
                },
                skip: page * pageSize,
                take: pageSize,
            });

            const entities = NoteModelDto.fromDataToResponse(
                result
            ) as FromDataToResponse[];

            return ok([entities, total]);
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }
    async getByPage(page: number, pageSize: number): Promise<NoteGetAndTotal> {
        try {
            const total = await this.prisma.note.count({
                where: { deletedAt: null },
            });
            const note = await this.prisma.note.findMany({
                where: { deletedAt: null },
                skip: page * pageSize,
                take: pageSize,
            });

            const entities = NoteModelDto.fromDataToResponse(
                note
            ) as FromDataToResponse[];
            return ok([entities, total]);
        } catch (error) {
            return err(new DataBaseException(error.message));
        }
    }

    async getLastNotes(idUser: string): Promise<LastNotesResult> {
        try {
            const notes = await this.prisma.note.findMany({
                select: { id: true, title: true },
                where: { idUser },
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
}
