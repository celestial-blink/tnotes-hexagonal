import { z } from "zod";
import ValidationInterface from "../../../../../core/presentation/dtos/validation.interface";

type TypePayload = {
    title: string;
    description: string;
    isDraft: boolean;
    isComplete: boolean;
    endDate: Date | null
}

export default class TaskUpdateDto implements ValidationInterface {
    validate(payload: TypePayload) {
        return z
            .object({
                title: z.string(),
                description: z.string(),
                isDraft: z.boolean(),
                isComplete: z.boolean(),
                endDate: z.date().nullable()
            })
            .safeParse(payload);
    }
}
