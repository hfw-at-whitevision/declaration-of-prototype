import {getPdfFromImage} from "@/utils/pdf";
import {PDFDocument} from "pdf-lib";
import useFileSystem from "@/hooks/useFileSystem";
import useShare from "@/hooks/useShare";
import {ShareResult} from "@capacitor/share";

interface HandleDownloadPdfProps {
    base64Images: string[];
}

const convertImagesToPdf = async ({
    base64Images,
                                 }: HandleDownloadPdfProps) => {
    console.log(`handleDownloadPdf: merging ${base64Images?.length} images to 1 PDF`);
    try {
        const pdfBase64Array = [];

        // convert JPG / PNG to PDF
        for (const base64Image of base64Images) {
            const pdfBase64 = await getPdfFromImage({
                imageBase64: base64Image,
            });
            console.log('scannedImage converted to pdfBase64', pdfBase64);
            pdfBase64Array.push(pdfBase64);
        }

        if (!pdfBase64Array.length) return;

        // merge all PDFs into one
        const mergedPdf: any = await PDFDocument.create();
        const pdfDocumentsPromises: any = pdfBase64Array.map(async (pdfBase64) => await PDFDocument.load(pdfBase64));
        const pdfDocuments = await Promise.all(pdfDocumentsPromises);

        for (const pdfDocument of pdfDocuments) {
            const copiedPages = await mergedPdf.copyPages(pdfDocument, pdfDocument.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBase64 = await mergedPdf.saveAsBase64({
            dataUri: true,
        });
        console.log('mergedPdfBase64', mergedPdfBase64);

        return mergedPdfBase64;
    }
    catch (e) {
        console.error('handleDownloadPdf error', e);
    }
}

const usePdf = () => {
    const {writeTemporaryFile} = useFileSystem();
    const {shareFile} = useShare();

    const imagesToPdfShare = async ({base64Images}: HandleDownloadPdfProps): Promise<ShareResult> => {
        // convert the input base64 images to PDF first
        const pdfBase64 = await convertImagesToPdf({
            base64Images,
        });
        // save the PDF to cache folder
        const fileName = `scan-${new Date().toISOString()}.pdf`;
        const {uri} = await writeTemporaryFile({
            fileName,
            base64: pdfBase64,
        });
        // share the PDF
        return await shareFile({
            filePath: uri,
        });
    }

    return {
        imagesToPdfShare,
    }
}
export default usePdf;
