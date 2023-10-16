import { BsFillCheckSquareFill } from "react-icons/bs";

export default function DeclarationCard({
    onClick = () => {},
    selected,
    declaration,
}: any) {
    return (
        <div
            className="flex flex-row items-center gap-4 text-xs"
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
                    w-full grid grid-cols-2 p-4 gap-2 rounded-md bg-white cursor-pointer justify-between
                    ring-black
                    ${selected ? 'ring-2 shadow-md' : ''}
                `}
            >
                <span className="flex-1 font-bold text-left">
                    {declaration.name}
                </span>

                <span className="flex-1 text-right">
                    €{declaration.amount}
                </span>

                <span className="flex-1 text-left">
                    {declaration.status}
                </span>

                <span className="flex-1 text-right">
                    {declaration.date}
                </span>
            </a>
        </div>
    )
}
