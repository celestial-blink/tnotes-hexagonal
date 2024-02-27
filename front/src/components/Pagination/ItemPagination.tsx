import { component$, $, PropFunction } from "@builder.io/qwik";

type Props = {
    current: boolean,
    value: number,
    handlePagination?: PropFunction<(offset: number) => void>
}

export default component$(({ current, value, handlePagination }: Props) => {

    const handleClick$ = $((event: PointerEvent, element: HTMLAnchorElement) => {
        event.preventDefault();
        if (current) return;
        handlePagination?.(value - 1);
    })

    return (
        <li> <a href="#" onClick$={handleClick$} class={`h-7 w-7 ${current ? "bg-slate-600 text-white dark:bg-cyan-500" : "bg-slate-100 dark:bg-slate-500"} block rounded text-center py-[.1rem]`}>{value}</a></li>
    );
})
