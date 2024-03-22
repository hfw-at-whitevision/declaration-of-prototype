import {atom} from "jotai";
import {atomWithStorage} from "jotai/utils";

export const shouldLoginWithBiometryAtom = atomWithStorage("shouldLoginWithBiometry", false);
export const accessTokenAtom = atomWithStorage<string | undefined>("azureToken", undefined);
export const emailAtom = atom<string | undefined>(undefined);
export const isBiometryAvailableAtom = atom(false);
export const userAtom: any = atom<any>(undefined);
export const environmentCodeAtom = atomWithStorage<string>("environmentCode", "");
export const docbaseTokenAtom = atomWithStorage<string>("docbaseToken", undefined);
