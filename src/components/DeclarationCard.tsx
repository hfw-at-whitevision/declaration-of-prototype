import { BsFillCheckSquareFill } from "react-icons/bs";
import {motion} from 'framer-motion';

export default function DeclarationCard({
    onClick = () => {},
    selected,
    declaration,
}: any) {
    return (
        <motion.button
            whileHover={{scale: 1.01}}
            whileTap={{scale: 0.99}}
            className="flex flex-row items-center gap-4 text-xs w-full"
            onClick={onClick}
        >
            {selected
                && <BsFillCheckSquareFill
                    className="w-8 h-8"
                />
            }

            <a
                key={declaration.id}
                className={`
                    w-full grid grid-cols-2 p-4 gap-2 rounded-md bg-white focus:bg-black/5
                    cursor-pointer justify-between ring-black shadow-xl shadow-gray-500/5
                    ${selected ? 'ring-2 shadow-md' : ''}
                `}
            >
                <span className="flex-1 font-bold text-left">
                    {declaration.name}
                </span>

                <span className="text-right">
                    €{declaration.amount}
                </span>

                <span className="flex-1 text-left">
                    {declaration.status}
                </span>

                <span className="text-right">
                    {declaration.date}
                </span>
            </a>
        </motion.button>
    )
}
