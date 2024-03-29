import { z } from "zod";

type TypePayload = {
    title: string;
    description: string;
    isDraft: boolean
}

export default class NoteInsertDto {
    validate(payload: TypePayload) {
        return z
            .object({
                title: z.string().max(120),
                description: z.string().max(500),
                isDraft: z.coerce.boolean().default(false)
            })
            .safeParse(payload);
    }
}

