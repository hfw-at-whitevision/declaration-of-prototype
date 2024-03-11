import {useState} from "react";
import {BsChevronUp} from "react-icons/bs";
import DeclarationCard from "@/components/declarations/DeclarationCard";

export default function DeclarationAccordion({declaration, className='', ...props}) {
    const [open, setOpen] = useState(false);

    return (
        <div className={className + " flex flex-col w-full h-auto bg-gray-50 p-2 rounded-md transition-all duration-300 ease-in-out"}>
            <button className="flex flex-row justify-between items-center"
                    onClick={() => setOpen(!open)}>
                <DeclarationCard
                    padding={0}
                    key={declaration?.id}
                    declaration={declaration}
                    backgroundColor="bg-transparent" borderRadius="rounded-0"
                />
                <div className="flex items-center justify-center pl-4">
                    <BsChevronUp className={`w-4 h-4 text-black/50
                        ${open ? 'rotate-0' : 'rotate-180'}
                        transition-all duration-300 ease-in-out
                     `}/>
                </div>
            </button>
        </div>
    );
}
