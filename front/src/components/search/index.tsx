import { component$ } from "@builder.io/qwik";

const use

export default component$(() => {
    return (
        <form class="w-full gap-7 flex flex-col relative text-base z-[1]" onSubmit={handleOnSubmit}>
            <input type="search" class="custom__focus__input p-2 pr-7 rounded w-full outline-none bg-slate-100 dark:bg-slate-800 dark:text-white dark:border-slate-400" ref={refInput_search} onChange={handleOnChange} defaultValue={defaultValue} placeholder="Buscar..." />
            <ul class="absolute top-full hidden bg-white z-[2] w-full border shadow-xl p-2 max-h-sm overflow-auto dark:bg-slate-800 dark:border-slate-600" onClick={handleClickItem}>
                <li class="px-1 cursor-pointer text-sm bg-transparent hover:bg-slate-100" data-value={data} data-evref="handleClickItem">Buscar: {data}</li>
                {
                    dataFilter === null
                        ? <li class="px-1 text-sm">...</li>
                        : dataFilter.map(item => <li class="px-1 my-1 py-1 cursor-pointer text-sm text-slate-600 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-600" key={item._id} data-value={item.title} data-evref="handleClickItem">Resultados: {item.title.length <= 50 ? item.title : `${item.title.slice(0, 50)}...`}</li>)
                }
            </ul>
            <IconSearch stroke={1.2} size={24} class="absolute right-1 top-0 bottom-0 m-auto" />
        </form>
    );
}):
