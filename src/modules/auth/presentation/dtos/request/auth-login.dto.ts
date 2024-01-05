import { z } from "zod";

import { UserProperties } from "../../../../user/domain/roots/user";

export default class AuthLoginDto {
    validate(userProperties: Pick<UserProperties, "email" | "password">) {
        return z
            .object({
                email: z.string().nonempty().email(),
                password: z.string().nonempty(),
            })
            .safeParse({
                email: userProperties.email,
                password: userProperties.password,
            });
    }
}
