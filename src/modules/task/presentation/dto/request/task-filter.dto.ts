import { z } from "zod";
import ValidationInterface from "../../../../../core/presentation/dtos/validation.interface";

export type TypeTaskFilterDto = {
    id: string | null,
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
                endDate: z.date().optional().nullable(),
                id: z.string().optional().nullable(),
                isComplete: z.boolean().optional().nullable(),
                isDraft: z.boolean().optional().nullable(),
                page: z.number().min(0).max(8).default(1),
                pageSize: z.number().min(0).max(8).default(1),
                sort: z.enum(["desc", "asc"]).default("desc")
            })
            .safeParse(payload);
    }
}
