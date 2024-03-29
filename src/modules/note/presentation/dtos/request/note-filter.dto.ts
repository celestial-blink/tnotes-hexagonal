import { z } from "zod";
import ValidationInterface from "../../../../../core/presentation/dtos/validation.interface";
import Parameters from "../../../../../core/helpers/parameters";

export type TypeNoteFilterDto = {
    id: string | null,
    createdAt: Date | null,
    isDraft: boolean | null,
    title: string | null,
    page: number,
    pageSize: number,
    sort: "desc" | "asc"
}

export default class NoteFilterDto implements ValidationInterface {
    validate(payload: Partial<TypeNoteFilterDto>) {
        return z
            .object({
                createdAt: z.date().optional().nullable(),
                id: z.string().optional().nullable(),
                isDraft: z.boolean().optional().nullable(),
                title: z.string().optional().nullable().transform(title => {
                    if (title) return { contains: title }
                    return title;
                }),
                page: z.coerce.number().min(0).max(8).default(1),
                pageSize: z.coerce.number().min(0).max(8).default(Parameters.FILTER_PER_PAGE),
                sort: z.enum(["desc", "asc"]).default("desc")
            })
            .safeParse(payload);
    }
}
