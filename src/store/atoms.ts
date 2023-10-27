import {atom} from "jotai";
import {atomWithStorage} from "jotai/utils";

export const currentTabIndexAtom = atom(0);
export const searchQueryAtom = atom('');
export const declarationsAtom = atomWithStorage('declarations', []);

export const showOverlayAtom = atom(false);
export const showNewDeclarationOverlayAtom = atom(false);
export const showConfirmationOverlayAtom = atom(false);
export const confirmationOverlayTitleAtom = atom('');
export const trulyShowConfirmationOverlayAtom = atom(false);

export const notificationsAtom = atom([]);
export const showNotificationsScreenAtom = atom(false);

export const scannedImagesAtom = atom([]);

export const inputModalAtom = atom(
    {
        show: false,
        title: '',
        value: '',
        defaultValue: '',
        options: [],
        type: '',
        onConfirm: () => {},
    },
    (get, set, props: any) => {
        set(inputModalAtom, {
            show: props?.show,
            title: props?.title,
            value: props?.value,
            type: props?.type,
            options: props?.options,
            defaultValue: props?.defaultValue,
            onConfirm: props?.onConfirm,
        });
    });
