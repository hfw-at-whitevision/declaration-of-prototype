import {useRouter} from "next/router";
import {BsCamera, BsUpload} from "react-icons/bs";
import {useAtom} from "jotai";
import {showNewDeclarationOverlayAtom} from "@/store/atoms";

export default function NewDeclarationOverlay(props) {
    const router = useRouter();
    const [showNewDeclarationOverlay, setShowNewDeclarationOverlay] = useAtom(showNewDeclarationOverlayAtom);

    const handleCameraClick = (e) => {
        e.preventDefault();
        setShowNewDeclarationOverlay(false);
        router.push('/declaration');
    }

    if (!showNewDeclarationOverlay) return null;
    return <>
        <div {...props} className="flex flex-row w-full gap-4">
            <div className="flex flex-col flex-1 bg-gray-100 p-8 items-center justify-center">
                <BsUpload className="w-16 h-16"/>
                Importeer
            </div>
            <div
                className="flex flex-col flex-1 bg-gray-100 p-8 items-center justify-center"
                onClick={handleCameraClick}
            >
                <BsCamera className="w-16 h-16"/>
                Neem foto
            </div>
        </div>
    </>
}
