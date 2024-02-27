import { $, useStore } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

import TaskApi from "~/api/TaskApi";
import { TaskFilters, TaskFilterResult } from "~/api/TaskApi/types";

export type TypeTaskFilters = {
    includeDraft: boolean, onlyDraft: boolean,
    includeComplete: boolean, onlyComplete: boolean,
    onlyPending: boolean,
    title: string, page: number, sort: "asc" | "desc"
};

const prepareFilter = (payload: TypeTaskFilters): Partial<TaskFilters> => {
    const { title, includeDraft, onlyDraft, includeComplete, onlyComplete, onlyPending, ...rest } = payload;
    const preparePayload: Partial<TaskFilters> = {};
    preparePayload.page = rest.page;
    preparePayload.sort = rest.sort;

    if (title.trim()) preparePayload.title = title;
    if (onlyDraft && !onlyPending) preparePayload.isDraft = true;
    if (!(includeDraft || onlyDraft || onlyPending)) preparePayload.isDraft = false;
    if (onlyComplete && !onlyPending) preparePayload.isComplete = true;
    if (!(includeComplete || onlyComplete || onlyPending)) preparePayload.isComplete = false;
    if (onlyPending) {
        preparePayload.isComplete = false;
        preparePayload.isDraft = false;
    }

    return preparePayload;
}

export const filterTask = server$(async function (data: TypeTaskFilters) {
    const localFilters: TypeTaskFilters = {
        includeDraft: !!data.includeDraft,
        onlyDraft: !!data.onlyDraft,
        includeComplete: !!data.includeComplete,
        onlyComplete: !!data.onlyComplete,
        onlyPending: !!data.onlyPending,
        page: data.page,
        sort: data.sort,
        title: data.title.toString()
    }
    const filters = prepareFilter(localFilters);

    const tasks = await TaskApi.filter(filters, this.signal, this.cookie);

    return tasks;
});


const useTask = (initialValues: TaskFilterResult = { entities: [], total: 1 }) => {
    const tasks = useStore({
        data: initialValues.entities,
        total: initialValues.total
    });

    const taskFilters = useStore<TypeTaskFilters>({
        includeDraft: true,
        onlyDraft: false,
        includeComplete: true,
        onlyComplete: false,
        onlyPending: false,
        page: 1,
        sort: "desc",
        title: ""
    });

    const onFetchData$ = $(async () => {
        const fetchData = await filterTask(taskFilters);
        if (fetchData.success) {
            tasks.data = fetchData.data.entities;
            tasks.total = fetchData.data.total
        }
    })

    return ({
        tasks, taskFilters, onFetchData$
    })
};

export default useTask;
