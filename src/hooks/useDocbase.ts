import {useAtom} from "jotai";
import {accessTokenAtom, emailAtom, environmentCodeAtom, docbaseTokenAtom} from "@/store/authAtoms";

const {convertXML} = require("simple-xml-to-json")

const useDocbaseGetPdf = ({baseApiUrl}) => {
    const [docbaseToken] = useAtom(docbaseTokenAtom);
    const [emailAddress] = useAtom(emailAtom);

    const getDocbasePdf = async ({docbaseId, baseApiUrl: inputBaseApiUrl = baseApiUrl}) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            var urlencoded = new URLSearchParams();
            urlencoded.append("username", emailAddress);
            urlencoded.append("password", "123hjkqwecvb");
            urlencoded.append("version", "wvsa-hybrid-0.10");

            var requestOptions: any = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            const apiRequestUrl = `${inputBaseApiUrl}/MobileApi/GetMobileImage.aspx?token=${docbaseToken}&docid=${docbaseId}&page=-1`;

            return await fetch(apiRequestUrl, requestOptions)
                .then(response => response.arrayBuffer())
                .then(result => {
                    let base64 = Buffer.from(result).toString('base64');
                    // if no dataHeader is present, add it
                    if (!base64.startsWith('data:application/pdf;base64,')) {
                        base64 = `data:application/pdf;base64,${base64}`;
                    }
                    console.log('getDocbasePdf result (base64): ', base64);
                    return base64;
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.error('Error getting pdf from Docbase:', error);
            throw error;
        }
    }
    return {
        getDocbasePdf,
    }
}

const useDocbaseAuthenticate = () => {
    const [, setDocbaseToken] = useAtom(docbaseTokenAtom);
    const [environmentCode, setEnvironmentCode] = useAtom(environmentCodeAtom);
    const [azureToken] = useAtom(accessTokenAtom);
    const [emailAddress] = useAtom(emailAtom);

    const docbaseAuthenticate = async ({
                                           azureToken: inputAzureToken = undefined,
                                           username: inputUsername = undefined,
                                           environmentCode: inputEnvironmentCode = environmentCode,
                                           data
                                       }: any = {}) => {
        console.log('docbaseAuthenticate: inputAzureToken, inputUsername, data', inputAzureToken, inputUsername, data);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        var urlencoded = new URLSearchParams();
        urlencoded.append("username", inputUsername ?? emailAddress);
        urlencoded.append("password", "123hjkqwecvb");
        urlencoded.append("version", "wvsa-hybrid-0.10");
        urlencoded.append("option", inputAzureToken ?? azureToken);
        urlencoded.append("data", data);

        var requestOptions: any = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        const baseApiUrl = getBaseApiUrl(inputEnvironmentCode ?? environmentCode);
        return await fetch(baseApiUrl + "/MobileApi/MobileApi.asmx/Authenticate", requestOptions)
            .then(response => response.text())
            .then(result => {
                // get the token from the response, that looks like:
                // <?xml version="1.0" encoding="utf-8"?>
                // <string xmlns="http://mobileapi.whitevision.nl/">2af04ccd-31e2-4d8d-bea1-f0130fca94bc</string>

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(result, "text/xml");
                const docbaseToken = xmlDoc.getElementsByTagName("string")[0].childNodes[0].nodeValue ?? undefined;
                console.log('docbaseAuth result (docbaseToken): ', docbaseToken);
                setDocbaseToken(docbaseToken);
                setEnvironmentCode(inputEnvironmentCode);
                return docbaseToken;
            })
            .catch(error => console.log('docbaseAuthenticate error', error));
    }

    return {
        docbaseAuthenticate,
    }
}
const useDocbasePost = () => {
    const [docbaseToken, setDocbaseToken] = useAtom(docbaseTokenAtom);
    const [environmentCode, setEnvironmentCode] = useAtom(environmentCodeAtom);
    const [azureToken] = useAtom(accessTokenAtom);
    const [emailAddress] = useAtom(emailAtom);

    const docbasePost = async ({
                                   jsonResponse = false,
                                   endpoint,
                                   azureToken: inputAzureToken = undefined,
                                   username: inputUsername = undefined,
                                   environmentCode: inputEnvironmentCode = environmentCode,
                                   data
                               }: any = {}) => {
        console.log('docbasePost: inputAzureToken, inputUsername, data', inputAzureToken, inputUsername, data);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        const urlencoded = new URLSearchParams();
        urlencoded.append("username", inputUsername ?? emailAddress);
        urlencoded.append("password", "123hjkqwecvb");
        urlencoded.append("version", "wvsa-hybrid-0.10");
        urlencoded.append("token", docbaseToken);
        urlencoded.append("data", data);

        const requestOptions: any = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        const baseApiUrl = getBaseApiUrl(inputEnvironmentCode ?? environmentCode);
        const res = await fetch(baseApiUrl + "/MobileApi/MobileApi.asmx/" + endpoint, requestOptions)
        if (!res.ok) {
            const message = `Error in docbasePost for endpoint ${endpoint}: ${res.statusText}`;
            console.error(message);
            throw new Error(message);
        }
        const response = await res.text();
        if (jsonResponse) {
            return convertXML(response);
        }
        return response;
    }

    return {
        docbasePost,
    }
}

const useDocbaseMetadata = () => {
    const {docbasePost} = useDocbasePost();
    const getDeclarationMetadata = async () => {
        const res = await docbasePost({
            endpoint: 'GetDeclarationMetadata',
            jsonResponse: true,
        });
        const response = res?.DeclarationMetadata?.children;
        const parsedResponse = {
            categories: response?.[0]?.Categories?.children,
            additionalFields: response?.[1]?.AdditionalFields?.children,
            documentList: response?.[2]?.DocumentList?.children,
        }
        console.log('getDeclarationMetadata result', parsedResponse);
        return parsedResponse;
    }
    return {
        getDeclarationMetadata,
    }
}

const useDocbase = () => {
    const [environmentCode] = useAtom(environmentCodeAtom);
    const baseApiUrl = getBaseApiUrl(environmentCode);
    const {docbaseAuthenticate}: any = useDocbaseAuthenticate();
    const {getDocbasePdf} = useDocbaseGetPdf({baseApiUrl});
    const {getDeclarationMetadata} = useDocbaseMetadata();

    const switchEnvironment = async (environmentCode) => {
        if (!environmentCode) return;
        console.log(`switchEnvironment: switch to '${environmentCode}' initiated`);
        return await docbaseAuthenticate({
            environmentCode,
        });
    }

    return {
        getDeclarationMetadata,
        switchEnvironment,
        docbaseAuthenticate,
        getDocbasePdf,
    }
}
export default useDocbase;

const getBaseApiUrl = (environmentCode: string) => {
    switch (environmentCode) {
        case 'dev':
            return `https://devweb.docbaseweb.nl`;
            break;
        case 'test':
            return `https://testweb.docbaseweb.nl`;
            break;
        case 'acc':
            return `https://accweb.docbaseweb.nl`;
            break;
        default:
            return `https://${environmentCode}.workflowindecloud.nl`;
            break;
    }
}
