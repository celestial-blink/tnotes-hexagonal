import { z } from "zod";

import { UserProperties } from "../../../domain/roots/user";

export default class UserCreateDto {
    validate(userProperties: Partial<UserProperties>) {
        return z
            .object({
                name: z.string().min(3).max(40),
                email: z.string().toLowerCase().min(1),
                password: z.string().min(8).max(40),
            })
            .safeParse({
                name: userProperties.name,
                email: userProperties.email,
                password: userProperties.password,
            });
    }
}

