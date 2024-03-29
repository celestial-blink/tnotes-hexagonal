import { $, component$, useContext, useOnDocument } from "@builder.io/qwik";

import { ModalContext } from "~/context/ModalContext";

export default component$(() => {
    const modalContext = useContext(ModalContext);

    const handleClickToggleModal = $(() => {
        if (!modalContext.show) {
            document.body.classList.remove('overflow-hidden');
        }
        modalContext.show = !modalContext.show;
    });

    const handleOnClose = $((event: PointerEvent, element: HTMLDivElement) => {
        const { dataset } = event.target as HTMLDivElement;
        if (dataset?.evref === "handleOnClose") handleClickToggleModal();
    });

    useOnDocument("DOMContentLoaded", $(() => {
        document.body.classList.add('overflow-hidden');
    }))

    return (
        <div class="bg-black bg-opacity-10 fixed h-full w-full top-0 left-0 flex justify-center px-2 py-5 overflow-x-hidden overflow-y-auto z-10 md:p-10 dark:bg-opacity-40" onDblClick$={handleOnClose} data-evref="handleOnClose">
            <div class="bg-white w-max min-w-[300px] max-w-3xl h-max rounded shadow-md dark:bg-slate-700 dark:text-white">
                <div class="border-b flex justify-end p-1 dark:border-slate-400">
                    <button onClick$={handleClickToggleModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                    </button>
                </div>
                <div class="p-2">
                    {modalContext.component}
                </div>
            </div>

        </div>
    );
});
