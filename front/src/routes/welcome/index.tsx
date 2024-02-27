import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {

    return (
        <main class="is__wrap text-base max-w-5xl">
            <div class="bg-white rounded-md p-5 flex flex-col items-center justify-between md:flex-row">
                <div class="flex flex-col h-full justify-between text-center items-center gap-5">
                    <h1 class="flex-none text-4xl text-cyan-600 font-bold mb-5">Bienvenidos a <span class="text-cyan-900">TNOTES</span></h1>
                    <p>La aplicación "TNOTES" es una herramienta de notas simple pero potente que te ayuda a organizar y gestionar tus ideas. Con TNOTES, puedes crear notas de texto, tareas y entre otros.</p>
                    <img src="/images/started.png" class="block max-w-xs md:w-4/12" alt="start" />
                    <Link href="/login/" class="is__button__primary px-20 py-2 w-ful rounded md:max-w-sm block">Comenzar</Link>
                    <p>Si no estas registrado, <Link href="/register/" class="is__link">regístrate aquí</Link></p>
                </div>
            </div>
        </main>
    );
});
