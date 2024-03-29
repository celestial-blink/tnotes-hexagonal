import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { format } from "date-fns";

import { Props } from "./types";
import { TaskProperties } from "~/api/TaskApi/types";
import { getById } from "./servers";

export default component$<Props>(({ id }) => {
    const task = useSignal<TaskProperties | null>(null);

    useTask$(async ({ track }) => {
        track(() => id);

        if (id) {
            const taskId = await getById(id);
            if (taskId?.success) {
                task.value = taskId.data;
            }
        }
    });

    return task.value
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
