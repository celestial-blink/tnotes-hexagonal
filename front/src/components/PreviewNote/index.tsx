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
        note
            ? <div className="w-full gap-2 flex flex-col text-lg min-w-[330px]">
                <h2 className="font-bold">{note.value?.title}</h2>
                <p className="text-base">{note.value?.description}</p>
            </div>
            : <p>Cargando...</p>
    );
});
