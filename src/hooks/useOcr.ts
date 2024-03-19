type runOcrParams = {
    imageBase64: string;
    tenandId: string;
}

const runOcr = async ({
                          imageBase64,
                          tenandId,
                      }: runOcrParams) => {
    const request = {
        ImageBase64: imageBase64,
        TenantId: tenandId,
    };
    const ocrApiUrl = process.env.NEXT_PUBLIC_OCR_API_URL;

    try {
        const res = await fetch(ocrApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
        if (!res.ok) {
            console.error('Network response was not ok');
        }
        const data = await res.json();
        console.log('OCR response:', data);
        return data;
    }
    catch (error) {
        console.error('Error making OCR request:', error);
        throw error;
    }
}

const useOcr = () => {
    return {
        runOcr,
    }
}
export default useOcr;
