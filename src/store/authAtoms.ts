import {atom} from "jotai";
import {atomWithStorage} from "jotai/utils";

export const shouldLoginWithBiometryAtom = atomWithStorage("shouldLoginWithBiometry", false);
export const accessTokenAtom = atom<string | undefined>(undefined);
export const emailAtom = atom<string | undefined>(undefined);
export const isBiometryAvailableAtom = atom(false);
