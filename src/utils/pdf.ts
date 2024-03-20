import {PDFDocument} from 'pdf-lib';

export const getPdfFromImage = async ({imageBase64}) => {
    try {
        console.log('getPdfFromImage: input imageBase64', imageBase64);
        const pdfDoc = await PDFDocument.create();

        // get image type from the base64 string
        const isPng = imageBase64.includes('iVBORw0KGgoAAAANSUhEUgAA');
        const isJpeg = imageBase64.includes('/9j/');
        const imageType = isPng ? 'png' : isJpeg ? 'jpeg' : null;

        if (!imageType) {
            console.error('getPdfFromImage: unsupported image type');
            return null;
        }

        const imagePdf = (isPng)
            ? await pdfDoc.embedPng(imageBase64)
            : await pdfDoc.embedJpg(imageBase64);

        console.log('getPdfFromImage: the image to be converted to pdf', imagePdf.width, imagePdf.height, imageType);

        const page = pdfDoc.addPage([imagePdf.width, imagePdf.height]);
        const dims = imagePdf.scale(1);
        page.drawImage(imagePdf, {
            x: page.getWidth() / 2 - dims.width / 2,
            y: page.getHeight() / 2 - dims.height / 2,
            width: dims.width,
            height: dims.height,
        });
        const pdfBase64 = await pdfDoc.saveAsBase64({dataUri: true});
        return pdfBase64;
    } catch (e) {
        console.error(e);
        return null;
    }
};
