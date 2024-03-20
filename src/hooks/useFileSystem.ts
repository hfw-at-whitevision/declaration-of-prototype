import {Filesystem, Directory, Encoding, WriteFileResult} from '@capacitor/filesystem';

const rootDir = 'WhiteVision';

interface WriteTemporaryFileProps {
    fileName: string;
    base64: string;
}

const writeTemporaryFile = async ({fileName, base64}: WriteTemporaryFileProps): Promise<WriteFileResult> => {
    return await Filesystem.writeFile({
        path: `${rootDir}/${fileName}`,
        data: base64,
        directory: Directory.Cache,
        // encoding: Encoding.UTF8, // left empty to write as base64 encoded
    });
};

const readSecretFile = async () => {
    const contents = await Filesystem.readFile({
        path: 'secrets/text.txt',
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
    });

    console.log('secrets:', contents);
};

const deleteSecretFile = async () => {
    await Filesystem.deleteFile({
        path: 'secrets/text.txt',
        directory: Directory.Documents,
    });
};

const readFilePath = async () => {
    // Here's an example of reading a file with a full file path. Use this to
    // read binary data (base64 encoded) from plugins that return File URIs, such as
    // the Camera.
    const contents = await Filesystem.readFile({
        path: 'file:///var/mobile/Containers/Data/Application/22A433FD-D82D-4989-8BE6-9FC49DEA20BB/Documents/text.txt',
    });

    console.log('data:', contents);
};


const useFileSystem = () => {
    return {
        writeTemporaryFile,
    }
}

export default useFileSystem;
