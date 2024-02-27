import { useContextProvider, createContextId, useStore, $ } from "@builder.io/qwik";

type TypeComponent = any | null;

type ModalContextProperties = {
    show: boolean;
    component: TypeComponent;
};

export const ModalContext = createContextId<ModalContextProperties>("modal-context");

export const useModalContext = () => {
    const modalProperties = useStore<ModalContextProperties>({
        show: false,
        component: null
    });

    useContextProvider(ModalContext, modalProperties);

    return modalProperties;
}
