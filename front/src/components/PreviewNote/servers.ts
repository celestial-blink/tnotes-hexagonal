import { server$ } from "@builder.io/qwik-city";

import NoteApi from "~/api/NoteApi";

export const getById = server$(async function (id: string) {
    const note = NoteApi.getById(id, this.signal, this.cookie);

    return note;
})
