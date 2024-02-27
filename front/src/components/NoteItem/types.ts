import { PropFunction } from "@builder.io/qwik";

export type Props = {
    id: string,
    title: string;
    isDraft: boolean;
    createdAt: string;
    onClickMenu$?: PropFunction<(action: string, id?: string, payload?: string) => void>,
    onClickItem$?: PropFunction<(id: string) => void>
}
