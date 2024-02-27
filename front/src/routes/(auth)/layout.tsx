import { Slot, component$ } from "@builder.io/qwik";
import { useLocation, RequestHandler } from "@builder.io/qwik-city";
import AuthApi from "~/api/AuthApi";

const selectImage: Record<string, string> = {
    register_message: "register-message.png",
    register_complete: "register-complete.svg",
    default: "started.png",
}

export const onGet: RequestHandler = async ({ cookie, redirect, signal }) => {
    const session = await AuthApi.session(signal, cookie);

    if (session.success) throw redirect(302, "/");
}

export default component$(() => {
    const location = useLocation();

    return (
        <main class="is__wrap text-base max-w-5xl">
            <div class="custom__shadow bg-white rounded-md p-5 flex flex-col items-center justify-between sm:flex-row">
                <img src={`/images/${selectImage[location.url.pathname.split("/").at(-1) ?? ""] ?? selectImage.default}`} class="w-52 h-52 md:w-72 md:h-72 lg:w-96 lg:h-96" alt="start" />
                <div class="flex flex-col w-full md:max-w-sm">
                    <Slot />
                </div>
            </div>
        </main>
    )
});
