import { BsFillCheckSquareFill } from "react-icons/bs";

export default function DeclarationCard({
    onClick = () => {},
    selected,
    declaration,
}) {
    return (
        <div
            className="flex flex-row items-center gap-4"
            onClick={onClick}
        >
            {selected
                && <BsFillCheckSquareFill
                    className="w-8 h-8"
                />
            }

            <div
                key={declaration.id}
                className="w-full grid grid-cols-2 p-8 gap-2 bg-white justify-between"
            >
                <span className="flex-1 font-bold">
                    {declaration.name}
                </span>

                <span className="flex-1 text-right">
                    €{declaration.amount}
                </span>

                <span className="flex-1">
                    {declaration.status}
                </span>

                <span className="flex-1 text-right">
                    {declaration.date}
                </span>
            </div>
        </div>
    )
}
