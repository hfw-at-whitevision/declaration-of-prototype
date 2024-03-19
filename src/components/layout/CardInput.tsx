import {useAtom} from "jotai";
import {inputModalAtom} from "@/store/generalAtoms";
import React from "react";

export default function CardInput({
                                      allowEdit,
                                      value,
                                      onConfirm,
                                      type = 'text',
                                      label,
                                      title,
                                      options,
                                  }: any) {
    const [inputModal, setInputModal] = useAtom(inputModalAtom);
    return (
        <button
            disabled={!allowEdit}
            className="bg-white py-6 text-sm rounded-md p-4 cursor-pointer relative text-left"
            onClick={() => setInputModal({
                ...inputModal,
                show: true,
                title: title ?? label,
                type: type,
                defaultValue: value,
                onConfirm,
                options,
            })}
        >

            <span className={
                (typeof value !== 'undefined')
                    ? 'absolute top-1 text-[10px] opacity-50'
                    : 'opacity-50'
            }>
                {label}
            </span>
            {value}

        </button>
    )
}
