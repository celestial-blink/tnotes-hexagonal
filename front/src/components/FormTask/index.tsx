import { format } from "date-fns";
import { component$, useStore, useTask$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";

import { Props, TaskFormFields } from "./types";

import { useCreateTask, useUpdateTask } from "~/routes/(dashboard)/task/layout";
import { getTaskById } from "./servers";

export default component$<Props>(({ id, action, onSuccessForm$ }) => {
    const createTask = useCreateTask();
    const updateTask = useUpdateTask();

    const formFields = useStore<TaskFormFields>({
        title: "",
        description: "",
        endDate: null,
        isComplete: false,
        isDraft: false
    });

    useTask$(async ({ track }) => {
        track(() => createTask.value);
        track(() => updateTask.value);

        if (id) {
            const taskResult = await getTaskById(id);
            if (taskResult?.success) {
                formFields.title = taskResult.data.title;
                formFields.description = taskResult.data.description;
                formFields.endDate = taskResult.data.endDate;
                formFields.isComplete = taskResult.data.isComplete;
                formFields.isDraft = taskResult.data.isDraft;
            }
        }

        if (createTask.value?.success || updateTask.value?.success) onSuccessForm$?.();
    });

    return (
        <Form class="is__form w-full gap-3 flex flex-col text-lg min-w-[350px]" action={action === "update" ? updateTask : createTask}>
            <legend class="text-2xl text-cyan-900 dark:text-white">Agregar nueva tarea</legend>
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

                    <label class="select-none cursor-pointer">
                        <input type="checkbox" name="isComplete" id="isComplete" defaultChecked={formFields.isComplete} /> Esta completado
                    </label>

                    <div class="flex flex-col">
                        <label class="label text-cyan-900 dark:text-white" for="title">Fecha limite</label>
                        <input
                            type="datetime-local"
                            class="input accent-white"
                            name="endDate"
                            id="endDate"
                            defaultValue={formFields.endDate ? format(new Date(formFields.endDate), "yyyy-MM-dd'T'hh:mm") : ""}
                            min={ action === "update" ? undefined : format(Date.now(), "yyyy-MM-dd") + "T00:00"}
                        />
                    </div>

                    <div class="flex gap-2 mt-5 justify-between">
                        <div></div>
                        <input type="submit" class="is__button__primary px-3 py-1 rounded" value="Guardar" />
                    </div>
                </fieldset>
            </div>
        </Form>
    );
});
