import { z } from "zod";
import ValidationInterface from "../../../../../core/presentation/dtos/validation.interface";

export type TypeAuthValidatePasswordDto = {
    password: string;
}

export default class AuthValidatePasswordDto implements ValidationInterface {
    validate(payload: Partial<TypeAuthValidatePasswordDto>) {
        return z
            .object({
                password: z.string()
            })
            .safeParse(payload);
    }
}
