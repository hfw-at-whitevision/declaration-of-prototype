export const removeBase64DataHeader = (base64Data: string) => {
    const base64DataWithoutHeader = base64Data.split(',')[1];
    return base64DataWithoutHeader;
}

export async function blobToURL(blob: any) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
        };
    });
}
