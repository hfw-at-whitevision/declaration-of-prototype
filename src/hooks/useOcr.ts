import {useAtom} from "jotai";
import {environmentCodeAtom} from "@/store/authAtoms";

type runOcrParams = {
    imageBase64: string;
}

const useOcr = () => {
    const [environmentCode] = useAtom(environmentCodeAtom);
    const runOcr = async ({
                              imageBase64,
                          }: runOcrParams) => {
        const request = {
            ImageBase64: imageBase64,
            TenantId: environmentCode,
        };
        const ocrApiUrl = process.env.NEXT_PUBLIC_OCR_API_URL;

        console.log('runOcr', request);

        try {
            const res = await fetch(ocrApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            })
                .then(res => res.json());
            console.log('runOcr: OCR response:', res);
            return res;
        }
        catch (error) {
            console.error('Error making OCR request:', error);
            throw error;
        }
    }

    return {
        runOcr,
    }
}
export default useOcr;
