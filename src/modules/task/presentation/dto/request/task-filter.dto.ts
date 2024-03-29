import { z } from "zod";
import ValidationInterface from "../../../../../core/presentation/dtos/validation.interface";
import Parameters from "../../../../../core/helpers/parameters";

export type TypeTaskFilterDto = {
    id: string | null,
    title: string | null,
    createdAt: Date | null,
    endDate: Date | null,
    isComplete: boolean | null,
    isDraft: boolean | null,
    page: number;
    pageSize: number;
    sort: "desc" | "asc"
}

export default class TaskFilterDto implements ValidationInterface {
    validate(payload: Partial<TypeTaskFilterDto>) {
        return z
            .object({
                createdAt: z.date().optional().nullable(),
                endDate: z.coerce.date().optional().nullable(),
                id: z.string().optional().nullable(),
                title: z.string().optional().nullable().transform(title => {
                    if (title) return { contains: title }
                    return title;
                }),
                isComplete: z.coerce.boolean().optional().nullable(),
                isDraft: z.coerce.boolean().optional().nullable(),
                page: z.coerce.number().min(0).max(8).default(1),
                pageSize: z.coerce.number().min(0).max(8).default(Parameters.FILTER_PER_PAGE),
                sort: z.enum(["desc", "asc"]).default("desc")
            })
            .safeParse(payload);
    }
}
