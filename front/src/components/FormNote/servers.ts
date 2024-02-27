import { server$ } from "@builder.io/qwik-city";

import { NoteProperties } from "~/api/NoteApi/types";
import NoteApi from "~/api/NoteApi";

export const getNoteById = server$(async function (id: string) {
    if (!id) return null;
    const note = await NoteApi.getById<NoteProperties>(id, this.signal, this.cookie);

    return note;
});
