export const removeBase64DataHeader = (base64Data: string) => {
    const base64DataWithoutHeader = base64Data.split(',')[1];
    return base64DataWithoutHeader;
}
