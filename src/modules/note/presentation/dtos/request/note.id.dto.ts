import { z } from "zod";

type TypePayload = {
    id: string
}

export default class NoteIdDto {
    validate(payload: TypePayload) {
        return z
            .object({
                id: z.string()
            })
            .safeParse(payload);
    }
}

