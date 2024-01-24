import { Slot, component$ } from "@builder.io/qwik";
import { useLocation, Link, routeLoader$ } from "@builder.io/qwik-city";

import Fetch from "~/helpers/fetch";

type ResultUseSession = {
    id: string,
    name: string,
}

export const useSession = routeLoader$(async ({ cookie, redirect }) => {
    const session = await Fetch.execute<ResultUseSession>({
        requestInit: {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookie.get('accessToken')?.value}`,
                "refreshToken": `${cookie.get('refreshToken')?.value}`
            }
        },
        url: "http://127.0.0.1:1112/api/auth/session",
        cookie
    });

    if (!session.success) throw redirect(302, "/login/");

    return session;
});

export default component$(() => {
    const location = useLocation();
    const user = useSession();

    return (
        <main class="is__wrap h-full relative flex gap-1 flex-col items-start md:flex-row md:h-max">
            <div class="overflow-y-auto overflow-x-hidden md:inline-block w-full md:overflow-visible md:pr-0" style={{ height: "calc(100% - 60px)" }}>
                <Slot />
            </div>
            <div class="w-full flex flex-col gap-1 md:w-auto md:sticky md:top-0">
                <section class="hidden custom__shadow rounded w-full bg-white items-center p-1 text-slate-900 md:flex dark:bg-slate-700 dark:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-circle" width="80" height="80" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" /></svg>
                    <div>
                        <p><strong>{user.value.data?.name ?? ""}</strong></p>
                        <a href="#">Cerrar session</a>
                    </div>
                </section>
                <nav class="custom__shadow rounded-full w-full bg-white md:flex-col md:w-52 md:rounded md:p-1 dark:bg-slate-700 dark:text-white">
                    <ul class="flex justify-between py-2 px-5 md:flex-col md:p-1">
                        <li>
                            <Link href={"/"} class={`flex items-center gap-1 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-500 ${location.url.pathname === "/home/" ? "bg-slate-200 dark:bg-slate-500" : ""}`} title="inicio">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-home" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>
                                <span class="hidden md:inline">Inicio</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={"/task"} class={`flex items-center gap-1 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-500 ${location.url.pathname === "/task" ? "bg-slate-200 dark:bg-slate-500" : ""}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-checklist" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9.615 20h-2.615a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8" /><path d="M14 19l2 2l4 -4" /><path d="M9 8h4" /><path d="M9 12h2" /></svg>
                                <span class="hidden md:inline">Tareas</span>
                            </Link>
                        </li>
                        <li class="relative">
                            <details class="details">
                                <summary class="flex items-center gap-1 p-1 cursor-pointer rounded hover:bg-slate-200 dark:hover:bg-slate-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-rounded-plus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /><path d="M15 12h-6" /><path d="M12 9v6" /></svg>
                                    <span class="hidden md:inline">Agregar</span>
                                </summary>
                                <menu class="as-menu absolute -top-14 -left-[200%] bg-white p-2 rounded w-max flex gap-3 md:-top-1 md:-left-[65%] md:flex-col dark:bg-slate-800">
                                    <li> <Link href={"/note"} class="p-1">Agregar nota</Link> </li>
                                    <li> <Link href={"/task"} class="p-1">Agregar tarea</Link> </li>
                                </menu>
                            </details>
                        </li>
                        <li>
                            <Link href={"/note"} class={`flex items-center gap-1 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-500 ${location.url.pathname === "/note/" ? "bg-slate-200 dark:bg-slate-500" : ""}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-notes" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /><path d="M9 7l6 0" /><path d="M9 11l6 0" /><path d="M9 15l4 0" /></svg>
                                <span class="hidden md:inline">Notas</span>
                            </Link>
                        </li>
                        <li>
                            <Link href={"/config"} class={`flex items-center gap-1 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-500 ${location.url.pathname === "/config/" ? "bg-slate-200 dark:bg-slate-500" : ""}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-settings" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>
                                <span class="hidden md:inline">Configuración</span>
                            </Link>
                        </li>
                        <li>
                            <button class="flex items-center w-full gap-1 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-sun" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" /></svg>
                                <span class="hidden md:inline">Tema</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </main>
    )
});
