import { z } from "zod";

type TypePayload = {
    title: string;
    description: string;
    isDraft: boolean;
}

export default class NoteUpdateDto {
    validate(payload: TypePayload) {
        return z
            .object({
                title: z.string(),
                description: z.string(),
                isDraft: z.boolean()
            })
            .safeParse(payload);
    }
}

