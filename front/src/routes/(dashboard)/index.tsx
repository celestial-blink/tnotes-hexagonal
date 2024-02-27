import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

import { useSession } from "./layout";

import TitleMobile from "~/components/TitleMobile";
import ItemLastNote, { SkeletonItemLastNote } from "~/components/ItemLastNote";
import { useLastNotes, useCountPendingTask } from "./layout";

export default component$(() => {
    const session = useSession();
    const lastNotes = useLastNotes();
    const countPendingTask = useCountPendingTask();

    return (
        <div class="flex flex-col text-slate-800 gap-1 text-base">
            <TitleMobile />
            <section class="custom__shadow p-3 bg-white rounded dark:bg-slate-700 dark:text-white">
                <h2 class="font-semibold text-2xl">Hola {session.value.data.name}</h2>
            </section>
            <section class="custom__shadow p-3 bg-white rounded dark:bg-slate-700 dark:text-white">
                <h2 class="font-semibold text-xl">Mis actividades</h2>
                <div class="flex relative gap-3 mt-2 items-center">
                    <div class="relative text-center">
                        <svg height="110" width="110">
                            <circle class="fill-none w-full h-full" cx="50%" cy="50%" r="50" stroke-width={10} stroke-dasharray={315} stroke-dashoffset-dashoffset={0} stroke="#e8ebed"></circle>
                            <circle class="fill-none w-full h-full" cx="50%" cy="50%" r="50" stroke-width={10} stroke-dasharray={315} stroke-dashoffset-dashoffset={315 - (315 * (countPendingTask.value.percentTotal ?? 0) / 100)} stroke="#6c7a89"></circle>
                        </svg>
                        <span class="absolute m-auto top-[35%] text-2xl left-0 w-full">{countPendingTask.value.percentTotal}%</span>
                    </div>
                    <p>
                        {
                            countPendingTask.value.data?.total === 0
                                ? <>No tienes ninguna tarea pendiente <br /> Empieza a <strong>agregar nuevas tareas </strong> </>
                                : <>El {countPendingTask.value.percentTotal}% de tus tareas están completas <br /> Tienes <strong>{`${countPendingTask.value.data.total - countPendingTask.value.data.totalComplete}`} tareas</strong> por completar</>
                        }
                    </p>
                </div>
                <Link href={`/task/${countPendingTask.value.data.total === 0 ? "" : "pending"}`} class="is__button__primary px-5 py-2 inline-block mt-4 rounded">
                    {
                        countPendingTask.value.data.total === 0
                            ? <>Ir a mis tareas pendientes</>
                            : <>Ver mis {`${countPendingTask.value.data.total - countPendingTask.value.data.totalComplete} tareas pendientes ` || "todas mis tareas"}</>
                    }
                </Link>
            </section>
            <section class="custom__shadow p-3 bg-white rounded dark:bg-slate-700 dark:text-white">
                <h2 class="font-semibold text-xl">Agregar nuevo</h2>
                <p>Agrega una nueva nota o una nueva tarea.</p>
                <div class="flex gap-3">
                    <Link href="/note" data-state={{ add: true }} class="is__button__primary px-4 py-2 inline-block mt-4 rounded">Agregar nota</Link>
                    <Link href="/task" data-state={{ add: true }} class="is__button__primary px-4 py-2 inline-block mt-4 rounded">Agregar tarea</Link>
                </div>
            </section>
            <div class="flex gap-1 flex-col md:flex-row">
                <section class="custom__shadow p-3 bg-white rounded w-full dark:bg-slate-700 dark:text-white">
                    <h2 class="font-semibold text-xl">Mis ultimas notas</h2>
                    <ul class="flex flex-col gap-2 mt-2 ">
                        {
                            lastNotes.value !== null
                                ? (
                                    lastNotes.value.data?.length
                                        ? lastNotes.value.data.map(item => <ItemLastNote key={item.id} title={item.title} />)
                                        : <li>Sin resultados</li>
                                )
                                : <>
                                    <SkeletonItemLastNote />
                                    <SkeletonItemLastNote />
                                    <SkeletonItemLastNote />
                                    <SkeletonItemLastNote />
                                </>
                        }
                    </ul>
                    <div class="text-right">
                        {
                            lastNotes.value !== null
                                ? (
                                    lastNotes.value.data.length > 0
                                    &&
                                    <Link href="/note" class="is__button__primary px-5 py-2 inline-block mt-4 rounded">Ver todos</Link>
                                )
                                : <p class="p-6 w-[100px] text-right mt-4 inline-block rounded bg-slate-200 animate-pulse"></p>
                        }
                    </div>
                </section>
            </div>
        </div>
    );
});
