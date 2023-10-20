import {inputModalAtom} from "@/store/atoms"
import {useAtom} from "jotai"
import {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";

interface InputModalProps {
    show: boolean;
    title: string;
    type?: string;
    options?: Array<any>;
    defaultValue: string | number;
    onConfirm: (value: string) => void;
}

export default function InputModal({show, title, options, defaultValue, onConfirm, type = 'text',}: InputModalProps) {
    const [inputModal, setInputModal]: any = useAtom(inputModalAtom);
    const [inputModalValue, setInputModalValue] = useState<any>(null);
    const inputRef: any = useRef(null);

    const closeModal = () => {
        setInputModal({
            show: false,
        });
        inputRef.current.value = '';
    }

    const handleInputChange = (e: any) => {
        setInputModalValue(inputRef.current.value);
    }

    const handleSave = () => {
        onConfirm(inputRef.current.value);
        closeModal();
    }

    const handleCancel = () => {
        closeModal();
    }

    useEffect(() => {
        if (!show) return;
        if (type !== 'select') inputRef.current?.select();
        inputRef.current?.focus();
    }, [show]);

    useEffect(() => {
        inputRef.current.value = defaultValue;
    }, [defaultValue]);

    return (
        <div
            className={`
                fixed inset-0 bg-black/50 flex flex-col justify-center items-center z-50
                ${!show && 'hidden'}
            `}
        >
            <div className="bg-white rounded-lg flex flex-col justify-center items-center gap-4 w-full">

                <div className="p-8 grid w-full gap-2 text-center">
                    <h2 className="font-bold">
                        {title}
                    </h2>

                    {type === 'text'
                        ? <textarea
                            className="w-full outline-none ring-2 rounded-md p-2 ring-amber-400 resize-none overflow-y-auto"
                            onChange={handleInputChange ?? null}
                            ref={inputRef}
                            autoFocus
                            defaultValue={defaultValue}
                        />
                        : type === 'select'
                            ? <select
                                className="w-full outline-none ring-2 rounded-md p-2 ring-amber-400"
                                onChange={handleInputChange ?? null}
                                ref={inputRef}
                                autoFocus
                                defaultValue={defaultValue}
                            >
                                {options?.map((option: any, index: number) => (
                                    <option
                                        key={`${option}-${index}`}
                                        value={option}
                                    >
                                        {option}
                                    </option>
                                ))}
                            </select>
                            : <input
                                className="w-full outline-none ring-2 rounded-md p-2 ring-amber-400"
                                onChange={handleInputChange ?? null}
                                ref={inputRef}
                                autoFocus
                                defaultValue={defaultValue}
                                type={type}
                            />
                    }
                </div>

                <div
                    className="flex flex-row gap justify-between w-full border-t border-black/10 divide-x divide-black/10">
                    <motion.button
                        whileTap={{backgroundColor: 'rgba(0,0,0,0.1)'}}
                        className="flex-1 p-4"
                        onClick={handleCancel}
                    >
                        Annuleren
                    </motion.button>
                    <motion.button
                        whileTap={{backgroundColor: 'rgba(0,0,0,0.1)'}}
                        className="flex-1 p-4"
                        onClick={handleSave}
                    >
                        Opslaan
                    </motion.button>
                </div>

            </div>
        </div>
    )
}
