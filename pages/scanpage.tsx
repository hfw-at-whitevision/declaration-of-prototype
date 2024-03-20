import Button from "@/components/Button";
import {Capacitor} from "@capacitor/core";
import React, {useRef, useState} from "react";
import {Dialog} from "@capacitor/dialog";
import {useAtom} from "jotai";
import {loadingAtom} from "@/store/generalAtoms";
import {Filesystem} from '@capacitor/filesystem';
import OverviewHeader from "@/components/layout/OverviewHeader";
import Content from "@/components/Content";
import usePdf from "@/hooks/usePdf";
import useCamera from "@/hooks/useCamera";
import DisplayHeading from "@/components/layout/DisplayHeading";
import {BsArrowClockwise, BsBoxArrowInDown, BsCamera, BsShare, BsTrash} from "react-icons/bs";
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function ScanPage() {
    const [, setLoading] = useAtom(loadingAtom);
    const [scannedImages, setScannedImages] = useState([]);
    const [, setSelectedFiles]: any = useState([]);
    const fileInputRef: any = useRef(null);
    const {imagesToPdfShare} = usePdf();
    const {takePhoto} = useCamera();
    const isSharePdfAllowed = scannedImages?.length > 0;
    const swiperRef = useRef(null);

    const handleDownloadPdf = async (e: any) => {
        e.preventDefault();
        if (!scannedImages.length) return;
        return await imagesToPdfShare({
            base64Images: scannedImages,
        });
    }

    const handleCameraClick = async (e: any) => {
        e.preventDefault();
        const {base64Images} = await takePhoto();
        if (!base64Images?.length) return;
        setScannedImages(oldData => oldData?.concat(base64Images));
        swipeToLastSlide();
    }

    const handleFileImportClick = () => {
        fileInputRef.current.click();
    }

    const swipeToLastSlide = () => {
        // swiperRef.current.swiper.slideTo(scannedImages.length - 1);
    }

    const handleFileInputChange = async (e: any) => {
        console.log('handleFileInputChange', e?.target?.files);

        setLoading({
            isLoading: true,
            message: 'Document wordt gescand..'
        });

        try {
            const selectedFiles = e?.target?.files;
            setSelectedFiles(selectedFiles);
            if (!selectedFiles.length) return;
            const selectedFile = selectedFiles[0];

            // mobile
            if (Capacitor.isNativePlatform()) {
                const base64Image = await Filesystem.readFile({
                    path: selectedFile.path,
                });
                await setScannedImages((oldData) => ([...oldData, base64Image]));
            }
            // desktop
            else {
                console.log('handleFileInputChange: desktop', selectedFile);
                const reader = new FileReader();
                await reader.readAsDataURL(selectedFile);
                reader.onloadend = async () => {
                    const base64Image = reader.result;
                    await setScannedImages((oldData) => ([...oldData, base64Image]));
                }
            }
            swipeToLastSlide();
        } catch (e: any) {
            await Dialog.alert({
                title: 'Fout',
                message: 'Er is een fout opgetreden bij het importeren van de documenten: ' + e?.message ?? '-',
            });
            console.log('handleFileInputChange: error', e?.message ?? e)
        } finally {
            setLoading({
                isLoading: false,
            });
        }
    }

    const handleDeleteCurrentImage = async (e: any) => {
        e.preventDefault();
        if (!scannedImages.length) return;
        const {value: confirmed} = await Dialog.confirm({
            title: 'Verwijderen',
            message: 'Weet je zeker dat je deze scan wilt verwijderen?',
        });
        if (!confirmed) return;
        setScannedImages((oldData: any) => {
            const updatedImages = oldData?.filter((image: any, index: number) => index !== activeIndex)
            return updatedImages;
        });
    }

    return <>
        <OverviewHeader title={<>Scan <span className="font-thin">& verzend</span></>}/>

        <Content className="flex flex-1 items-start">
            <DisplayHeading className="text-sm">
                Scan of importeer een document en deel als PDF.
            </DisplayHeading>

            <section className="mt-8 w-full grid grid-cols-1 gap-2">
                <Button
                    primary
                    padding="small"
                    onClick={handleCameraClick}
                    rounded="full"
                    color="white"
                    icon={<BsCamera className="w-5 h-5 opacity-50"/>}
                >
                    Scan met camera
                </Button>

                <Button
                    secondary
                    padding="small"
                    onClick={handleFileImportClick}
                    rounded="full"
                    icon={<BsBoxArrowInDown className="w-5 h-5 opacity-50"/>}
                >
                    Importeer afbeelding
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={async (e) => await handleFileInputChange(e)}
                        ref={fileInputRef}
                    />
                </Button>
            </section>

            {scannedImages?.length > 0 && <>
                <section className="w-full h-full bg-white p-4 rounded-2xl w-full flex flex-col gap-4">
                    <div className="flex flex-row gap-2 items-center justify-end">
                        <Button secondary padding="small" className="w-8 h-8" rounded="full">
                            <BsArrowClockwise className="w-4 h-4"/>
                        </Button>
                        <Button secondary padding="small" className="w-8 h-8 !bg-red-500 text-white"
                                rounded="full"
                                onClick={handleDeleteCurrentImage}>
                            <BsTrash className="w-4 h-4"/>
                        </Button>
                    </div>

                    <Swiper
                        ref={swiperRef}
                        className="h-full w-full"
                        pagination={{
                            dynamicBullets: true,
                        }}
                        modules={[Pagination]}
                    >
                        {scannedImages?.map((image: any, index: number) =>
                            <SwiperSlide key={`scanpage-${index}`}>
                                <section
                                    className="absolute rounded-md overflow-hidden flex flex-col items-center justify-center gap-4 text-center">
                                    <img
                                        key={`scanpage-image-${index}`}
                                        src={image}
                                        className="w-full h-full object-contain"
                                    />
                                </section>
                            </SwiperSlide>
                        )}
                    </Swiper>
                </section>

                <Button
                    className="w-full"
                    color="black"
                    onClick={handleDownloadPdf}
                    disabled={!isSharePdfAllowed}
                    rounded="full"
                    icon={<BsShare className="w-6 h-6"/>}
                >
                    Deel als PDF
                </Button>
            </>}
        </Content>
    </>
}
