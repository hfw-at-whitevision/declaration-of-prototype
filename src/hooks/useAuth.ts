import {atom, useAtom} from 'jotai';
import {useQueryClient} from '@tanstack/react-query';
import {SecureStoragePlugin} from 'capacitor-secure-storage-plugin';
import {jwtDecode} from 'jwt-decode';
import useCapacitor from '@/hooks/useCapacitor';
import {useRouter} from "next/router";
import {PublicClientApplication} from '@azure/msal-browser';
import {
    AndroidBiometryStrength,
    BiometricAuth,
    BiometryError,
    BiometryErrorType
} from "@aparajita/capacitor-biometric-auth";
import {useEffect, useState} from "react";
import useDocbase from "@/hooks/useDocbase";
import {
    accessTokenAtom, docbaseTokenAtom,
    emailAtom, environmentCodeAtom,
    isBiometryAvailableAtom,
    shouldLoginWithBiometryAtom,
    userAtom
} from "@/store/authAtoms";
import {msalInstance} from "../../pages/_app";

const azureAdConfig = {
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

const scopes = ['User.Read', 'openid', 'profile', 'offline_access'];

interface Response {
    [key: string]: any;
}

interface ResponseInterface {
    response?: Response;
    environmentCode?: string;
}

let appListener: any;

const useAuth = () => {
    const router = useRouter();
    const [accessToken, setAccessToken]: any = useAtom(accessTokenAtom);
    const [docbaseToken, setDocbaseToken] = useAtom(docbaseTokenAtom);
    const [email, setEmail]: any = useAtom(emailAtom);
    const [user, setUser] = useAtom(userAtom);
    const [environmentCode, setEnvironmentCode] = useAtom(environmentCodeAtom);

    const isAuthenticated = !!accessToken && !!email && !!docbaseToken;

    const client = useQueryClient();
    const {isNative} = useCapacitor();

    const [refreshToken, setRefreshToken] = useState();
    const refreshTokenAvailable = !!refreshToken;
    const [isBiometryAvailable, setIsBiometryAvailable] = useAtom(isBiometryAvailableAtom);
    const [shouldLoginWithBiometry, setShouldLoginWithBiometry] = useAtom(shouldLoginWithBiometryAtom);
    const shouldAskForBiometryActivation = isBiometryAvailable && !shouldLoginWithBiometry;
    const {docbaseAuthenticate} = useDocbase();

    // useEffect(() => {
    //     if (!router.isReady) return;
    //     SecureStoragePlugin.get({key: 'accessToken'}).then((accessTokenRes: any) => {
    //         SecureStoragePlugin.get({key: 'environmentCode'}).then((environmentCodeRes: any) => {
    //             SecureStoragePlugin.get({key: 'homeAccountId'}).then((homeAccountIdRes: any) => {
    //                 console.log('accessToken value in localStorage: ', accessTokenRes);
    //                 console.log('environmentCode value in localStorage: ', environmentCodeRes);
    //                 console.log('homeAccountId value in localStorage: ', homeAccountIdRes);
    //                 if (!!accessTokenRes?.value && !!environmentCodeRes?.value && !!homeAccountIdRes?.value) {
    //                     console.log('accessToken available in localStorage, trying to acquire token silently');
    //                     const storedAccessToken = accessTokenRes?.value;
    //                     const storedEnvironmentCode = environmentCodeRes?.value;
    //                     return msalInstance.acquireTokenSilent({scopes}).then(async (res: any) => {
    //                         return await responseHandler({response: res, environmentCode: storedEnvironmentCode});
    //                     });
    //                 } else {
    //                     console.log('accessToken or environmentCode not available in localStorage, clearing the accessToken atom');
    //                     setAccessToken(undefined);
    //                 }
    //             });
    //         });
    //     });
    //     // SecureStoragePlugin.get({key: "loginWithBiometry"}).then((res: any) => {
    //     //     console.log('loginWithBiometry value in localStorage: ', res);
    //     //     if (res?.value === 'true')
    //     //         setShouldLoginWithBiometry(true);
    //     //     else
    //     //         setShouldLoginWithBiometry(false);
    //     // });
    // }, [router.isReady]);

    const parseUserDetails = async (jwt: string) => {
        if (!jwt) return;
        const decodedToken: any = jwtDecode(jwt);
        setEmail(decodedToken.unique_name as string);
        const user = {
            userName: decodedToken.upn,
            emailAddress: decodedToken.unique_name,
            fullName: decodedToken.name,
            firstName: decodedToken.given_name,
            lastName: decodedToken.family_name,
        }
        setUser(user);
    }

    useEffect(() => {
        if (accessToken) {
            parseUserDetails(accessToken);
        }
    }, [accessToken]);

    const responseHandler = async ({response, environmentCode}: ResponseInterface = {}) => {
        console.log('responseHandler', response);
        if (!response) return;

        let homeAccountId = response.account.homeAccountId; // alternatively: resp.account.homeAccountId or resp.account.username
        const currentAccounts = msalInstance.getAllAccounts();
        if (currentAccounts.length < 1) { // No cached accounts
            return;
        } else if (currentAccounts.length > 1) { // Multiple account scenario
            // Add account selection code here
            homeAccountId = currentAccounts[0].homeAccountId;
        } else if (currentAccounts.length === 1) {
            homeAccountId = currentAccounts[0].homeAccountId; // Single account scenario
        }

        console.log('homeAccountId', homeAccountId);
        await SecureStoragePlugin.set({key: 'homeAccountId', value: homeAccountId});

        const accessToken = response.accessToken;
        const decodedToken: any = jwtDecode(accessToken);

        // if (shouldAskForBiometryActivation) {
        //     await setBiometryAuth();
        // }

        // authenticate against docbase
        const res = await docbaseAuthenticate({
            azureToken: accessToken,
            emailAddress: decodedToken.unique_name,
            environmentCode,
            data: null,
        });

        setEmail(decodedToken.unique_name as string);

        console.log('storing the accessToken and environmentCode in secureStorage', accessToken, environmentCode);
        const res1 = SecureStoragePlugin.set({
            key: 'accessToken',
            value: accessToken,
        });
        const res2 = SecureStoragePlugin.set({
            key: 'environmentCode',
            value: environmentCode,
        });
        setAccessToken(accessToken);
        setEnvironmentCode(environmentCode);
        await Promise.all([res1, res2]);
        // await router.push('/');
        return res;
    };

    const setBiometryAuth = async () => {
        // console.log('setBiometryAuth');
        // const {value} = await Dialog.confirm({
        //     title: 'Biometrie activeren',
        //     message: 'Wil je voortaan inloggen met biometrie?',
        // });
        // if (value) {
        //     await SecureStoragePlugin.set({key: 'loginWithBiometry', value: 'true'});
        // }
    }

    const loginWithMicrosoft = async ({environmentCode: inputEnvironmentCode = environmentCode} = {}) => {
        const account = msalInstance.getAllAccounts()[0];
        console.log('loginWithMicrosoft', account, inputEnvironmentCode);
        try {
            if (account && accessToken && environmentCode) {
                console.log('accessToken available, trying to acquire token silently');
                const res = await msalInstance.acquireTokenSilent({scopes});
                console.log('acquireTokenSilent response', res);
                await responseHandler({response: res, environmentCode: inputEnvironmentCode});
                return res;
            } else {
                console.log('accessToken not available, trying to login with popup');
                const res = await msalInstance.loginPopup({scopes})
                    .then(async (res2: any) => {
                        console.log('loginPopup response', res2);
                        msalInstance.setActiveAccount(res2.account);
                        return await responseHandler({response: res2, environmentCode: inputEnvironmentCode});
                    })
                    .catch((error: any) => {
                        console.error('Error while logging in', error);
                    });
                // await responseHandler({response: res, environmentCode: inputEnvironmentCode});
                return res;
            }
        } catch (e) {
            console.error('Error while logging in', e);
        }
    };

    const loginWithBiometry = async () => {
        // console.log('Logging in with biometry');
        // try {
        //     await BiometricAuth.authenticate({
        //         reason: 'Please authenticate',
        //         cancelTitle: 'Cancel',
        //         allowDeviceCredential: true,
        //         iosFallbackTitle: 'Use passcode',
        //         androidTitle: 'Biometric login',
        //         androidSubtitle: 'Log in using biometric authentication',
        //         androidConfirmationRequired: false,
        //         androidBiometryStrength: AndroidBiometryStrength.weak,
        //     });
        //     await loginWithMicrosoft();
        // } catch (error) {
        //     console.log('Biometry error', error);
        //
        //     // error is always an instance of BiometryError.
        //     if (error instanceof BiometryError) {
        //         if (error.code !== BiometryErrorType.userCancel) {
        //             // Display the error.
        //             await Dialog.alert({
        //                 title: 'Biometry error',
        //                 message: error.message,
        //             });
        //         }
        //     }
        // }
    }

    const logout = async () => {
        await router.push('http://localhost:3000');
        const currentAccount = msalInstance.getActiveAccount();
        await msalInstance.logoutRedirect({
            account: currentAccount,
            onRedirectNavigate: () => {
                return false;
            },
        });
        await SecureStoragePlugin.remove({key: 'accessToken'});
        setAccessToken(undefined);
        setEmail(undefined);
        setDocbaseToken(undefined);
        setUser(undefined);
        client.removeQueries();
    };

    // const updateBiometryInfo = (info: any): void => {
    //     if (info.isAvailable) {
    //         setIsBiometryAvailable(true);
    //     } else {
    //         setIsBiometryAvailable(false);
    //     }
    // }
    // const biometryOnMount = async () => {
    //     updateBiometryInfo(await BiometricAuth.checkBiometry());
    //
    //     try {
    //         appListener = await BiometricAuth.addResumeListener(updateBiometryInfo)
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             console.error(error.message)
    //         }
    //     }
    // }
    // const biometryUnMount = async () => {
    //     await appListener?.remove();
    // }
    // useEffect(() => {
    //     biometryOnMount();
    //     return () => {
    //         biometryUnMount();
    //     }
    // }, []);

    return {
        loginWithMicrosoft,
        logout,
        isAuthenticated,
        accessToken,
        username: email,
        shouldLoginWithBiometry,
        loginWithBiometry,
        user,
    };
};
export default useAuth;
