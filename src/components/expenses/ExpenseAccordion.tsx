import {useState} from "react";
import {BsChevronUp} from "react-icons/bs";
import ExpenseCard from "@/components/expenses/ExpenseCard";
import {Gallery} from "react-photoswipe-gallery";
import ExpenseAttachmentThumbnail from "@/components/expenses/ExpenseAttachmentThumbnail";
import Button from "@/components/Button";
import {useRouter} from "next/router";

export default function ExpenseAccordion({expense, showStatus = true}: any) {
    const [open, setOpen] = useState(false);
    const isAlreadyClaimed = expense?.claimedIn?.length > 0;
    const statusColor = isAlreadyClaimed ? 'bg-red-500' : 'bg-green-500';
    const router = useRouter();

    const expenseToDisplay = {
        ...expense,
        ...showStatus && {
            title: isAlreadyClaimed ? expense?.title + ' (reeds gedeclareerd)' : expense?.title,
        },
    }

    const onClick = () => {
        router.push('/expense?id=' + expense?.id);
    }

    return (
        <div
            className="flex flex-col w-full h-auto bg-gray-50 p-2 px-2 rounded-md transition-all duration-300 ease-in-out relative overflow-hidden">

            {showStatus &&
                <div className={statusColor + " absolute top-0 left-0 bottom-0 w-[4px]"}/>
            }

            {/* basic expense info */}
            <button className="flex flex-row justify-between items-center gap-4"
                    onClick={() => setOpen(!open)}>
                <ExpenseCard
                    padding={0}
                    className="pl-2"
                    key={expense?.id}
                    expense={expenseToDisplay}
                    backgroundColor="bg-transparent" borderRadius="rounded-0"
                />
                <div className="flex items-center justify-center px-2 bg-white rounded-md h-full">
                    <BsChevronUp className={`w-4 h-4 text-black/50
                        ${open ? 'rotate-0' : 'rotate-180'}
                        transition-all duration-300 ease-in-out
                     `}/>
                </div>
            </button>

            {/* content */}
            <section className={`${open ? 'flex flex-row items-end justify-between' : 'hidden'} px-2`}>
                <Gallery>
                    <div className={`flex flex-row gap-2 relative pt-4`}>
                        {expense?.attachments?.map((image: any, index: number) => (
                            <ExpenseAttachmentThumbnail key={image?.id + index} imageUrl={image}/>
                        ))}
                    </div>
                </Gallery>

                <Button
                    secondary
                    padding="small"
                    rounded="full"
                    onClick={onClick}
                >
                    Meer details
                </Button>
            </section>
        </div>
    );
}
