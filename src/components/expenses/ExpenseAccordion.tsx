import {useState} from "react";
import {BsChevronUp} from "react-icons/bs";
import ExpenseCard from "@/components/expenses/ExpenseCard";
import {Gallery} from "react-photoswipe-gallery";
import ExpenseAttachmentThumbnail from "@/components/expenses/ExpenseAttachmentThumbnail";

export default function ExpenseAccordion({expense}) {
    const [open, setOpen] = useState(false);
    const isAlreadyClaimed = expense?.claimedIn?.length > 0;
    const statusColor = isAlreadyClaimed ? 'bg-red-500' : 'bg-green-500';

    const expenseToDisplay = {
        ...expense,
        title: isAlreadyClaimed ? expense?.title + ' (reeds gedeclareerd)' : expense?.title,
    }

    return (
        <div
            className="flex flex-col w-full h-auto bg-gray-50 p-2 px-4 rounded-md transition-all duration-300 ease-in-out relative overflow-hidden">

            <div className={statusColor + " absolute top-0 left-0 bottom-0 w-[4px]"}/>

            {/* basic expense info */}
            <button className="flex flex-row justify-between items-center"
                    onClick={() => setOpen(!open)}>
                <ExpenseCard
                    padding={0}
                    key={expense?.id}
                    expense={expenseToDisplay}
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
            <Gallery>
                <section
                    className={`
                    grid gap-2 grid-cols-3 relative pt-4
                    ${open ? 'block' : 'hidden'}
                `}
                >
                    {expense?.attachments?.map((image: any) => (
                        <ExpenseAttachmentThumbnail key={image?.id} imageUrl={image}/>
                    ))}
                </section>
            </Gallery>
        </div>
    );
}
