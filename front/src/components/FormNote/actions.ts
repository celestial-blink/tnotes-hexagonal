import { routeAction$, z, zod$ } from "@builder.io/qwik-city";

import NoteApi from "~/api/NoteApi";

const useCreateNoteValidate = zod$({
    title: z.string(),
    description: z.string(),
    isDraft: z.boolean()
});

const useUpdateNoteValidate = zod$({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    isDraft: z.boolean().optional()
});


export const useCreateNote = routeAction$(async (note, { signal, cookie }) => {
    const createdNote = await NoteApi.create(note, signal, cookie);

    return createdNote;
}, useCreateNoteValidate);


export const useUpdateNote = routeAction$(async (note, { signal, cookie }) => {
    const { id, ...rest } = note;
    const updatedNote = await NoteApi.update(id, rest, signal, cookie);

    return updatedNote;
}, useUpdateNoteValidate);
