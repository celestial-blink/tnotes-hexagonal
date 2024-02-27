import { routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { string } from "zod";

import UserApi from "~/api/UserApi";
import AuthApi from "~/api/AuthApi";

export const useUpdateName = routeAction$(async (data, { cookie }) => {
    const updatedName = await UserApi.update({ name: data.name }, null, cookie);

    return updatedName;
}, zod$({ name: z.string().max(40).min(3).trim() }));


const useUpdatePasswordValidation = z.object({
    password: z.string().min(8).trim(),
    repeatPassword: z.string()
}).refine(data => data.password === data.repeatPassword, {
    message: "password don't match",
    path: ["repeatPassword"]
})

export const useUpdatePassword = routeAction$(async (data, { cookie }) => {
    const updatedName = await UserApi.update({ password: data.password }, null, cookie);

    return updatedName;
}, zod$(useUpdatePasswordValidation));

const useValidatePasswordValidation = zod$({
    password: string()
});

export const useValidatePassword = routeAction$(async (data, { cookie }) => {
    const validatePassword = await AuthApi.validatePassword(data.password, null, cookie);

    return validatePassword;
}, useValidatePasswordValidation)
