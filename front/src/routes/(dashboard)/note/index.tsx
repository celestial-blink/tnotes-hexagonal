import { component$, $, useContext } from "@builder.io/qwik";
import { format } from "date-fns";

import NoteItem from "~/components/NoteItem";
import Pagination from "~/components/Pagination";
import Search from "~/components/Search";
import { SkeletonTaskItem } from "~/components/TaskItem/Skeleton";
import TitleMobile from "~/components/TitleMobile";
import { ModalContext } from "~/context/ModalContext";
import useNote from "~/hooks/useNote";
import FormNote from "~/components/FormNote";
import PreviewNote from "~/components/PreviewNote";

import { deleteNote, updateNote, getCoincidences } from "./servers";

export default component$(() => {
    const { noteFilters, notes, onFetchData } = useNote();
    const modalContext = useContext(ModalContext);

    const onSuccessForm = $(() => {
        onFetchData();
        modalContext.component = null;
        modalContext.show = false;
    });

    const handleAdd = $((id?: string, action?: string) => {
        modalContext.component = <FormNote id={id} action={action} onSuccessForm={onSuccessForm} />
        modalContext.show = true;
    });

    const handleDelete$ = $(async (id: string) => {
        const deletedTask = await deleteNote(id);
        if (deletedTask.success) onFetchData();
    })

    const handleSetIsDraft$ = $(async (id: string) => {
        const updatedTask = await updateNote(id, { isDraft: true });
        if (updatedTask.success) onFetchData();
    })

    const handleView = $((id: string) => {
        modalContext.component = <PreviewNote id={id} />;
        modalContext.show = true;
    });

    const onChangeSearch$ = $(async (title: string) => {
        const fetchData = await getCoincidences(title);

        return fetchData.data.entities;
    });

    const onSubmitSearch$ = (async (title: string) => {
        noteFilters.title = title;
    });

    const handlePagination = (page: number = 0) => {
        noteFilters.page = page;
    };

    const handleClickFilter = $((event: PointerEvent, _: HTMLDetailsElement) => {
        const { dataset, tagName, value } = event.target as HTMLButtonElement;
        if (tagName === "BUTTON" && dataset?.evref === "handleClickFilter" && dataset.action && Object.hasOwn(noteFilters, dataset?.action)) {
            if (dataset.action === "sort") noteFilters.sort = value === "asc" ? "asc" : "desc";
            if (dataset.action === "includeDraft") noteFilters.includeDraft = !noteFilters.includeDraft;
            if (dataset.action === "onlyDraft") noteFilters.includeDraft = !noteFilters.onlyDraft;
        }
    });

    const handleClickMenuItem$ = $((action: string, id?: string, payload?: string) => {
        if (action === "update") handleAdd(id, "update");
        if (action === "delete" && id) handleDelete$(id);
        if (action === "asDraft" && id) handleSetIsDraft$(id);
    })

    return (
        <section class="flex flex-col gap-1">
            <TitleMobile />
            <section class="rounded bg-white flex items-center gap-2 p-2 z-[2] md:gap-2 dark:bg-slate-700 dark:text-white">
                <Search onChange$={onChangeSearch$} onCustomSubmit$={onSubmitSearch$} defaultValue={""} />
                <button class="is__button__primary py-2 px-4 rounded h-max" onClick$={() => { handleAdd() }}>Nuevo</button>
            </section>
            <section class="rounded bg-white flex justify-end gap-5 p-2 relative dark:bg-slate-700 dark:text-white" >
                <details class="details" onClick$={handleClickFilter}>
                    <summary class="list-none text-cyan-900 cursor-pointer p-1 rounded dark:text-white dark:border-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-filter inline-block align-bottom" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" /></svg>
                        Filtros
                    </summary>
                    <menu class="as-menu absolute bg-white p-2 right-[15px] rounded w-max flex gap-2 flex-col text-sm dark:bg-slate-800">
                        <li>
                            <button class={`w-full text-left p-[2px] rounded ${noteFilters.sort === "asc" ? "bg-slate-200 dark:bg-slate-500" : ""}`} data-action="sorttype" data-evref="handleClickFilter" value={1}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-up inline-block align-bottom" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M18 11l-6 -6" /><path d="M6 11l6 -6" /></svg>
                                Ordenar ascendente
                            </button>
                        </li>
                        <li>
                            <button class={`w-full text-left p-[2px] rounded ${noteFilters.sort === "desc" ? "bg-slate-200 dark:bg-slate-500" : ""}`} data-action="sorttype" data-evref="handleClickFilter" value={-1}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-down inline-block align-bottom" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M18 13l-6 6" /><path d="M6 13l6 6" /></svg>
                                Ordenar descendente
                            </button>
                        </li>
                        <li class="w-full h-[2px] bg-slate-200"></li>
                        <li> <button class="w-full text-left disabled:opacity-60 disabled:cursor-not-allowed" disabled={noteFilters.onlyDraft} data-action="includeDraft" data-evref="handleClickFilter">
                            {
                                noteFilters.includeDraft
                                    ? <svg xmlns="http://www.w3.org/2000/svg" class={`inline-block align-bottom ${noteFilters.onlyDraft ? "text-slate-600" : "text-green-500"}`} width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.626 7.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" stroke-width="0" fill="currentColor" /></svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square inline-block align-bottom" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /></svg>
                            }
                            Mostrar borradores
                        </button>
                        </li>
                        <li> <button class="w-full text-left" data-action="onlyDraft" data-evref="handleClickFilter">
                            {
                                noteFilters.onlyDraft
                                    ? <svg xmlns="http://www.w3.org/2000/svg" class={`inline-block align-bottom text-green-500`} width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.626 7.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" stroke-width="0" fill="currentColor" /></svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square inline-block align-bottom" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /></svg>
                            }
                            Solo borradores
                        </button>
                        </li>
                    </menu>
                </details>
            </section>
            <section class="rounded bg-white p-2 dark:bg-slate-700 dark:text-white">
                <Pagination title="notas" total={notes.total?.totalPages ?? 0} current={notes.total?.currentPage ?? 0} handlePagination={handlePagination} />
                <div class="flex  flex-col gap-2 mt-2">
                    {
                        notes !== null
                            ? (
                                notes.data?.length
                                    ? notes.data.map(item => <NoteItem key={item.id} id={item.id} title={item.title} createdAt={format(new Date(item.createdAt), "dd MMMM yyyy")} onClickMenu$={handleClickMenuItem$} isDraft={item.isDraft} onClickItem$={handleView} />)
                                    : <p>Sin resultados</p>
                            )
                            : <>
                                <SkeletonTaskItem />
                                <SkeletonTaskItem />
                                <SkeletonTaskItem />
                                <SkeletonTaskItem />
                                <SkeletonTaskItem />
                                <SkeletonTaskItem />
                            </>
                    }
                </div>
            </section>
        </section>
    );
})
