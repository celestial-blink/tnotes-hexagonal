import { z } from "zod";

import type { UserProperties } from "../../../domain/roots/types";

export default class UserUpdateDto {
    validate(userProperties: Partial<UserProperties>) {
        return z
            .object({
                name: z.string().min(3).max(40).nullable(),
                password: z.string().min(8).max(40).nullable(),
            })
            .safeParse({
                name: userProperties.name,
                password: userProperties.password,
            });
    }
}

