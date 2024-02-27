import { server$ } from "@builder.io/qwik-city";

import NoteApi from "~/api/NoteApi";
import { NoteProperties, NoteFilterParams } from "~/api/NoteApi/types";

export const getCoincidences = server$(async function (title: string) {
    const tasks = await NoteApi.onlyFilter({ title, pageSize: 5 }, this.signal, this.cookie);

    return tasks;
});

export const deleteNote = server$(async function (id: string) {
    const noteDeleted = await NoteApi.remove(id, this.signal, this.cookie);

    return noteDeleted;
});

export const draftNote = server$(async function (id: string, isDraft: boolean) {
    const noteDraft = await NoteApi.update(id, { isDraft }, this.signal, this.cookie);

    return noteDraft;
});

export const updateNote = server$(async function (id: string, note: Partial<NoteProperties>) {
    const noteUpdated = await NoteApi.update(id, note, this.signal, this.cookie);

    return noteUpdated;
});

export const filterNote = server$(async function (filters: Partial<NoteFilterParams>) {
    const notes = await NoteApi.filter(filters, this.signal, this.cookie);

    return notes;
});
