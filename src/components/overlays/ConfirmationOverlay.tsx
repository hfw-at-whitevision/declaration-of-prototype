import React from "react";
import {FcCheckmark} from "react-icons/fc";
import {useAtom} from "jotai";
import {trulyShowConfirmationOverlayAtom} from "@/store/atoms";

export default function ConfirmationOverlay({title, ...props}) {
    const [trulyShowConfirmationOverlay] = useAtom(trulyShowConfirmationOverlayAtom);
    if (!trulyShowConfirmationOverlay) return null;
    return <div {...props}>
        <div
            className="flex flex-row gap-8 flex-1 p-8 items-center justify-center text-2xl font-extrabold"
        >
            <FcCheckmark className="w-16 h-16"/>
            {title}
        </div>
    </div>
}
