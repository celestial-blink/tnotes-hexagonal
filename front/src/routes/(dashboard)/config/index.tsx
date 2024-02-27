import { component$, $, useSignal } from "@builder.io/qwik";

import TitleMobile from "~/components/TitleMobile";

import { useSession } from "../layout";

import { useUpdateName, useUpdatePassword, useValidatePassword } from "./actions";

export default component$(() => {
    const session = useSession();
    const updateName = useUpdateName();
    const updatePassword = useUpdatePassword();
    const validatePassword = useValidatePassword();

    const openDialogConfirm = useSignal<boolean>(false);
    const selectForm = useSignal<string | null>(null);

    const nameInput = useSignal<string>("");
    const passwordInput = useSignal<string>("");
    const repeatPasswordInput = useSignal<string>("");

    const handleOnSubmitName = $(() => {
        if (!validatePassword.value?.data?.password) {
            openDialogConfirm.value = true;
            selectForm.value = "name";
            return;
        }

        updateName.submit({ name: nameInput.value });
    });

    const handleOnSubmitPassword = $(() => {
        if (!validatePassword.value?.data?.password) {
            openDialogConfirm.value = true;
            selectForm.value = "password";
            return;
        }

        updatePassword.submit({ password: passwordInput.value, repeatPassword: repeatPasswordInput.value });
    });

    const handleValidatePassword = $((event: SubmitEvent, element: HTMLFormElement) => {
        const { current_password } = element;
        validatePassword.submit(current_password?.value ?? "");
        if (!validatePassword.value?.failed && validatePassword.value?.success && selectForm.value) {
            if (selectForm.value === "name") updateName.submit({ name: nameInput.value });
            if (selectForm.value === "password") updatePassword.submit({ password: passwordInput.value, repeatPassword: repeatPasswordInput.value });
        }
    });

    const handleMatchPassword = $((_: FocusEvent, element: HTMLInputElement) => {
        const { nextElementSibling } = element;
        if (passwordInput.value && passwordInput.value !== repeatPasswordInput.value) {
            if (nextElementSibling && nextElementSibling.tagName === "P") nextElementSibling.textContent = "password don't match";
        }
        if (nextElementSibling && nextElementSibling.tagName === "P") nextElementSibling.textContent = "";
    });

    return (
        <div class="flex flex-col text-slate-800 gap-1 text-base">
            <TitleMobile />
            <section class="bg-white p-2 dark:bg-slate-700 dark:text-white">
                <h2 class="text-2xl text-cyan-900 mb-2 dark:text-white">Mi cuenta</h2>
                <div class="flex items-center py-1 rounded bg-slate-100 dark:bg-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-circle" width="120" height="120" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" /></svg>
                    <h4 class="font-bold">{session.value.data.name} <span class="block font-normal text-base">{session.value.data.email}</span> </h4>
                </div>
            </section>
            <section>
                <div class="flex flex-col md:flex-row">
                    <form class="is__form w-full gap-3 flex flex-col text-lg bg-white dark:bg-slate-700 dark:text-white" onSubmit$={handleOnSubmitName}>
                        <fieldset class="wrap__input gap-2">
                            <div class="flex flex-col">
                                <label class="text-base font-semibold" for="name">Cambiar nombres</label>
                                <input type="text" class="input" bind:value={nameInput} name="name" id="name" maxLength={40} required />
                            </div>
                            <div class="flex gap-2 mt-2 justify-between items-center">
                                <p class="text-right flex-1 !text-base">
                                    {
                                        updateName.value?.failed
                                            ? updateName.value.fieldErrors.name
                                            : (
                                                updateName.value?.success === false
                                                && (updateName.value.data?.message ?? "No se guardaron los cambios")
                                            )
                                    }
                                </p>
                                <input type="submit" class="is__button__primary px-3 py-1 rounded" value="Guardar cambios" />
                            </div>
                        </fieldset>
                    </form>
                    <form class="is__form w-full gap-3 flex flex-col text-lg bg-white dark:bg-slate-700 dark:text-white" onSubmit$={handleOnSubmitPassword}>
                        <fieldset>
                            <div class="flex flex-col">
                                <label class="text-base font-semibold" for="new_password">Nueva contraseña</label>
                                <input type="password" class="input out-of-range:border-red-500" bind:value={passwordInput} name="new_password" id="new_password" minLength={8} required />
                            </div>
                            <div class="flex flex-col">
                                <label class="text-base font-semibold" for="repeat_password">Repetir contraseña</label>
                                <input type="password" class="input" bind:value={repeatPasswordInput} onBlur$={handleMatchPassword} name="repeat_password" id="repeat_password" minLength={8} required />
                                <p class="!text-red-500"></p>
                            </div>
                            <div class="flex gap-2 mt-2 justify-between items-center">
                                <p class="text-right flex-1 !text-base"></p>
                                <input type="submit" class="is__button__primary px-3 py-1 rounded" value="Guardar cambios" />
                            </div>
                        </fieldset>
                    </form>
                </div>
            </section>
            <dialog class="shadow-md min-w-[350px] dark:bg-slate-800 dark:text-white" open={!!openDialogConfirm}>
                <form class="flex gap-4 flex-col" onSubmit$={handleValidatePassword}>
                    <fieldset class="flex flex-col gap-2" disabled={validatePassword.isRunning}>
                        <label class="text-base font-semibold" for="current_password">Ingrese su contraseña</label>
                        <input type="password" class="border rounded p-2 dark:bg-slate-900" name="current_password" id="current_password" />
                        <p class="text-red-500 text-sm an">
                            {
                                validatePassword.value?.fieldErrors?.password
                            }
                        </p>
                    </fieldset>
                    <div class="flex gap-2 justify-end">
                        <button class="bg-slate-200 rounded text-slate-800 px-5 py-1 dark:bg-slate-300" type="button" onClick$={() => openDialogConfirm.value = false}>Cancel</button>
                        <button class="bg-cyan-800 rounded text-white px-5 py-1 dark:bg-cyan-500">Continuar</button>
                    </div>
                </form>
            </dialog>
        </div>
    );
})
