import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
    return (
        <>
            <div class="w-full flex flex-col items-center gap-2">
                <div class="h-16 w-16 rounded-full bg-cyan-900"></div>
                <h1 class="text-cyan-900 text-4xl">Regístrate</h1>
            </div>
            <form class="is__form w-full gap-7 flex flex-col text-lg">
                <fieldset class="w-full flex gap-2 flex-col">
                    <div class="wrap__input">
                        <label class="label text-cyan-900" for="name">Nombre</label>
                        <input type="text" class="input" name="name" id="name" minLength={4} maxLength={40} required />
                        <p class="!text-red-400"></p>
                    </div>
                    <div class="wrap__input">
                        <label class="label text-cyan-900" for="email">Correo</label>
                        <input type="email" class="input" name="email" id="email" required />
                        <p></p>
                    </div>
                    <div class="wrap__input">
                        <label class="label text-cyan-900" for="password">Contraseña</label>
                        <input type="password" class="input" name="password" id="password" minLength={8} required />
                        <p class="!text-red-400"></p>
                    </div>
                    <div class="wrap__input">
                        <label class="label text-cyan-900" for="repeat_password">Repetir contraseña</label>
                        <input type="password" class="input" name="repeat_password" id="repeat_password" minLength={8} required />
                    </div>
                    <p class="!text-red-400 text-center"></p>
                    <input type="submit" class="is__button__primary input mt-2" value="Continuar" />
                </fieldset>
                <p class="text-center">Si ya tienes una cuenta <Link href="/login" class="is__link">inicia aquí</Link></p>
            </form>
        </>
    );
});
