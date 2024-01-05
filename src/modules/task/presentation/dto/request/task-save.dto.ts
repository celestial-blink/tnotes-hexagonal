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
                isDraft: z.boolean().default(false),
                isComplete: z.boolean().default(false),
                endDate: z.date().optional().default(null)
            })
            .safeParse(payload);
    }
}
