import { useStore, $ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

import { NoteFilterParams, NoteFilterResult } from "~/api/NoteApi/types";
import NoteApi from "~/api/NoteApi";

export type TypeDataResult = {
    id: string,
    title: string,
    createdAt: string,
    isDraft: boolean
};

export type TypeDataTotal = {
    total: number,
    totalPages: number,
    currentPage: number
};

export type TypeNoteResult = {
    data: TypeDataResult[] | null;
    total: TypeDataTotal | null
};


export type TypeNoteFilters = {
    includeDraft: boolean;
    onlyDraft: boolean;
    title: string;
    page: number;
    sort: "asc" | "desc";
};

const prepareFilter = (payload: TypeNoteFilters): Partial<NoteFilterParams> => {
    const { title, includeDraft, onlyDraft, ...rest } = payload;

    const preparePayload: Partial<NoteFilterParams> = { page: rest.page, sort: rest.sort };
    if (title?.trim()) preparePayload.title = title;
    if (!(includeDraft || onlyDraft)) preparePayload.isDraft = false;
    if (onlyDraft) preparePayload.isDraft = true;


    return preparePayload;
}

export const filterNote = server$(async function (data: TypeNoteFilters) {
    const localFilters: TypeNoteFilters = {
        includeDraft: !!data.includeDraft,
        onlyDraft: !!data.onlyDraft,
        page: data.page,
        sort: data.sort,
        title: data.title
    }
    const filters = prepareFilter(localFilters);

    const notes = await NoteApi.filter(filters, this.signal, this.cookie);

    return notes;
});


const useNote = (initialValues: NoteFilterResult = { entities: [], total: 1 }) => {
    const notes = useStore({
        data: initialValues.entities,
        total: initialValues.total
    });

    const noteFilters = useStore<TypeNoteFilters>({
        includeDraft: true,
        onlyDraft: false,
        page: 1,
        sort: "desc",
        title: ""
    });

    const onFetchData$ = $(async () => {
        const fetchData = await filterNote(noteFilters);
        if (fetchData.success) {
            notes.data = fetchData.data.entities;
            notes.total = fetchData.data.total;
        }
    })

    return ({
        notes, noteFilters, onFetchData$
    })
};

export default useNote;
