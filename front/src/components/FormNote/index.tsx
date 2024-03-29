import { component$, useStore, useTask$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";

import { Props, NoteFormFields } from "./types";

import { useCreateNote, useUpdateNote } from "~/routes/(dashboard)/note/layout";
import { getNoteById } from "./servers";

export default component$<Props>(({ action, id, onSuccessForm$ }) => {
    const updateNote = useUpdateNote();
    const createNote = useCreateNote();

    const formFields = useStore<NoteFormFields>({
        title: "",
        description: "",
        isDraft: false
    });

    useTask$(async ({ track }) => {
        track(() => createNote.value);
        track(() => updateNote.value);

        if (id) {
            const noteResult = await getNoteById(id);
            if (noteResult?.success) {
                formFields.description = noteResult.data.description;
                formFields.title = noteResult.data.title;
                formFields.isDraft = noteResult.data.isDraft;
            }
        }

        if (createNote.value?.success || updateNote.value?.success) onSuccessForm$?.();
    });

    return (
        <Form
            class="is__form w-full gap-3 flex flex-col text-lg min-w-[350px]"
            action={action === "update" ? updateNote : createNote}>
            <legend class="text-2xl text-cyan-900 dark:text-white">Agregar nueva nota</legend>
            <div class="w-full">
                <fieldset class="wrap__input gap-2">
                    {
                        id && <input type="hidden" name="id" defaultValue={id} />
                    }
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
                        <input type="submit" class="is__button__primary px-3 py-1 rounded" value={"Guardar"} />
                    </div>
                </fieldset>
            </div>
        </Form>
    );
});
