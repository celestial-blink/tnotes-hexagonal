import { PropFunction } from "@builder.io/qwik";

export type Props = {
    id: string,
    title: string,
    isDraft: boolean,
    isComplete: boolean,
    createdAt: string,
    endDate: string,
    onClickMenu$: PropFunction<(action: string, id?: string, payload?: string) => void>,
    onClickItem$: PropFunction<(id: string) => void>
};
