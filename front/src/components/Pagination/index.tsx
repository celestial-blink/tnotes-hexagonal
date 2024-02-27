import { QRL, component$, useSignal, $, PropFunction } from "@builder.io/qwik";

import { generatePages } from "./helpers";

import ItemPagination from "./ItemPagination";

type Props = {
    title: string;
    total: number;
    current: number;
    handlePagination?: PropFunction<(offset: number) => void>;
};

export default component$<Props>(({ title, total, current, handlePagination }) => {
    const data = useSignal<Array<number>>(generatePages(total, current));

    const handleClickNext$ = $(() => {
        if (current === total) return;
        handlePagination?.(current);
    });

    const handleClickPrevious$ = $(() => {
        const prepareValue = current - 1;
        if (current < 1) return;
        handlePagination?.(prepareValue - 1);
    });

    return (
        <nav class="flex bg-white rounded p-2 gap-2 justify-between sticky top-0 text-cyan-900 flex-wrap z-[1] dark:bg-slate-700 dark:text-white">
            <h2 class="text-2xl">Lista de {title}</h2>
            <div class="flex gap-3 shadow-sm">
                <button class="bg-slate-100 rounded disabled:bg-slate-200 disabled:cursor-not-allowed dark:bg-slate-400 dark:text-white" onClick$={handleClickPrevious$} disabled={current < 2}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-left" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 6l-6 6l6 6" /></svg>
                </button>
                <ul class="flex items-center gap-1">
                    {
                        data.value[0] > 1
                            ? <li><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-dots" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg> </li>
                            : null
                    }
                    {
                        data.value.map((item, key) => <ItemPagination key={key} current={item === current} value={item} handlePagination={handlePagination} />)
                    }
                    {
                        (data.value.at(-1) ?? 0) < total
                            ? <li><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-dots" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg> </li>
                            : null
                    }
                </ul>
                <button class="bg-slate-100 rounded disabled:bg-slate-200 disabled:cursor-not-allowed dark:bg-slate-400 dark:text-white" onClick$={handleClickNext$} disabled={total === 0 || current === total}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-right" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 6l6 6l-6 6" /></svg>
                </button>
            </div>

        </nav>
    );
})
