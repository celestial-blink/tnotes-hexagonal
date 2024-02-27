import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { format } from "date-fns";

import { Props } from "./types";
import { TaskProperties } from "~/api/TaskApi/types";

import { getById } from "./servers";

export default component$<Props>(({ id }) => {
    const task = useSignal<TaskProperties | null>(null);

    useTask$(({ track }) => {
        track(() => id);

        if (id) {
            getById(id).then(res => {
                if (res?.success) {
                    task.value = res.data;
                }
            })
        }
    });

    return task
        ? <div class="w-full gap-2 flex flex-col text-lg min-w-[330px]">
            <h2 class="font-bold">{task.value?.title}</h2>
            <p class="text-base">{task.value?.description}</p>
            {
                task.value?.endDate !== null
                    ? <p class="text-base"><strong>Fecha limite:</strong> {format(new Date(task.value?.endDate ?? ""), "dd 'de' MMMM 'del' yyyy ")} </p>
                    : null
            }
        </div>
        : <p>Cargando...</p>
})
