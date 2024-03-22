import {BiImport, BiScan} from "react-icons/bi";
import {BsFileEarmarkPlus, BsPlusLg} from "react-icons/bs";
import React, {useRef, useState} from "react";
import {motion} from "framer-motion";
import {useRouter} from "next/router";
import {useAtom} from "jotai";
import {currentTabIndexAtom, IsSelectingItemsAtom, loadingAtom, scannedImagesAtom} from "@/store/generalAtoms";
import {Capacitor} from "@capacitor/core";
import {DocumentScanner, ResponseType} from "capacitor-document-scanner";
import {Filesystem} from "@capacitor/filesystem";
import {Dialog} from "@capacitor/dialog";
import useOcr from "@/hooks/useOcr";
import {removeBase64DataHeader} from "@/utils";

export default function PlusMenu() {
    const router = useRouter();
    const [showMenu, setShowMenu] = useState(false);
    const [, setScannedImages]: any = useAtom(scannedImagesAtom);
    const fileInputRef: any = useRef(null);
    const [, setSelectedFiles]: any = useState([]);
    const [, setIsSelectingItems] = useAtom(IsSelectingItemsAtom);
    const [, setCurrentTabIndex] = useAtom(currentTabIndexAtom);
    const [, setLoading] = useAtom(loadingAtom);
    const {runOcr} = useOcr();

    const createNewExpense = async ({ocrData}: any = {}) => {
        const newExpense = {
            title: ocrData?.headers?.MerchantName ?? 'Nieuwe bon',
            description: ocrData?.lines?.[0]?.Description ?? '',
            totalAmount: ocrData?.headers?.Total ?? 0,
            date: !!ocrData?.headers?.TransactionDate ? new Date(ocrData.headers.TransactionDate).toDateString() : new Date().toDateString(),
        }
        console.log('Creating a new expense: ', newExpense, ocrData);
        const urlQuery = new URLSearchParams(newExpense).toString();
        await router.push(`/expense?${urlQuery}`);
    }

    const handleCameraClick = async (e: any) => {
        e.preventDefault();

        if (Capacitor.isNativePlatform()) {
            const {scannedImages}: any = await DocumentScanner.scanDocument({
                letUserAdjustCrop: false,
                responseType: ResponseType.Base64,
            });

            const base64Images = [];
            for (const scannedImage of scannedImages) {
                const isPng = scannedImage.includes('iVBORw0KGgoAAAANSUhEUgAA');
                const isJpeg = scannedImage.includes('/9j/');

                if (isJpeg) base64Images.push(`data:image/jpeg;base64,${scannedImage}`);
                else if (isPng) base64Images.push(`data:image/png;base64,${scannedImage}`);
            }

            setScannedImages(base64Images);
            await router.push('/expense');
        }
    }

    const handleFileImportClick = (e) => {
        fileInputRef.current.click();
    }

    const handleCreateDeclaration = async () => {
        setShowMenu(false);
        await router.push('/declarations');
        setCurrentTabIndex(0);
        setIsSelectingItems(true);
    }

    const handleFileInputChange = async (e: any) => {
        setLoading({
            isLoading: true,
            message: 'Bon wordt gescand..'
        });

        try {
            const selectedFiles = e?.target?.files;
            setSelectedFiles(selectedFiles);
            if (!selectedFiles.length) return;
            const selectedFile = selectedFiles[0];

            // mobile
            if (Capacitor.isNativePlatform()) {
                console.log('selectedFile', selectedFile)
                const base64Image = await Filesystem.readFile({
                    path: selectedFile.path,
                });
                await setScannedImages([base64Image]);
                const ocrResult = await runOcr({
                    imageBase64: removeBase64DataHeader(base64Image),
                });
                await createNewExpense({ocrData: ocrResult});
            }
            // desktop
            else {
                const reader = new FileReader();
                await reader.readAsDataURL(selectedFile);
                reader.onloadend = async () => {
                    const base64Image = reader.result;
                    await setScannedImages([base64Image]);
                    const ocrResult = await runOcr({
                        imageBase64: removeBase64DataHeader(base64Image),
                    });
                    await createNewExpense({ocrData: ocrResult});
                }
            }
        } catch (e: any) {
            await Dialog.alert({
                title: 'Fout',
                message: 'Er is een fout opgetreden bij het importeren van de bonnen: ' + e?.message ?? '-',
            });
        } finally {
            setLoading({
                isLoading: false,
            });
        }
    }

    const handleToggleMenu = (value: any) => {
        if (typeof value === 'boolean') return setShowMenu(value);
        else setShowMenu(!showMenu);
    }

    const menuVariants: any = {
        open: {opacity: 1, y: 0, pointerEvents: 'auto'},
        closed: {opacity: 0, y: "100%", pointerEvents: 'none'},
    }

    return <>
        <motion.nav
            layout
            animate={showMenu ? 'open' : 'closed'}
            variants={menuVariants}
            initial="closed"
            className={`
                bg-white shadow-md rounded-md mb-4 grid divide-y divide-black/5 w-[240px] overflow-hidden
                transition-all ${showMenu ? 'pointer-events-auto z-50' : 'pointer-events-none z-[-1]'}
                fixed right-4 bottom-40 flex flex-col items-end
            `}
        >
            <div
                id="plusMenu-inset"
                className="fixed inset-0 z-30"
                onClick={() => handleToggleMenu(false)}
            />
            <motion.h2
                animate={showMenu ? {opacity: 1} : {opacity: 0}}
                transition={{duration: 0.4, delay: 0.2}}
                className={`px-4 py-2 font-bold`}
            >
                Nieuw
            </motion.h2>
            <motion.button
                animate={showMenu ? {x: 0, opacity: 1} : {x: 100, opacity: 0}}
                transition={{duration: 0.2}}
                className="z-50 p-4 text-right flex flex-row items-center gap-2 hover:bg-gray-100"
                onClick={handleFileImportClick}
            >
                <BiImport className="w-5 h-5" strokeWidth={0.1}/>
                Importeer bon

                <input
                    type="file"
                    accept="image/*"
                    hidden
                    multiple={false}
                    onChange={handleFileInputChange}
                    ref={fileInputRef}
                />
            </motion.button>
            <motion.button
                animate={showMenu ? {x: 0, opacity: 1} : {x: 100, opacity: 0}}
                transition={{duration: 0.2, delay: 0.2}}
                className="p-4 text-right flex flex-row items-center gap-2 hover:bg-gray-100 z-50"
                onClick={handleCameraClick}
            >
                <BiScan className="w-5 h-5" strokeWidth={0.1}/>
                Scan bon
            </motion.button>
            <motion.button
                animate={showMenu ? {x: 0, opacity: 1} : {x: 100, opacity: 0}}
                transition={{duration: 0.2, delay: 0.4}}
                className="p-4 text-right flex flex-row items-center gap-2 hover:bg-gray-100 z-50"
                onClick={handleCreateDeclaration}
            >
                <BsFileEarmarkPlus className="w-5 h-5" strokeWidth={0.1}/>
                Creëer declaratie
            </motion.button>
        </motion.nav>

        <motion.button
            layout
            animate={showMenu
                ? {
                    rotate: 45,
                    backgroundColor: '#f6f6f6',
                }
                : {
                    rotate: 0,
                }
            }
            className="w-16 h-16 bg-white shadow-md rounded-full flex items-center justify-center z-40 fixed bottom-24 right-4"
            onClick={handleToggleMenu}
        >
            <BsPlusLg className="w-8 h-8 opacity-75"/>
        </motion.button>
    </>
}
