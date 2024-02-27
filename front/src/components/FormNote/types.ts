import { PropFunction } from "@builder.io/qwik";

import { NoteProperties } from "~/api/NoteApi/types";

export type Props = {
    id?: string,
    action?: string,
    onSuccessForm?: PropFunction<() => void>
}

export type NoteFormFields = Omit<NoteProperties, "createdAt" | "deletedAt" | "id">;
