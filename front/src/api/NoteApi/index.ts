import { Cookie } from "@builder.io/qwik-city";

import Fetch from "~/helpers/fetch";
import config from "~/config";

import { NoteProperties, NoteFilterParams, NoteCreateParams, NoteFilterResult, NoteLastNotesResult, NoteUpdateParams } from "./types";

export default class NoteApi {
    static async create(note: NoteCreateParams, signal: AbortSignal | null, cookie: Cookie) {
        const createdResult = await Fetch.execute<NoteProperties>({
            url: `${config.PATH_BASE_API}note/insert`,
            cookie,
            requestInit: {
                method: "POST",
                signal,
                body: JSON.stringify(note),
            }
        });

        return createdResult;
    }

    static async update(id: string, note: Partial<NoteUpdateParams>, signal: AbortSignal | null, cookie: Cookie) {
        const updatedResult = await Fetch.execute<NoteProperties>({
            url: `${config.PATH_BASE_API}note/update/${id}`,
            cookie,
            requestInit: {
                method: "PUT",
                signal,
                body: JSON.stringify(note),
            }
        });

        return updatedResult;
    }

    static async remove(id: string, signal: AbortSignal | null, cookie: Cookie) {
        const updatedResult = await Fetch.execute<NoteProperties>({
            url: `${config.PATH_BASE_API}note/remove/${id}`,
            cookie,
            requestInit: {
                method: "DELETE",
                signal
            }
        });

        return updatedResult;
    }

    static async filter(filters: Partial<NoteFilterParams>, signal: AbortSignal | null, cookie: Cookie) {
        const queryString = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            queryString.append(key, value.toString());
        });

        const filterResult = await Fetch.execute<NoteFilterResult>({
            url: `${config.PATH_BASE_API}note/filter?${queryString.toString()}`,
            cookie,
            requestInit: {
                method: "GET",
                signal
            }
        });

        return filterResult;
    }

    static async onlyFilter(filters: Partial<NoteFilterParams>, signal: AbortSignal | null, cookie: Cookie) {
        const queryString = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            queryString.append(key, value.toString());
        });

        const filterResult = await Fetch.execute<NoteFilterResult>({
            url: `${config.PATH_BASE_API}note/only-filter?${queryString.toString()}`,
            cookie,
            requestInit: {
                method: "GET",
                signal
            }
        });

        return filterResult;
    }

    static async getById(id: string, signal: AbortSignal, cookie: Cookie) {
        const findTask = await Fetch.execute<NoteProperties>({
            url: `${config.PATH_BASE_API}note/id/${id}`,
            cookie,
            requestInit: {
                method: "GET",
                signal
            }
        });

        return findTask;
    }

    static async lastNotes(signal: AbortSignal, cookie: Cookie) {
        const findTask = await Fetch.execute<NoteLastNotesResult>({
            url: `${config.PATH_BASE_API}note/last-notes`,
            cookie,
            requestInit: {
                method: "GET",
                signal
            }
        });

        return findTask;
    }
}
