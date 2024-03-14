// import { jwtDecode } from 'jwt-decode';
// import { InteractionRequiredAuthError } from '@azure/msal-browser';
// import { loginRequest } from './authConfig';
//
// let isRefreshingToken = false;
//
// export const decodeToken = (accessToken: string) => {
//     return jwtDecode(accessToken);
// };
//
// export const storeApiBaseUrl = (token: string) => {
//     const decodedToken = decodeToken(token);
//
//     if (!decodedToken?.enrichurl) return;
//
//     localStorage.setItem('ApiBaseUrl', decodedToken?.enrichurl);
// };
//
// export const storeAccessToken = (logReason: string, token: string): void => {
//     local.setItem(StorageKeys.AccessToken, token);
//     storeApiBaseUrl(token);
// };
//
// export const refreshAccessToken = async (): Promise<string | null> => {
//     isRefreshingToken = true;
//     const activeAccount = msalInstance.getActiveAccount();
//     const accounts = msalInstance.getAllAccounts();
//     const currentAccount = activeAccount || accounts[0];
//
//     if (!activeAccount && accounts.length === 0) {
//         return null;
//         /*
//         * User is not signed in. Throw error or wait for user to login.
//         * Do not attempt to log a user in outside of the context of MsalProvider
//         */
//     }
//
//     const request = {
//         ...loginRequest,
//         account: currentAccount,
//     };
//
//     await msalInstance.initialize();
//
//     const azureToken = await msalInstance.acquireTokenSilent(request).then((response) => {
//         return response.accessToken;
//     }).catch((error) => {
//         if (error instanceof InteractionRequiredAuthError) {
//             msalInstance.acquireTokenPopup(request).then((response) => {
//                 return response.accessToken;
//             });
//         }
//         return null;
//     });
//
//     const result = await executePostRequest<Authenticate>(createAuthenticateApiPath(), {
//         azureToken,
//         emailAddress: currentAccount.username,
//         tenantId: local.getItem(StorageKeys.TenantId),
//         clientVersion: buildVersion,
//     });
//     const newWVToken = result.data.token;
//     storeAccessToken('Token refreshed', newWVToken);
//     isRefreshingToken = false;
//     return newWVToken;
// };
//
// export const getAccessToken = async (): Promise<null | string> => {
//     let wvToken = local.getItem(StorageKeys.AccessToken);
//
//     if (!wvToken) {
//         return null;
//     }
//
//     try {
//         const decodedToken = decodeToken(wvToken);
//         if ((Date.now() + secondsToMillis(30)) >= decodedToken.exp * 1000) {
//             // Make sure we refresh the token only once.
//             if (!isRefreshingToken) {
//                 wvToken = await refreshAccessToken();
//                 if (!wvToken) {
//                     window.location.href = PagePath.login;
//                     return null;
//                 }
//                 local.setItem(StorageKeys.AccessToken, wvToken);
//                 return wvToken;
//             }
//             return await new Promise((resolve) => {
//                 setTimeout(async () => {
//                     resolve(await getAccessToken());
//                 }, 1500);
//             });
//         }
//         return wvToken;
//     } catch (err) {
//         console.warn('Couldn\'t decode token');
//         return null;
//     }
// };
//
// export const clearAccessToken = (logReason: string): void => {
//     log({
//         context: LogContext.User,
//         title: 'Cleared access token',
//         reason: logReason,
//     });
//
//     local.removeItem(StorageKeys.AccessToken);
// };
//
// export const login = async (email: string, password: string): Promise<Authenticate> => {
//     const result = await executeGetRequest<Authenticate>(createLoginApiPath(email, password));
//
//     return result.data;
// };
