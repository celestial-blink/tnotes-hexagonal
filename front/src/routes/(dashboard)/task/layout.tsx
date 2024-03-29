import { routeAction$, routeLoader$, zod$, z } from "@builder.io/qwik-city";
import TaskApi from "~/api/TaskApi";

const validationSubmitCreateTask = zod$({
    title: z.string(),
    description: z.string(),
    isDraft: z.coerce.boolean().optional().default(false),
    endDate: z.coerce.date().nullable(),
    isComplete: z.coerce.boolean().optional().default(false),
});

export const useCreateTask = routeAction$(async (task, { cookie, signal }) => {
    const createdTask = await TaskApi.create(task, signal, cookie);
    console.log("🚀 ~ useCreateTask ~ createdTask:", createdTask)

    return createdTask;
}, validationSubmitCreateTask);

const validationSubmitUpdateTask = zod$({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    isDraft: z.coerce.boolean().optional().default(false),
    endDate: z.coerce.date().nullable(),
    isComplete: z.coerce.boolean().optional().default(false)
});

export const useUpdateTask = routeAction$(async (task, { cookie, signal }) => {
    const { id, ...rest } = task;
    const updatedTask = await TaskApi.update(id, rest, signal, cookie);

    return updatedTask;
}, validationSubmitUpdateTask);

export const useLoaderTask = routeLoader$(async ({ query, signal, cookie }) => {

    const loaderTask = await TaskApi.filter(
        query.get("is_pending") ? { isComplete: false, isDraft: false } : {},
        signal,
        cookie
        );

    return loaderTask;
});

