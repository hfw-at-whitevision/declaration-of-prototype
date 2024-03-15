import { OAuth2AuthenticateOptions, OAuth2Client } from '@byteowls/capacitor-oauth2';
import { atom, useAtom } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { jwtDecode } from 'jwt-decode';
import useCapacitor from '@/hooks/useCapacitor';
import {useRouter} from "next/router";

export const accessTokenAtom = atom<string | undefined>(undefined);
export const emailAtom = atom<string | undefined>(undefined);

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

const useAuth = () => {
    const router = useRouter();
    const [accessToken, setAccessToken]: any = useAtom(accessTokenAtom);
    const [email, setEmail]: any = useAtom(emailAtom);
    const isAuthenticated = !!accessToken && !!email;
    const client = useQueryClient();
    const { isNative } = useCapacitor();

    const responseHandler = async (response: Response | null) => {
        if (!response) return;
        const accessToken = response.access_token;
        const refreshToken = response.access_token_response.refresh_token;
        const decodedToken: any = jwtDecode(accessToken);

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

    const login = () => {
        SecureStoragePlugin.get({ key: 'refreshToken' })
            .then((res) => {
                console.log('refreshToken found', res?.value);

                const storedRefreshToken = res?.value;
                // set error om authenticatie flow zonder refresh Token to doorlopen
                if (!storedRefreshToken || !isNative) throw new Error();

                OAuth2Client.refreshToken({
                    appId: azureAdConfig.appId as string,
                    accessTokenEndpoint: azureAdConfig.accessTokenEndpoint as string,
                    refreshToken: storedRefreshToken,
                    scope: azureAdConfig.scope,
                })
                    .then(async (response) => {
                        console.log('refreshToken response', response);
                        await responseHandler(response);
                    });
            })
            .catch(() => {
                OAuth2Client.authenticate(azureAdConfig)
                    .then(async (response) => {
                        console.log('authenticate response', response);
                        await responseHandler(response);
                    });
            });
    };

    const logout = async () => {
        await OAuth2Client.logout(azureAdConfig);
        await SecureStoragePlugin.remove({ key: 'accessToken' });
        setAccessToken(undefined);
        // clearAccessToken('User has logged out');
        client.removeQueries();
        await router.push('/');
    };

    return {
        login,
        logout,
        isAuthenticated,
        accessToken,
        username: email,
    };
};
export default useAuth;
