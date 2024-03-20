import {Capacitor} from "@capacitor/core";
import {DocumentScanner, ResponseType} from "capacitor-document-scanner";

type Base64Image = string;
interface TakePhotoResult {
    base64Images: Base64Image[];
}

const takePhoto = async (): Promise<TakePhotoResult> => {
    const base64Images = [];

    if (Capacitor.isNativePlatform()) {
        const {scannedImages}: any = await DocumentScanner.scanDocument({
            letUserAdjustCrop: false,
            responseType: ResponseType.Base64,
        });
        for (const scannedImage of scannedImages) {
            const isPng = scannedImage.includes('iVBORw0KGgoAAAANSUhEUgAA');
            const isJpeg = scannedImage.includes('/9j/');

            if (isJpeg) base64Images.push(`data:image/jpeg;base64,${scannedImage}`);
            else if (isPng) base64Images.push(`data:image/png;base64,${scannedImage}`);
        }
    }

    return {
        base64Images,
    };
}

const useCamera = () => {
    return {
        takePhoto,
    }
}
export default useCamera;
