import ExpenseCard from "@/components/declarations/ExpenseCard";
import {useState} from "react";
import {BsChevronUp} from "react-icons/bs";

export default function ExpenseAccordion({expense}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col w-full h-auto bg-gray-50 p-2 rounded-md transition-all duration-300 ease-in-out">
            {/* basic expense info */}
            <button className="flex flex-row justify-between items-center"
                 onClick={() => setOpen(!open)}>
                <ExpenseCard
                    padding={0}
                    key={expense?.id}
                    expense={expense}
                    backgroundColor="bg-transparent" borderRadius="rounded-0"
                />
                <div className="flex items-center justify-center pl-4">
                    <BsChevronUp className={`w-4 h-4 text-black/50
                        ${open ? 'rotate-0' : 'rotate-180'}
                        transition-all duration-300 ease-in-out
                     `}/>
                </div>
            </button>

            {/* attachments */}
            <section
                className={`
                    grid gap-2 grid-cols-3 relative pt-4
                    ${open ? 'block' : 'hidden'}
                `}
            >
                {expense?.attachments?.map((image: any) => (
                    <img
                        key={image}
                        src={image}
                        className="w-full h-[100px] p-2 object-contain rounded-md border-2 border-amber-400"
                        fetchPriority="high"
                    />
                ))}
            </section>
        </div>
    );
}
