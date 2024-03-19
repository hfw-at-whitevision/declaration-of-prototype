import {createDeclaration, getDeclaration} from "@/firebase";
import {useQuery} from "@tanstack/react-query";
import {useAtom} from "jotai";
import {docbaseTokenAtom} from "@/store/generalAtoms";
import {removeBase64DataHeader} from "@/utils";

export const useFetchDeclaration = ({declarationId}) => {
    return useQuery({
        queryKey: ["declaration", declarationId],
        queryFn: () => getDeclaration(declarationId),
    });
}

const postDeclarationFunction = async ({
    declaration,
    expenses,
    docbaseToken,
                                       }) => {
    // parse the declaration object to the docbase format
    const docbaseExpenses = [];
    for (const expense of expenses) {
        const attachmentUrl = expense?.attachments[0] ?? null;
        let attachmentFileName = '';

        // convert the attachment to base64
        const attachmentBase64File = await fetch(attachmentUrl)
            .then((response) => response.blob())
            .then((blob) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                // get the filetype from the blob
                const fileType = blob.type;
                attachmentFileName = `expense-${expense?.title}.${fileType}`;
                reader.readAsDataURL(blob);
            }));
        // determine the filetype from
        const fileType = attachmentUrl.split('.').pop();

        const docbaseExpense = {
            Title: expense?.title,
            Description: expense?.description,
            Date: new Date(expense?.date).toISOString(),
            TotalAmount: expense?.totalAmount,
            Category: expense?.category,
            AttachmentBase64File: removeBase64DataHeader(attachmentBase64File),
            AttachmentFileName: attachmentFileName,
        }
        docbaseExpenses.push(docbaseExpense);
    }
    const docbaseDeclaration = {
        Type: "declaration",
        Status: declaration?.status,
        Title: declaration?.title,
        Description: declaration?.description,
        Date: new Date(declaration?.date).toISOString(),
        TotalAmount: declaration?.totalAmount,
        Expenses: docbaseExpenses,
    }
    console.log('Posting declaration to Docbase: ', docbaseDeclaration);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("data", JSON.stringify(docbaseDeclaration));
    urlencoded.append("token", docbaseToken);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    const res = await fetch("https://devweb.docbaseweb.nl/MobileApi/MobileApi.asmx/PostDeclaration", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log('PostDeclaration response: ', result);
            return result;
        })
        .catch(error => console.log('error', error));

    // parse the docbaseId from the XML response. Example:
    // <?xml version="1.0" encoding="utf-8"?>
    // <int xmlns="http://mobileapi.whitevision.nl/">16390</int>

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(res, "text/xml");
    const docbaseId = xmlDoc.getElementsByTagName("int")[0].childNodes[0].nodeValue;

    console.log('Declaration posted to Docbase. DocbaseId: ', docbaseId);

    // post to firebase first
    const firebaseDeclaration = {
        ...declaration,
        docbaseId,
    }
    const declarationId = await createDeclaration(firebaseDeclaration);

    return {
        declarationId,
        docbaseId,
    };
}

export const useDeclaration = () => {
    const [docbaseToken] = useAtom(docbaseTokenAtom);
    return {
        postDeclaration: async ({
            declaration,
            expenses,
        }) => await postDeclarationFunction({
            declaration,
            expenses,
            docbaseToken,
        }),
    }
}
