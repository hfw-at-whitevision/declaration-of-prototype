import {docbaseTokenAtom} from "@/store/generalAtoms";
import {useAtom} from "jotai";
import {accessTokenAtom, emailAtom} from "@/store/authAtoms";

const getDocbasePdfFunction = async ({docbaseId, emailAddress, docbaseToken}) => {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        var urlencoded = new URLSearchParams();
        urlencoded.append("username", emailAddress);
        urlencoded.append("password", "123hjkqwecvb");
        urlencoded.append("version", "wvsa-hybrid-0.10");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        const apiRequestUrl = `https://devweb.docbaseweb.nl/MobileApi/GetMobileImage.aspx?token=${docbaseToken}&docid=${docbaseId}&page=-1`;

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
    }
    catch (error) {
        console.error('Error getting pdf from Docbase:', error);
        throw error;
    }
}

const useDocbase = () => {
    const [docbaseToken, setDocbaseToken] = useAtom(docbaseTokenAtom);
    const [azureToken] = useAtom(accessTokenAtom);
    const [emailAddress] = useAtom(emailAtom);

    const docbaseAuth = async ({ emailAddress: inputEmailAddress, azureToken: inputAzureToken, data}) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("username", inputEmailAddress ?? emailAddress);
        urlencoded.append("password", "123hjkqwecvb");
        urlencoded.append("version", "wvsa-hybrid-0.10");
        urlencoded.append("option", inputAzureToken ?? azureToken);
        urlencoded.append("data", data);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("https://devweb.docbaseweb.nl/MobileApi/MobileApi.asmx/Authenticate", requestOptions)
            .then(response => response.text())
            .then(result => {
                // get the token from the response, that looks like:
                // <?xml version="1.0" encoding="utf-8"?>
                // <string xmlns="http://mobileapi.whitevision.nl/">2af04ccd-31e2-4d8d-bea1-f0130fca94bc</string>

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(result, "text/xml");
                const docbaseToken = xmlDoc.getElementsByTagName("string")[0].childNodes[0].nodeValue;

                console.log('docbaseAuth result (docbaseToken): ', docbaseToken);
                setDocbaseToken(docbaseToken);
            })
            .catch(error => console.log('error', error));
    }

    return {
        docbaseAuth,
        getDocbasePdf: async (docbaseId) => getDocbasePdfFunction({
            docbaseId,
            emailAddress,
            docbaseToken,
        }),
    }
}
export default useDocbase;
