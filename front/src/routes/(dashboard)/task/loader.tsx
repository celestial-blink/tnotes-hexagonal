import { routeAction$ } from "@builder.io/qwik-city";

import Fetch from "~/helpers/fetch";

type TypeFilters = {
    includeDraft: boolean, onlyDraft: boolean,
    includeComplete: boolean, onlyComplete: boolean,
    onlyPending: boolean,
    title: string, offset: number, sorttype: number
};

const prepareQuery = (payload: TypeFilters): string => {
    const { title, includeDraft, onlyDraft, includeComplete, onlyComplete, onlyPending, ...rest } = payload;
    const preparePayload = {
        ...rest,
        ...(title.trim() ? { title } : {}),
        ...(includeDraft || onlyDraft || onlyPending ? {} : { isDraft: false }),
        ...(onlyDraft && !onlyPending ? { isDraft: true } : {}),
        ...(includeComplete || onlyComplete || onlyPending ? {} : { isComplete: false }),
        ...(onlyComplete && !onlyPending ? { isComplete: true } : {}),
        ...(onlyPending ? { isComplete: false, isDraft: false } : {})
    }

    const query = Object.entries(preparePayload).map(([key, value]) => `${key}=${value}`).join("&");
    return query;
}

export const useTask = routeAction$(async (data, { cookie }) => {
    const filters: TypeFilters = {
        includeDraft: !!data.includeDraft,
        onlyDraft: !!data.onlyDraft,
        includeComplete: !!data.includeComplete,
        onlyComplete: !!data.onlyComplete,
        onlyPending: !!data.onlyPending,
        offset: 0,
        sorttype: -1,
        title: data.title.toString()
    }
    const queryString = prepareQuery(filters);

    const tasks =  await Fetch.execute({
        requestInit: {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookie.get('accessToken')?.value}`,
                "refreshToken": `${cookie.get('refreshToken')?.value}`
            }
        },
        url: "http://127.0.0.1:1112/api/task/",
        cookie
    });
});
