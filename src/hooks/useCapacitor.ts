import { Capacitor } from '@capacitor/core';
import { DocumentScanner, ResponseType } from 'capacitor-document-scanner';
import { Camera, CameraResultType } from '@capacitor/camera';

const handleUseCamera = async () => {
    const isNative = Capacitor.isNativePlatform();

    // for native devices, use the DocumentScanner plugin
    if (isNative) {
        const { scannedImages }: any = await DocumentScanner.scanDocument({
            letUserAdjustCrop: false,
            // responseType: ResponseType.Base64,
        });
        const images = [];
        for (let i = 0; i < scannedImages?.length; i++) {
            const image = Capacitor.convertFileSrc(scannedImages[i]);
            images.push(image);
        }
        return images;
    }
    // for web, use the capacitor Camera plugin
    const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        width: 2048,
        height: 2048,
        presentationStyle: 'fullscreen',
        correctOrientation: false,
    });
    return [image.dataUrl as string];
};

const useCapacitor = () => {
    const currentPlatform = Capacitor.getPlatform();
    const isNative = Capacitor.isNativePlatform();
    const isAndroid = currentPlatform === 'android';
    const isIos = currentPlatform === 'ios';
    const isWeb = currentPlatform === 'web';

    return {
        currentPlatform,
        isNative,
        isAndroid,
        isIos,
        isWeb,
        handleUseCamera,
    };
};
export default useCapacitor;
