import { z } from "zod";

type TypePayload = {
    title: string,
    page: number,
    pageSize: number
}

export default class NoteTitleDto {
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

