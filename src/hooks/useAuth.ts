import {OAuth2AuthenticateOptions, OAuth2Client} from '@byteowls/capacitor-oauth2';
import {atom, useAtom} from 'jotai';
import {useQueryClient} from '@tanstack/react-query';
import {SecureStoragePlugin} from 'capacitor-secure-storage-plugin';
import {jwtDecode} from 'jwt-decode';
import useCapacitor from '@/hooks/useCapacitor';
import {useRouter} from "next/router";
import {Dialog} from "@capacitor/dialog";
import {
    AndroidBiometryStrength,
    BiometricAuth,
    BiometryError,
    BiometryErrorType
} from "@aparajita/capacitor-biometric-auth";
import {useEffect, useState} from "react";

const azureAdConfig: OAuth2AuthenticateOptions = {
    appId: 'a468fdc4-dd90-4300-a896-42add09bd2e3',
    authorizationBaseUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    scope: 'https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read',
    accessTokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    responseType: 'code',
    pkceEnabled: true,
    logsEnabled: true,
    web: {
        redirectUrl: 'http://localhost:3000/login',
        windowOptions: 'width=400,height=640,left=0,top=0',
    },
    android: {
        redirectUrl: 'msauth://hubl.whitevision.app/w5G662mc4o81BUzLaFO2xjZlnHw%3D',
    },
    ios: {
        pkceEnabled: true,
        redirectUrl: 'msauth.{package-name}://auth',
    },
};

interface Response {
    [key: string]: any;
}

let appListener: any;

const useAuth = () => {
    const router = useRouter();
    const [accessToken, setAccessToken]: any = useAtom(accessTokenAtom);
    const [email, setEmail]: any = useAtom(emailAtom);
    const isAuthenticated = !!accessToken && !!email;
    const client = useQueryClient();
    const {isNative} = useCapacitor();

    const [refreshToken, setRefreshToken] = useState();
    const refreshTokenAvailable = !!refreshToken;
    const [isBiometryAvailable, setIsBiometryAvailable] = useAtom(isBiometryAvailableAtom);
    const [shouldLoginWithBiometry, setShouldLoginWithBiometry] = useAtom(shouldLoginWithBiometryAtom);
    const shouldAskForBiometryActivation = isBiometryAvailable && !shouldLoginWithBiometry;

    useEffect(() => {
        SecureStoragePlugin.get({key: 'refreshToken'}).then((res: any) => {
            console.log('refreshToken value in localStorage: ', res);
            if (res?.value)
                setRefreshToken(res?.value);
            else
                setRefreshToken(undefined);
        });
        SecureStoragePlugin.get({key: "loginWithBiometry"}).then((res: any) => {
            console.log('loginWithBiometry value in localStorage: ', res);
            if (res?.value === 'true')
                setShouldLoginWithBiometry(true);
            else
                setShouldLoginWithBiometry(false);
        });
    }, []);

    const responseHandler = async (response: Response | null) => {
        console.log('responseHandler', response);
        if (!response) return;
        const accessToken = response.access_token;
        const refreshToken = response.access_token_response.refresh_token;
        const decodedToken: any = jwtDecode(accessToken);

        if (shouldAskForBiometryActivation) {
            await setBiometryAuth();
        }

        setEmail(decodedToken.unique_name as string);
        setAccessToken(accessToken);

        console.log('storing the accessToken in localStorage', accessToken);
        const res1 = SecureStoragePlugin.set({
            key: 'accessToken',
            value: accessToken,
        });
        console.log('storing the refreshToken in localStorage', refreshToken);
        const res2 = SecureStoragePlugin.set({
            key: 'refreshToken',
            value: refreshToken,
        });
        await Promise.all([res1, res2]);
    };

    const setBiometryAuth = async () => {
        console.log('setBiometryAuth');
        const {value} = await Dialog.confirm({
            title: 'Biometrie activeren',
            message: 'Wil je voortaan inloggen met biometrie?',
        });
        if (value) {
            await SecureStoragePlugin.set({key: 'loginWithBiometry', value: 'true'});
        }
    }

    const loginWithMicrosoft = async () => {
        try {
            if (refreshTokenAvailable && isNative) {
                console.log('refreshTokenAvailable, trying to login with refreshToken');
                OAuth2Client.refreshToken({
                    appId: azureAdConfig.appId as string,
                    accessTokenEndpoint: azureAdConfig.accessTokenEndpoint as string,
                    refreshToken: refreshToken as string,
                    scope: azureAdConfig.scope,
                })
                    .then(async (response) => {
                        console.log('refreshToken response', response);
                        await responseHandler(response);
                    });
            } else {
                console.log('refreshToken not available');
                OAuth2Client.authenticate(azureAdConfig)
                    .then(async (response) => {
                        console.log('authenticate response', response);
                        await responseHandler(response);
                    });
            }
        }
        catch (e) {
            console.error('Error while logging in', e);
        }
    };

    const loginWithBiometry = async () => {
        console.log('Logging in with biometry');
        try {
            await BiometricAuth.authenticate({
                reason: 'Please authenticate',
                cancelTitle: 'Cancel',
                allowDeviceCredential: true,
                iosFallbackTitle: 'Use passcode',
                androidTitle: 'Biometric login',
                androidSubtitle: 'Log in using biometric authentication',
                androidConfirmationRequired: false,
                androidBiometryStrength: AndroidBiometryStrength.weak,
            });
            await loginWithMicrosoft();
        } catch (error) {
            console.log('Biometry error', error);

            // error is always an instance of BiometryError.
            if (error instanceof BiometryError) {
                if (error.code !== BiometryErrorType.userCancel) {
                    // Display the error.
                    await Dialog.alert({
                        title: 'Biometry error',
                        message: error.message,
                    });
                }
            }
        }
    }

    const logout = async () => {
        await OAuth2Client.logout(azureAdConfig);
        await SecureStoragePlugin.remove({key: 'accessToken'});
        setAccessToken(undefined);
        // clearAccessToken('User has logged out');
        client.removeQueries();
        await router.push('/');
    };

    const updateBiometryInfo = (info: any): void => {
        if (info.isAvailable) {
            setIsBiometryAvailable(true);
        } else {
            setIsBiometryAvailable(false);
        }
    }
    const biometryOnMount = async () => {
        updateBiometryInfo(await BiometricAuth.checkBiometry());

        try {
            appListener = await BiometricAuth.addResumeListener(updateBiometryInfo)
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
            }
        }
    }
    const biometryUnMount = async () => {
        await appListener?.remove();
    }
    useEffect(() => {
        biometryOnMount();
        return () => {
            biometryUnMount();
        }
    }, []);

    return {
        loginWithMicrosoft,
        logout,
        isAuthenticated,
        accessToken,
        username: email,
        shouldLoginWithBiometry,
        loginWithBiometry,
    };
};
export default useAuth;

const shouldLoginWithBiometryAtom = atom(false);
export const accessTokenAtom = atom<string | undefined>(undefined);
export const emailAtom = atom<string | undefined>(undefined);
export const isBiometryAvailableAtom = atom(false);
