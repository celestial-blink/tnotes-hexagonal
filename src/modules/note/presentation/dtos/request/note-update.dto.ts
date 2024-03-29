import { z } from "zod";

type TypePayload = {
    title: string | null;
    description: string | null;
    isDraft: boolean | null;
}

export default class NoteUpdateDto {
    validate(payload: TypePayload) {
        return z
            .object({
                title: z.string().nullable().optional(),
                description: z.string().nullable().optional(),
                isDraft: z.coerce.boolean().nullable().optional()
            })
            .safeParse(payload);
    }
}

