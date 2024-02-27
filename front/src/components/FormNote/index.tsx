import { $, component$, useStore, useTask$ } from "@builder.io/qwik";

import { Props, NoteFormFields } from "./types";
import { useUpdateNote, useCreateNote } from "./actions";
import { getNoteById } from "./servers";

export default component$<Props>(({ action, id, onSuccessForm }) => {
    const formFields = useStore<NoteFormFields>({
        title: "",
        description: "",
        isDraft: false
    });

    const updateNote = useUpdateNote();
    const createNote = useCreateNote();

    useTask$(({ track }) => {
        if (id) getNoteById(id);
        track(() => createNote.value?.success);
        track(() => updateNote.value?.success);
        if (createNote.value?.success || updateNote.value?.success) {
            onSuccessForm?.()
        }
    });

    return (
        <form class="is__form w-full gap-3 flex flex-col text-lg min-w-[330px]" onSubmit$={action === "update" ? useUpdateNote : useCreateNote}>
            <legend class="text-2xl text-cyan-900 dark:text-white">Agregar nueva tarea</legend>
            <div class="w-full">
                <fieldset class="wrap__input gap-2">
                    <div class="flex flex-col">
                        <label class="label text-cyan-900 dark:text-white" for="title">Titulo</label>
                        <input type="text" class="input" name="title" id="title" defaultValue={formFields.title} maxLength={120} required />
                    </div>

                    <div class="flex flex-col">
                        <label class="label text-cyan-900 dark:text-white" for="description">Descripción</label>
                        <textarea class="input" name="description" id="description" defaultValue={formFields.description} cols={30} rows={10} required></textarea>
                    </div>

                    <label class="select-none cursor-pointer">
                        <input type="checkbox" name="isDraft" id="isDraft" defaultChecked={formFields.isDraft} /> Guardar en borradores
                    </label>

                    <div class="flex gap-2 mt-5 justify-between">
                        <div></div>
                        <input type="submit" class="is__button__primary px-3 py-1 rounded" value={action === "update" ? "Actualizar" : "Guardar"} />
                    </div>
                </fieldset>
            </div>
        </form>
    );
});
