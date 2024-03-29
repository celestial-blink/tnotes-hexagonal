import { component$, useSignal, PropFunction, $ } from "@builder.io/qwik";

import type { NoteFilterEntitiesResult } from "~/api/NoteApi/types";

// function debounce<F extends (...args: any) => any>(fn: F, delay = 500) {
//     let timeoutId: ReturnType<typeof setTimeout>;

//     return (...args: Parameters<F>): Promise<ReturnType<F>> => {
//         return new Promise((resolve) => {
//             if (timeoutId) clearTimeout(timeoutId);
//             timeoutId = setTimeout(() => {
//                 resolve(fn(...(args as any[])));
//             }, delay);
//         });
//     };
// }

type Props = {
    onCustomSubmit$: PropFunction<(title: string) => void>,
    onChange$: PropFunction<(title: string) => Promise<NoteFilterEntitiesResult[] | null>>;
    defaultValue?: string
}

export default component$<Props>(({ onCustomSubmit$, onChange$, defaultValue }) => {
    const valueSearch = useSignal(defaultValue ?? "");
    const coincidences = useSignal<null | NoteFilterEntitiesResult[]>(null);

    const handleOnChange$ = $(async (_: InputEvent, element: HTMLInputElement) => {
        const { value } = element;
        valueSearch.value = value;
        coincidences.value = null;

        onChange$(value.trim()).then(res => {
            if (res) coincidences.value = res;
        });

        if (value?.trim() === "") {
            onCustomSubmit$(valueSearch.value)
        }
    });

    const handleClickItem$ = $((event: PointerEvent, element: HTMLUListElement) => {
        event.preventDefault();

        const { tagName, dataset } = event.target as HTMLLIElement;
        if (tagName === "LI" && dataset.evref === "handleClickItem") {
            const value = dataset?.value ?? "";
            valueSearch.value = value;
            onCustomSubmit$(value);
        }
    });

    return (
        <form class="w-full flex relative text-base z-[1]" onSubmit$={() => onCustomSubmit$(valueSearch.value)} preventdefault:submit>
            <input type="search" class="custom__focus__input p-2 pr-7 rounded w-full outline-none bg-slate-100 dark:bg-slate-800 dark:text-white dark:border-slate-400" bind:value={valueSearch} onInput$={handleOnChange$} placeholder="Buscar..." />
            <ul class="absolute top-full hidden bg-white z-[2] w-full border shadow-xl p-2 max-h-sm overflow-auto dark:bg-slate-800 dark:border-slate-600" onClick$={handleClickItem$}>
                <li class="px-1 cursor-pointer text-sm bg-transparent hover:bg-slate-100" data-value={valueSearch.value} data-evref="handleClickItem">Buscar: {valueSearch.value}</li>
                {
                    coincidences.value === null
                        ? <li class="px-1 text-sm">...</li>
                        : coincidences.value.map(item => (
                            <li class="px-1 my-1 py-1 cursor-pointer text-sm text-slate-600 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-600" key={item.id} data-value={item.title} data-evref="handleClickItem">
                                Resultados: {item.title.length <= 50 ? item.title : `${item.title.slice(0, 50)}...`}
                            </li>
                        ))
                }
            </ul>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-search absolute right-1 top-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.4" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
        </form>
    );
});
