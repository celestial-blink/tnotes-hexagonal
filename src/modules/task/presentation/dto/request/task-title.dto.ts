import { z } from "zod";
import ValidationInterface from "../../../../../core/presentation/dtos/validation.interface";

type TypePayload = {
    title: string,
    page: number,
    pageSize: number
}

export default class TaskTitleDto implements ValidationInterface {
    validate(payload: TypePayload) {
        return z
            .object({
                title: z.string(),
                page: z.number(),
                pageSize: z.number()
            })
            .safeParse(payload);
    }
}
