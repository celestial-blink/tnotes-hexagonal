import { Cookie } from "@builder.io/qwik-city";

import Fetch from "~/helpers/fetch";
import config from "~/config";

import { TaskFilters, TaskCreateParams, TaskFilterResult, TaskCountPendingResult, TaskUpdateParams, TaskProperties, TaskOnlyFilterResult } from "./types";

export default class TaskApi {
    static async create(task: TaskCreateParams, signal: AbortSignal | null, cookie: Cookie) {
        const createdResult = await Fetch.execute<TaskProperties>({
            url: `${config.PATH_BASE_API}task/insert`,
            cookie,
            requestInit: {
                method: "POST",
                signal,
                body: JSON.stringify(task),
            }
        });

        return createdResult;
    }

    static async update(id: string, task: Partial<TaskUpdateParams>, signal: AbortSignal | null, cookie: Cookie) {
        const updatedResult = await Fetch.execute<TaskProperties>({
            url: `${config.PATH_BASE_API}task/update/${id}`,
            cookie,
            requestInit: {
                method: "PUT",
                signal,
                body: JSON.stringify(task),
            }
        });

        return updatedResult;
    }

    static async remove(id: string, signal: AbortSignal | null, cookie: Cookie) {
        const updatedResult = await Fetch.execute<TaskProperties>({
            url: `${config.PATH_BASE_API}task/remove/${id}`,
            cookie,
            requestInit: {
                method: "DELETE",
                signal
            }
        });

        return updatedResult;
    }

    static async filter(filters: Partial<TaskFilters>, signal: AbortSignal | null, cookie: Cookie) {
        const queryString = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            queryString.append(key, value.toString());
        });

        const filterResult = await Fetch.execute<TaskFilterResult>({
            url: `${config.PATH_BASE_API}task/filter?${queryString.toString()}`,
            cookie,
            requestInit: {
                method: "GET",
                signal
            }
        });

        return filterResult;
    }

    static async onlyFilter(filters: Partial<TaskFilters>, signal: AbortSignal | null, cookie: Cookie) {
        const queryString = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            queryString.append(key, value.toString());
        });

        const filterResult = await Fetch.execute<TaskOnlyFilterResult>({
            url: `${config.PATH_BASE_API}task/only-filter?${queryString.toString()}`,
            cookie,
            requestInit: {
                method: "GET",
                signal
            }
        });

        return filterResult;
    }

    static async countPending(signal: AbortSignal | null, cookie: Cookie) {
        const countedPending = await Fetch.execute<TaskCountPendingResult>({
            url: `${config.PATH_BASE_API}task/count-pending`,
            cookie,
            requestInit: {
                method: "GET",
                signal
            }
        });

        return countedPending;
    }

    static async getById(id: string, signal: AbortSignal | null, cookie: Cookie) {
        const findTask = await Fetch.execute<TaskProperties>({
            url: `${config.PATH_BASE_API}task/id/${id}`,
            cookie,
            requestInit: {
                method: "GET",
                signal
            }
        });

        return findTask;
    }
}
