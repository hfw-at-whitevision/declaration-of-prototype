import {BiImport, BiScan} from "react-icons/bi";
import {BsPlusLg} from "react-icons/bs";
import React, {useState} from "react";
import {motion} from "framer-motion";

export default function PlusMenu() {
    const [showMenu, setShowMenu] = useState(false);

    const handleToggleMenu = (e) => {
        e.preventDefault();
        setShowMenu(!showMenu);
    }

    return <>
        <div className="fixed right-4 bottom-24 flex flex-col items-end">
            <h2 className={`font-bold mb-4 ${!showMenu ? 'opacity-0' : 'delay-300'} transition-all`}>
                Nieuwe declaratie
            </h2>
            <motion.div
                layout
                animate={{
                    height: showMenu ? 'auto' : 0,
                }}
                transition={{
                    type: 'spring',
                    duration: 0.3,
                }}
                className={`
                    bg-white shadow-md rounded-md mb-4 grid divide-y divide-black/5 w-[240px] overflow-hidden
                    transition-all
                `}
            >
                <button className="p-4 text-right flex flex-row items-center gap-2">
                    <BiImport className="w-5 h-5" strokeWidth={0.1}/>
                    Importeren
                </button>
                <button className="p-4 text-right flex flex-row items-center gap-2">
                    <BiScan className="w-5 h-5" strokeWidth={0.1}/>
                    Scannen
                </button>
            </motion.div>

            <button
                className="w-16 h-16 bg-white shadow-md rounded-full flex items-center justify-center"
                onClick={handleToggleMenu}
            >
                <BsPlusLg className="w-8 h-8 opacity-75" />
            </button>
        </div>
    </>
}
