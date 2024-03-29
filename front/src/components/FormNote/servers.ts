import { server$ } from "@builder.io/qwik-city";

import NoteApi from "~/api/NoteApi";

export const getNoteById = server$(async function (id: string) {
    if (!id) return null;
    const note = await NoteApi.getById(id, this.signal, this.cookie);

    return note;
});
