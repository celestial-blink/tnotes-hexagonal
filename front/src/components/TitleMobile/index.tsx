import { component$, $ } from "@builder.io/qwik";
import { server$, useNavigate } from "@builder.io/qwik-city";

const closeSession = server$(async function () {
    this.cookie.delete("refreshToken");
    this.cookie.delete("accessToken");

    return {
        success: true
    }
});

export default component$(() => {
    const navigate = useNavigate();

    const handleCloseSession = $(async () => {
        const closeSessionResult = await closeSession();
        if (closeSessionResult.success) {
            navigate("/login");
        }
    })

    return (
        <div class="bg-white p-2 rounded flex justify-between items-center border-b sticky top-0 left-0 z-10 dark:bg-slate-700 dark:text-white dark:border-b-slate-600 md:hidden">
            <h1 class="text-2xl font-semibold">TNotes</h1>
            <details class="details">
                <summary class="list-none text-cyan-900 cursor-pointer p-1 rounded dark:text-white dark:border-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-circle" width="36" height="36" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" /></svg>
                </summary>
                <menu class="as-menu absolute bg-white p-2 right-[15px] rounded w-max flex gap-2 flex-col text-sm dark:bg-slate-800">
                    <li>
                        <a href="#" onClick$={handleCloseSession}>Cerrar Session</a>
                    </li>
                </menu>
            </details>
        </div>
    );
});
