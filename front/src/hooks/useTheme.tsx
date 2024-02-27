import { useSignal, $, useOnDocument } from "@builder.io/qwik";

const useTheme$ = () => {
    const isDarkMode = useSignal<boolean | null>(null);

    const handleDarkMode$ = $(() => {
        if (isDarkMode.value || (isDarkMode.value === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    });

    const toggleDarkMode = $(() => {
        isDarkMode.value = isDarkMode.value === null ? false : !isDarkMode.value;
        handleDarkMode$();
    });

    useOnDocument("DOMContentLoaded", $(() => handleDarkMode$()))

    return ({
        toggleDarkMode,
        isDarkMode
    })
}

export default useTheme$;
