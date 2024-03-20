import {Share, ShareResult} from '@capacitor/share';

interface ShareFileProps {
    filePath: string;
}

const shareFile = async ({filePath}: ShareFileProps): Promise<ShareResult> => {
    return await Share.share({
        url: filePath,
    })
}

const useShare = () => {
    return {
        shareFile,
    }
}
export default useShare;
