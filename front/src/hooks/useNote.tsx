import { useStore } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

import { NoteFilters } from "~/api/NoteApi/types";
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
    includeDraft: boolean, onlyDraft: boolean, title: string, page: number, sort: "asc" | "desc"
};

const prepareQuery = (payload: TypeNoteFilters): Partial<NoteFilters> => {
    const { title, includeDraft, onlyDraft, ...rest } = payload;

    const preparePayload: Partial<NoteFilters> = { page: rest.page, sort: rest.sort };
    if (title?.trim()) preparePayload.title = title.trim();
    if (!(includeDraft || onlyDraft)) preparePayload.isDraft = false;
    if (onlyDraft) preparePayload.isDraft = true;


    return preparePayload;
}

export const filterNote = server$(async function (data) {
    const localFilters: TypeNoteFilters = {
        includeDraft: !!data.includeDraft,
        onlyDraft: !!data.onlyDraft,
        page: 1,
        sort: "desc",
        title: data.title
    }
    const filters = prepareQuery(localFilters);

    const notes = await NoteApi.filter<{ total: TypeDataTotal, result: TypeDataResult[] }>(filters, this.signal, this.cookie);

    return notes;
});


const useNote = () => {
    const notes = useStore<TypeNoteResult>({
        data: null,
        total: null
    });

    const noteFilters = useStore<TypeNoteFilters>({
        includeDraft: true,
        onlyDraft: false,
        page: 1,
        sort: "desc",
        title: ""
    });

    const onFetchData = async () => {
        const fetchData = await filterNote(noteFilters);
        if (fetchData.success) {
            notes.data = fetchData.data.result;
            notes.total = fetchData.data.total;
        }
    }

    return ({
        notes, noteFilters, onFetchData
    })
};

export default useNote;
