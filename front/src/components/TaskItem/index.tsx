import { $, component$, useSignal } from "@builder.io/qwik";


import { Props } from "./types";

const evRefClose = ["update", "delete"];

export default component$<Props>(({ id, title, isComplete, createdAt, endDate, onClickMenu$, isDraft, onClickItem$ }) => {

    const showConfirmDelete = useSignal<boolean>(false);
    const refDetails = useSignal<HTMLDetailsElement>();

    const handleCloseDetails$ = $(() => {
        if (refDetails.value) refDetails.value.open = false;
    });

    const handleClickMenuItem$ = $((event: PointerEvent, element: HTMLMenuElement) => {
        const { dataset } = event.target as HTMLButtonElement;
        if (evRefClose.includes(dataset?.action ?? "")) handleCloseDetails$();

        showConfirmDelete.value = dataset?.action === "confirm-delete";

        onClickMenu$?.(
            dataset?.action ?? "",
            id,
            isDraft.toString()
        );
    });

    const handleClickItem = $((event: PointerEvent, element: HTMLAnchorElement) => {
        event.preventDefault();
        onClickItem$(id);
    });

    return (
        <div class="flex flex-wrap justify-between border rounded p-2 items-center bg-slate-100 dark:bg-slate-600 dark:text-white dark:border-none gap-2">
            <div class="flex gap-1 flex-1 h-full items-center justify-between">
                <div class="flex gap-1 flex-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-notes" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /><path d="M9 7l6 0" /><path d="M9 11l6 0" /><path d="M9 15l4 0" /></svg>
                    <h2><a href="#" onClick$={handleClickItem}>{title}</a></h2>
                </div>
                <div class="text-xs flex flex-col items-end flex-[.5]">
                    {!isDraft && isComplete ? <span class="block px-2 py-1 bg-green-400 rounded w-max dark:bg-green-500">Complete</span> : null}
                    {isDraft ? <span class="block px-2 py-1 bg-gray-300 rounded w-max dark:text-slate-800">Borradores</span> : null}
                    <span class="block text-slate-500 mt-1 whitespace-pre-wrap text-right dark:text-slate-200">{`Creado el ${createdAt} ${endDate ? `- Fecha limite ${endDate}` : ""}`}</span>
                </div>
            </div>
            <details class="details relative" ref={refDetails}>
                <summary class="list-none text-cyan-900 cursor-pointer dark:text-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-dots" width="32" height="32" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>
                </summary>
                <menu class="as-menu absolute bg-white p-1 right-0 rounded w-max flex gap-2 flex-col dark:bg-slate-700" onClick$={handleClickMenuItem$}>
                    <li>
                        <button data-action="update" class="p-1 w-full hover:bg-slate-200 text-right dark:hover:bg-slate-500">Editar</button>
                    </li>
                    <li> <menu class={`w-full ${showConfirmDelete.value ? "bg-red-500 text-white flex justify-evenly" : "hover:bg-slate-200"}`}>
                        {
                            showConfirmDelete.value
                                ?
                                <>
                                    <li>
                                        <button class="p-1 text-right" data-action="delete">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check inline-block" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l5 5l10 -10" /></svg>
                                        </button>
                                    </li>
                                    <li>
                                        <button class="p-1 text-right" data-action="cancel-delete">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x inline-block" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                                        </button>
                                    </li>
                                </>
                                :
                                <li>
                                    <button class="p-1 w-full hover:bg-slate-200 text-right dark:hover:bg-slate-500" data-action="confirm-delete"> Eliminar </button>
                                </li>
                        }
                    </menu> </li>
                    <li>
                        <button data-action="asDraft" class="p-1 w-full cursor-pointer hover:bg-slate-200 text-right disabled:opacity-60 disabled:bg-slate-200 disabled:cursor-not-allowed dark:hover:bg-slate-500"> {isDraft ? "Quitar de" : "Agregar a"} borradores</button>
                    </li>
                </menu>
            </details>
        </div>
    );
});
