import {useAtom} from "jotai";
import {
    confirmationOverlayTitleAtom,
    showConfirmationOverlayAtom,
    showNewDeclarationOverlayAtom,
    trulyShowConfirmationOverlayAtom
} from "@/store/atoms";
import NewDeclarationOverlay from "@/components/overlays/NewDeclarationOverlay";
import ConfirmationOverlay from "@/components/overlays/ConfirmationOverlay";
import {useEffect} from "react";

export default function Overlay() {
    const [showNewDeclarationOverlay, setShowNewDeclarationOverlay] = useAtom(showNewDeclarationOverlayAtom);
    const [showConfirmationOverlay, setShowConfirmationOverlay] = useAtom(showConfirmationOverlayAtom);
    const [confirmationOverlayTitle] = useAtom(confirmationOverlayTitleAtom);
    const [trulyShowConfirmationOverlay, setTrulyShowConfirmationOverlay] = useAtom(trulyShowConfirmationOverlayAtom);

    const closeOverlay = () => {
        setShowNewDeclarationOverlay(false);
        setShowConfirmationOverlay(false);
        setTrulyShowConfirmationOverlay(false);
    }

    const stopPropagationProps = {
        onClick: (e: any) => e.stopPropagation(),
    };

    const autoCloseConfirmationOverlay = () => {
        setTimeout(() => {
            closeOverlay();
        }, 2000);
    }

    // delay showing confirmation overlay
    useEffect(() => {
        if (!showConfirmationOverlay) return;
        setTimeout(() => {
            setTrulyShowConfirmationOverlay(true);
        }, 200);
    }, [showConfirmationOverlay]);

    // auto close confirmation overlay
    useEffect(() => {
        if (!trulyShowConfirmationOverlay) return;
        autoCloseConfirmationOverlay();
    }, [trulyShowConfirmationOverlay]);

    if (
        !showNewDeclarationOverlay
        && !trulyShowConfirmationOverlay
    ) return null;
    return (
        <div
            className="fixed inset-0 bg-black/50 flex flex-col justify-end items-end"
            onClick={closeOverlay}
        >
            <div className="bg-white p-8 rounded-t-2xl flex flex-row justify-center items-center gap-4 w-full">
                <NewDeclarationOverlay {...stopPropagationProps} />
                <ConfirmationOverlay title={confirmationOverlayTitle}  {...stopPropagationProps} />
            </div>
        </div>
    )
}
