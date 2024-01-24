import { z } from "zod";

import { UserProperties } from "../../../../user/domain/roots/user";

export default class AuthLoginDto {
    validate(userProperties: Pick<UserProperties, "email" | "password">) {
        return z
            .object({
                email: z.string().min(1).email(),
                password: z.string().min(1),
            })
            .safeParse({
                email: userProperties.email,
                password: userProperties.password,
            });
    }
}
