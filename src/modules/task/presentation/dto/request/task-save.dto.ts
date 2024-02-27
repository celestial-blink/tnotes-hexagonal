import { z } from "zod";
import ValidationInterface from "../../../../../core/presentation/dtos/validation.interface";

type TypePayload = {
    title: string,
    description: string,
    isDraft: boolean,
    isComplete: boolean,
    endDate: Date | null
}

export default class TaskSaveDto implements ValidationInterface {
    validate(payload: TypePayload) {
        return z
            .object({
                title: z.string().max(120),
                description: z.string().max(500),
                isDraft: z.coerce.boolean().default(false),
                isComplete: z.coerce.boolean().default(false),
                endDate: z.coerce.date().nullable().default(null)
            })
            .safeParse(payload);
    }
}
