import { z } from "zod";

type TypePayload = {
    page: number,
    pageSize: number
}

export default class NoteDraftDto {
    validate(payload: TypePayload) {
        return z
            .object({
                page: z.number(),
                pageSize: z.number()
            })
            .safeParse(payload);
    }
}
