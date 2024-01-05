import { z } from "zod";

type TypePayload = {
    page: number,
    pageSize: number
}

export default class NotePageDto {
    validate(payload: TypePayload) {
        return z
            .object({
                page: z.number(),
                pageSize: z.number()
            })
            .safeParse(payload);
    }
}
