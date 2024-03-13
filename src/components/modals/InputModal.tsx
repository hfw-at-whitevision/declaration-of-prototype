import {inputModalAtom} from "@/store/atoms"
import {useAtom} from "jotai"
import {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

    const selectedDate = !!inputModalValue
        ? new Date(inputModalValue)
        : (defaultValue)
            ? new Date(defaultValue)
            : new Date();

    const closeModal = () => {
        setInputModal({
            show: false,
        });
        if(type !== 'date') inputRef.current.value = null;
    }

    const handleInputChange = (e: any) => {
        if (type === 'date') setInputModalValue(new Date(e).toDateString());
        else setInputModalValue(inputRef.current.value);
    }

    const handleSave = () => {
        if (type === 'date') onConfirm(inputModalValue);
        else onConfirm(inputRef.current.value);
        closeModal();
    }

    const handleCancel = () => {
        closeModal();
    }

    useEffect(() => {
        if (!show) return;
        if (type !== 'select' && type !== 'date') inputRef.current?.select();
        if (type !== 'date') inputRef.current?.focus();
    }, [show]);

    useEffect(() => {
        // if (type === 'date') return;
        if (!defaultValue || !inputRef || !inputRef?.current) return;
        inputRef.current.value = defaultValue;
    }, [defaultValue, inputRef]);

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
                            : type === 'date'
                                ? <DatePicker
                                    ref={(oldRef) => oldRef = inputRef}
                                    showTimeInput={false}
                                    showTimeSelect={false}
                                    dateFormat="MM-dd-yyyy"
                                    onChange={handleInputChange ?? null}
                                    selected={inputModalValue ? new Date(inputModalValue) : (defaultValue) ? new Date(defaultValue) : new Date()}
                                    placeholderText="Selecteer een datum"
                                />
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
