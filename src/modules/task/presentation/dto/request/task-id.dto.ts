import { z } from "zod";
import ValidationInterface from "../../../../../core/presentation/dtos/validation.interface";

type TypePayload = {
    id: string
}

export default class TaskIdDto implements ValidationInterface {
    validate(payload: TypePayload) {
        return z
            .object({
                id: z.string()
            })
            .safeParse(payload);
    }
}
