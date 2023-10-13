import { useRouter } from "next/router";
import { BsCamera, BsUpload } from "react-icons/bs";
import { useAtom } from "jotai";
import { scannedImagesAtom, showNewDeclarationOverlayAtom } from "@/store/atoms";
import { DocumentScanner } from "capacitor-document-scanner";
import { Capacitor } from "@capacitor/core";

export default function NewDeclarationOverlay(props: any) {
    const router = useRouter();
    const [showNewDeclarationOverlay, setShowNewDeclarationOverlay] = useAtom(showNewDeclarationOverlayAtom);
    const [scannedImages, setScannedImages]: any = useAtom(scannedImagesAtom);

    const handleCameraClick = async (e: any) => {
        e.preventDefault();
        setShowNewDeclarationOverlay(false);

        if (Capacitor.isNativePlatform()) {
            const { scannedImages }: any = await DocumentScanner.scanDocument({
                letUserAdjustCrop: false,
            });

            const base64Images = [];
            for (const scannedImage of scannedImages) {
                const base64Image = Capacitor.convertFileSrc(scannedImage);
                base64Images.push(base64Image);
            }

            setScannedImages(base64Images);
        }
        router.push('/declaration');
    }

    if (!showNewDeclarationOverlay) return null;
    return <>
        <div {...props} className="flex flex-row w-full gap-4">
            <div className="flex flex-col flex-1 bg-gray-100 hover:bg-gray-200 cursor-pointer p-8 items-center justify-center">
                <BsUpload className="w-8 h-8" />
                Importeer
            </div>
            <div
                className="flex flex-col flex-1 bg-gray-100 hover:bg-gray-200 cursor-pointer p-8 items-center justify-center"
                onClick={handleCameraClick}
            >
                <BsCamera className="w-8 h-8" />
                Neem foto
            </div>
        </div>
    </>
}
