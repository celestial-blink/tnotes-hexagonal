import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

type ItemLastNoteProps = {
    title: string
}

export default component$(({ title }: ItemLastNoteProps) => {
    return (
        <li class="border px-2 rounded flex justify-between items-center p-1 dark:bg-slate-800 dark:border-slate-600">
            <span> <strong>Title:</strong> {title} </span>
            <Link href={`/note/${title}`} data-state={{ title }} class="is__button__primary px-2 py-1 inline-block rounded">Ver</Link>
        </li>
    );
});

export const SkeletonItemLastNote = component$(() => {
    return <li class="p-4 bg-slate-100 rounded animate-pulse dark:bg-slate-600"></li>;
});
