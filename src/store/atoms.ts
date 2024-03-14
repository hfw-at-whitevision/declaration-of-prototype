import {atom} from "jotai";
import {atomWithStorage} from "jotai/utils";

export const currentTabIndexAtom = atom<any>(0);
export const searchQueryAtom = atom<any>('');
export const declarationsAtom: any = atomWithStorage('declarations', []);

export const showOverlayAtom = atom<any>(false);
export const showNewDeclarationOverlayAtom = atom<any>(false);
export const showConfirmationOverlayAtom = atom<any>(false);
export const confirmationOverlayTitleAtom = atom<any>('');
export const trulyShowConfirmationOverlayAtom = atom<any>(false);

export const notificationsAtom = atom<any>([]);
export const showNotificationsScreenAtom = atom<any>(false);

export const scannedImagesAtom = atom<any>([]);

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
    (get: any, set: any, props: any) => {
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

export const IsSelectingItemsAtom = atom<any>(false);
export const selectedItemIdsAtom = atom<any>([]);

// UI
export const primaryColorAtom = atom<any>('bg-amber-400');

export const environmentCodeAtom = atom<string>("");
