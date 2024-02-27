import { z } from "zod";
import ValidationInterface from "../../../../../core/presentation/dtos/validation.interface";
import Parameters from "../../../../../core/helpers/parameters";

export type TypeNoteFilterDto = {
    id: string | null,
    createdAt: Date | null,
    isDraft: boolean | null,
    title: string | null,
    page: number,
    pageSize: number
}

export default class NoteFilterDto implements ValidationInterface {
    validate(payload: Partial<TypeNoteFilterDto>) {
        return z
            .object({
                createdAt: z.date().optional().nullable(),
                id: z.string().optional().nullable(),
                isDraft: z.boolean().optional().nullable(),
                title: z.string().optional().nullable(),
                page: z.number().positive().default(1),
                pageSize: z.number().positive().default(Parameters.FILTER_PER_PAGE),
            })
            .safeParse(payload);
    }
}
