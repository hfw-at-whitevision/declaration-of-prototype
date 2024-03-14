import {BsCreditCard2FrontFill, BsFillPatchCheckFill, BsSend} from "react-icons/bs";
import {displayFont} from "@/components/layout/DisplayHeading";

export default function ActionsGrid() {
    return <section className="flex flex-col w-full gap-4">

        <ActionCard Icon={BsFillPatchCheckFill} className="">
            Goedkeuren & Advies
        </ActionCard>
        <ActionCard Icon={BsCreditCard2FrontFill} className="">
            Declaraties indienen
        </ActionCard>

    </section>
}

const ActionCard = ({Icon = undefined, className = '', children, ...props}: any) => (
    <button className={`${displayFont.className} font-black bg-white rounded-full p-8 flex flex-row items-center justify-start gap-2 relative h-32 pl-32 text-lg`}>
        <span
            {...props}
            className={`
                rounded-full bg-black/5 absolute left-4 top-4 bottom-4 w-24 flex items-center justify-center
                ${className}
            `}>
            <Icon className="w-8 h-8" />
        </span>

        {children}
    </button>
)
