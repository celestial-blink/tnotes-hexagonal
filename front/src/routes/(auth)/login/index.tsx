import { component$ } from "@builder.io/qwik";
import { Link, routeAction$, Form, zod$, z, RequestHandler } from "@builder.io/qwik-city";
import { format, addDays } from "date-fns";

import AuthApi from "~/api/AuthApi";
import Fetch from "~/helpers/fetch";

export const onGet: RequestHandler = async ({ cookie, redirect, signal }) => {
    const session = await AuthApi.session(signal, cookie);
    console.log("🚀 ~ constonGet:RequestHandler= ~ session:", session)

    if (session.success) throw redirect(302, "/");
}

export const useLoginUser = routeAction$(
    async (data, { cookie, redirect }) => {
        const myFetch = new Fetch();
        const login = await myFetch.execute({
            requestInit: {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "same-origin"
            },
            url: "http://127.0.0.1:1112/api/auth/login",
            cookie: null
        });

        if (login.success) {
            const expiresAccessToken = format(addDays(Date.now(), 2), "PPpp");
            const expiresRefreshToken = format(addDays(Date.now(), 2), "PPpp");

            cookie.set("accessToken", login.data?.accessToken, { expires: expiresAccessToken, secure: true, httpOnly: true, maxAge: [2, "days"], path: "/" });
            cookie.set("refreshToken", login.data?.refreshToken, { expires: expiresRefreshToken, secure: true, httpOnly: true, maxAge: [2, "days"], path: "/" });

            throw redirect(302, "/");
        }

        return login;
    },
    zod$({
        email: z.string().email(),
        password: z.string()
    })
);

export default component$(() => {
    const action = useLoginUser();

    return (
        <>
            <div class="w-full flex flex-col items-center">
                <div class="h-16 w-16 rounded-full bg-cyan-900"></div>
                <h1 class="text-cyan-900 text-4xl">Iniciar sesión</h1>
            </div>
            <Form class="is__form w-full gap-7 flex flex-col text-lg" action={action}>
                <fieldset class="w-full flex gap-2 flex-col" disabled={action.isRunning}>
                    <div class="wrap__input error">
                        <label class="label text-cyan-900" for="email">Correo</label>
                        <input type="email" class="input" name="email" id="email" required />
                        {
                            !action.isRunning
                                ? <p class="text-red-500">{action?.value?.fieldErrors?.email}</p>
                                : null
                        }
                    </div>
                    <div class="wrap__input">
                        <label class="label text-cyan-900 bg-white" for="password">Contraseña</label>
                        <input type="password" class="input" name="password" id="password" required />
                        {
                            !action.isRunning
                                ? <p class="text-red-500">{action?.value?.fieldErrors?.password}</p>
                                : null
                        }
                    </div>
                    <Link href="#" class="is__link block text-right color">Olvide mi contraseña</Link>
                    {
                        !action.isRunning
                            ? <p class="text-red-400">{action?.value?.data?.message}</p>
                            : null
                    }
                    <input type="submit" class="is__button__primary input w-full" value="Iniciar session" />
                </fieldset>
                <p class="text-center">Si no estas registrado <Link href="/register" class="is__link">regístrate aquí</Link></p>
            </Form>
        </>
    );
});
