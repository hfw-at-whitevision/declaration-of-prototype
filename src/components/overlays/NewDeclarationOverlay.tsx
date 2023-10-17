import {useRouter} from "next/router";
import {BsCamera, BsUpload} from "react-icons/bs";
import {useAtom} from "jotai";
import {scannedImagesAtom, showNewDeclarationOverlayAtom} from "@/store/atoms";
import {DocumentScanner} from "capacitor-document-scanner";
import {Capacitor} from "@capacitor/core";
import {useEffect, useRef, useState} from "react";

export default function NewDeclarationOverlay(props: any) {
    const router = useRouter();
    const [showNewDeclarationOverlay, setShowNewDeclarationOverlay] = useAtom(showNewDeclarationOverlayAtom);
    const [scannedImages, setScannedImages]: any = useAtom(scannedImagesAtom);
    const fileInputRef: any = useRef(null);
    const [selectedFiles, setSelectedFiles]: any = useState([]);

    const handleCameraClick = async (e: any) => {
        e.preventDefault();
        setShowNewDeclarationOverlay(false);

        if (Capacitor.isNativePlatform()) {
            const {scannedImages}: any = await DocumentScanner.scanDocument({
                letUserAdjustCrop: false,
            });

            const base64Images = [];
            for (const scannedImage of scannedImages) {
                const base64Image = Capacitor.convertFileSrc(scannedImage);
                base64Images.push(base64Image);
            }

            setScannedImages(base64Images);
            await router.push('/declaration');
        }
    }

    const handleFileImportClick = () => {
        fileInputRef.current.click();
    }

    const handleFileInputChange = async (e: any) => {
        const selectedFiles = e.target.files;
        setSelectedFiles(selectedFiles);
        if (!selectedFiles.length) return;

        console.log('selectedFiles', selectedFiles)

        const base64Images: any = [];
        for (const selectedFile of selectedFiles) {
            const reader = new FileReader();
            await reader.readAsDataURL(selectedFile);
            reader.onloadend = () => {
                const base64Image = reader.result;
                base64Images.push(base64Image);
            }
        }

        await setScannedImages(base64Images);
        setShowNewDeclarationOverlay(false);
        await router.push('/declaration');
    }

    if (!showNewDeclarationOverlay) return null;
    return <>
        <div {...props} className="flex flex-row w-full gap-4">
            <div
                className="flex flex-col flex-1 bg-gray-100 hover:bg-gray-200 cursor-pointer p-8 items-center justify-center rounded-lg"
                onClick={handleFileImportClick}
            >
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={async (e) => await handleFileInputChange(e)}
                    ref={fileInputRef}
                />
                <BsUpload className="w-8 h-8"/>
                Importeer
            </div>
            <div
                className="flex flex-col flex-1 bg-gray-100 hover:bg-gray-200 cursor-pointer p-8 items-center justify-center rounded-lg"
                onClick={(Capacitor.isNativePlatform()) ? handleCameraClick : handleFileImportClick}
            >
                <BsCamera className="w-8 h-8"/>
                Neem foto
            </div>
        </div>
    </>
}
