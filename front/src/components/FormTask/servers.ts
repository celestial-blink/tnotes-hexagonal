import { server$ } from "@builder.io/qwik-city";

import TaskApi from "~/api/TaskApi";

export const getTaskById = server$(async function (id: string) {
    if (!id) return null;
    const task = await TaskApi.getById(id, this.signal, this.cookie);

    return task;
});
