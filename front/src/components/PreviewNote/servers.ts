import { server$ } from "@builder.io/qwik-city";

import NoteApi from "~/api/NoteApi";
import { NoteProperties } from "~/api/NoteApi/types";

export const getById = server$(async function (id: string) {
    const note = NoteApi.getById<NoteProperties>(id, this.signal, this.cookie);

    return note;
})
