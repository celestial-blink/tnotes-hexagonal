import { server$ } from "@builder.io/qwik-city";

import TaskApi from "~/api/TaskApi";

export const getById = server$(async function (id: string) {
    const task = await TaskApi.getById(id, this.signal, this.cookie);

    return task;
})
