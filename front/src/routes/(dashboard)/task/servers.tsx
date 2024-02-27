import { server$ } from "@builder.io/qwik-city";

import TaskApi from "~/api/TaskApi";
import { TaskFilters, TaskProperties } from "~/api/TaskApi/types";

export const getCoincidences = server$(async function (title: string) {
    const tasks = await TaskApi.onlyFilter({ title, pageSize: 5 }, this.signal, this.cookie);

    return tasks;
});


export const deleteTask = server$(async function (id: string) {
    const taskDeleted = await TaskApi.remove(id, this.signal, this.cookie);

    return taskDeleted;
});

export const draftTask = server$(async function (id: string, isDraft: boolean) {
    const taskDraft = await TaskApi.update(id, { isDraft }, this.signal, this.cookie);

    return taskDraft;
});

export const updateTask = server$(async function (id: string, task: Partial<TaskProperties>) {
    const taskUpdate = await TaskApi.update(id, task, this.signal, this.cookie);

    return taskUpdate;
});

export const filterTask = server$(async function (filters: Partial<TaskFilters>) {
    const tasks = await TaskApi.filter(filters, this.signal, this.cookie);

    return tasks;
});
