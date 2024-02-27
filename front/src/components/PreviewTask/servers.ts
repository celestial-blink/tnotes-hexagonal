import { server$ } from "@builder.io/qwik-city";

import TaskApi from "~/api/TaskApi";
import { TaskProperties } from "~/api/TaskApi/types";

export const getById = server$(async function (id: string) {
    const task = await TaskApi.getById<TaskProperties>(id, this.signal, this.cookie);

    return task;
})
