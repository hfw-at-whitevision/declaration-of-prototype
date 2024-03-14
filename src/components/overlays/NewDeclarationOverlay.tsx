import {useRouter} from "next/router";
import {BsCamera, BsUpload} from "react-icons/bs";
import {useAtom} from "jotai";
import {scannedImagesAtom, showNewDeclarationOverlayAtom} from "@/store/atoms";
import {DocumentScanner, ResponseType} from "capacitor-document-scanner";
import {Capacitor} from "@capacitor/core";
import {useRef, useState} from "react";
import {motion} from 'framer-motion';
import {Filesystem} from "@capacitor/filesystem";

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
                responseType: ResponseType.Base64,
            });

            console.log('scannedImages', scannedImages);

            const base64Images = [];
            for (const scannedImage of scannedImages) {
                const isPng = scannedImage.includes('iVBORw0KGgoAAAANSUhEUgAA');
                const isJpeg = scannedImage.includes('/9j/');

                if (isJpeg) base64Images.push(`data:image/jpeg;base64,${scannedImage}`);
                else if (isPng) base64Images.push(`data:image/png;base64,${scannedImage}`);
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
            if (Capacitor.isNativePlatform()) {
                console.log('selectedFile', selectedFile)
                const content = await Filesystem.readFile({
                    path: selectedFile.path,
                    // encoding: 'base64',
                });
                base64Images.push(content);
            }
            else {
                const reader = new FileReader();
                await reader.readAsDataURL(selectedFile);
                reader.onloadend = () => {
                    const base64Image = reader.result;
                    base64Images.push(base64Image);
                }
            }
        }

        await setScannedImages(base64Images);
        setShowNewDeclarationOverlay(false);
        await router.push('/declaration');
    }

    if (!showNewDeclarationOverlay) return null;
    return <motion.div
        layout
        {...props}
        className={`flex flex-row w-full gap-4`}
    >
        <motion.button
            whileHover={{scale: 1.02}}
            whileTap={{scale: 0.98}}
            className="flex flex-col flex-1 bg-gray-100 hover:bg-gray-200 cursor-pointer p-8 items-center justify-center rounded-lg text-sm gap-2"
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
        </motion.button>
        <motion.button
            whileHover={{scale: 1.02}}
            whileTap={{scale: 0.98}}
            className="flex flex-col flex-1 bg-gray-100 hover:bg-gray-200 cursor-pointer p-8 items-center justify-center rounded-lg gap-2 text-sm"
            onClick={(Capacitor.isNativePlatform()) ? handleCameraClick : handleFileImportClick}
        >
            <BsCamera className="w-8 h-8"/>
            Neem foto
        </motion.button>
    </motion.div>
}
