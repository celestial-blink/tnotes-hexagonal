import { z } from "zod";

export default class UserByPageDto {
    validate(payload: { page: number, pageSize: number }) {
        return z
            .object({
                page: z.number().nonnegative(),
                pageSize: z.number().nonnegative()
            })
            .safeParse({
                page: payload.page,
                pageSize: payload.pageSize
            });
    }
}

