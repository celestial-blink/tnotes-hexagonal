import { component$ } from "@builder.io/qwik";
import { routeAction$ } from "@builder.io/qwik-city";

import TitleMobile from "~/components/TitleMobile";



export default component$(() => {
    return (
        <>
            <section class="flex flex-col gap-1">
                <TitleMobile />
                <section class="rounded bg-white flex items-center gap-2 p-2 z-[2] md:gap-2 dark:bg-slate-700 dark:text-white">
                    <Search onChange={onChangeSearch} onSubmit={handleSubmit} />
                    <button class="is__button__primary py-2 px-4 rounded h-max" onClick={() => { handleAdd() }}>Nuevo</button>
                </section>
                <section class="rounded bg-white flex justify-end gap-5 p-2 relative dark:bg-slate-700 dark:text-white" >
                    <details class="details" onClick={handleClickFilter} ref={refFilter_details}>
                        <summary class="list-none text-cyan-900 cursor-pointer p-1 rounded dark:text-white dark:border-slate-400"> <IconFilter class="inline-block align-bottom" /> Filtros</summary>
                        <menu class="as-menu absolute bg-white p-2 right-[15px] rounded w-max flex gap-2 flex-col text-sm dark:bg-slate-800">
                            <li> <button class={`w-full text-left p-[2px] rounded ${filters.sorttype === 1 ? "bg-slate-200 dark:bg-slate-500" : ""}`} data-action="sorttype" data-evref="handleClickFilter" value={1}> <IconArrowUp class="inline-block align-bottom" /> Ordenar ascendente </button> </li>
                            <li> <button class={`w-full text-left p-[2px] rounded ${filters.sorttype === -1 ? "bg-slate-200 dark:bg-slate-500" : ""}`} data-action="sorttype" data-evref="handleClickFilter" value={-1}> <IconArrowDown class="inline-block align-bottom" /> Ordenar descendente </button> </li>
                            <li class="w-full h-[2px] bg-slate-200"></li>
                            <li> <button class="w-full text-left disabled:opacity-60 disabled:cursor-not-allowed" disabled={filters.onlyDraft || filters.onlyPending || filters.onlyComplete} data-action="includeDraft" data-evref="handleClickFilter"> {filters.includeDraft ? <IconSquareCheckFilled class={`inline-block align-bottom ${filters.onlyDraft || filters.onlyPending || filters.onlyComplete ? "text-slate-600" : "text-green-500"}`} /> : <IconSquare class="inline-block align-bottom" />} Mostrar borradores </button> </li>
                            <li> <button class="w-full text-left disabled:opacity-60 disabled:cursor-not-allowed" disabled={filters.onlyPending || filters.onlyComplete} data-action="onlyDraft" data-evref="handleClickFilter"> {filters.onlyDraft ? <IconSquareCheckFilled class={`inline-block align-bottom ${filters.onlyPending ? "text-slate-600" : "text-green-500"}`} /> : <IconSquare class="inline-block align-bottom" />} Solo borradores </button> </li>
                            <li class="w-full h-[2px] bg-slate-200"></li>
                            <li> <button class="w-full text-left disabled:opacity-60 disabled:cursor-not-allowed" disabled={filters.onlyComplete || filters.onlyPending || filters.onlyDraft} data-action="includeComplete" data-evref="handleClickFilter"> {filters.includeComplete ? <IconSquareCheckFilled class={`inline-block align-bottom ${filters.onlyComplete || filters.onlyPending || filters.onlyDraft ? "text-slate-600" : "text-green-500"}`} /> : <IconSquare class="inline-block align-bottom" />} Mostrar completados </button> </li>
                            <li> <button class="w-full text-left disabled:opacity-60 disabled:cursor-not-allowed" disabled={filters.onlyPending || filters.onlyDraft} data-action="onlyComplete" data-evref="handleClickFilter"> {filters.onlyComplete ? <IconSquareCheckFilled class={`inline-block align-bottom ${filters.onlyPending ? "text-slate-600" : "text-green-500"}`} /> : <IconSquare class="inline-block align-bottom" />} Solo completados </button> </li>
                            <li class="w-full h-[2px] bg-slate-200"></li>
                            <li> <button class="w-full text-left disabled:opacity-60 disabled:cursor-not-allowed" disabled={filters.onlyComplete || filters.onlyDraft} data-action="onlyPending" data-evref="handleClickFilter"> {filters.onlyPending ? <IconSquareCheckFilled class={`inline-block align-bottom ${filters.onlyComplete || filters.onlyDraft ? "text-slate-600" : "text-green-500"}`} /> : <IconSquare class="inline-block align-bottom" />} Solo pendientes </button> </li>
                        </menu>
                    </details>
                </section>
                <section class="rounded bg-white p-2 dark:bg-slate-700 dark:text-white">
                    <Pagination title="notas" total={dataTotal?.totalPages ?? 0} current={dataTotal?.currentPage ?? 0} handlePagination={handlePagination} />
                    <div class="flex  flex-col gap-2 mt-2">
                        {
                            data !== null
                                ? (data.length ? data.map(item => <TaskItem key={item._id} id={item._id} title={item.title} createdAt={format(new Date(item.createdAt), "dd MMMM yyyy")} onClickMenu={handleClickMenuItem} isDraft={item.isDraft} onClickItem={handleView} endDate={item.endDate === null ? "--" : format(new Date(item.endDate), "dd MMMM yyyy")} isComplete={item.isComplete} />) : <p>Sin resultados</p>)
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

        </>
})
