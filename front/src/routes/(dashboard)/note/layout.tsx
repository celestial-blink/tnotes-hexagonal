import { routeAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city";
import NoteApi from "~/api/NoteApi";


const useCreateNoteValidate = zod$({
    title: z.string(),
    description: z.string(),
    isDraft: z.coerce.boolean().optional().default(false)
});

export const useCreateNote = routeAction$(async (note, { signal, cookie }) => {
    const createdNote = await NoteApi.create(note, signal, cookie);

    return createdNote;
}, useCreateNoteValidate);


const useUpdateNoteValidate = zod$({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    isDraft: z.coerce.boolean().optional().default(false)
});


export const useUpdateNote = routeAction$(async (note, { signal, cookie }) => {
    const { id, ...rest } = note;
    const updatedNote = await NoteApi.update(id, rest, signal, cookie);

    return updatedNote;
}, useUpdateNoteValidate);

export const useLoaderNote = routeLoader$(async ({ query, signal, cookie }) => {
    const title = query.get("title");
    const loaderNote = await NoteApi.filter(
        title ? { title } : {},
        signal,
        cookie
    );

    return loaderNote;
});


