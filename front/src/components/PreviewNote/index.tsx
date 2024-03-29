import { component$, useSignal, useTask$ } from "@builder.io/qwik";

import { NoteProperties } from "~/api/NoteApi/types";
import { Props } from "./types";
import { getById } from "./servers";

export default component$<Props>(({ id }) => {
    const note = useSignal<NoteProperties | null>(null);

    useTask$(({ track }) => {
        track(() => id);

        if (id) {
            getById(id).then(res => {
                if (res?.success) {
                    note.value = res.data;
                }
            })
        }
    });

    return (
        note.value
            ? <div class="w-full gap-2 flex flex-col text-lg min-w-[330px]">
                <h2 class="font-bold">{note.value?.title}</h2>
                <p class="text-base">{note.value?.description}</p>
            </div>
            : <p>Cargando...</p>
    );
});
