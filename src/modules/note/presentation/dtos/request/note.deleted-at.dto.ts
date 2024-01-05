import { z } from "zod";

type TypePayload = {
    deletedAt: boolean,
    page: number,
    pageSize: number
}

export default class NoteDeletedAtDto {
    validate(payload: TypePayload) {
        return z
            .object({
                deletedAt: z.boolean().default(false),
                page: z.number(),
                pageSize: z.number()
            })
            .safeParse(payload);
    }
}
