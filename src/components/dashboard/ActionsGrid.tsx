import {BsCreditCard2FrontFill, BsFillPatchCheckFill, BsSend, BsUpcScan} from "react-icons/bs";
import {displayFont} from "@/components/layout/DisplayHeading";
import {useRouter} from "next/router";
import {RiQrScanFill} from "react-icons/ri";

export default function ActionsGrid() {
    return <section className="grid grid-cols-2 w-full gap-4">

        <ActionCard Icon={BsFillPatchCheckFill} route="advice">
            Goedkeuren & Advies
        </ActionCard>
        <ActionCard Icon={BsCreditCard2FrontFill} route="declarations">
            Declaraties indienen
        </ActionCard>
        <ActionCard Icon={RiQrScanFill} route="scanpage">
            Documenten scannen
        </ActionCard>

    </section>
}

const ActionCard = ({Icon = undefined, className = '', children, route, ...props}: any) => {
    const router = useRouter();
    const handleGoToPage = (route: string) => {
        if (!route) return;
        router.push(`/${route}`);
    }

    return <button
        className={`
            ${displayFont.className}
            bg-white rounded-3xl p-8 flex flex-col items-center justify-start gap-4 relative
            text-sm
        `}
        onClick={() => handleGoToPage(route)}
        {...props}
    >
        <span
            {...props}
            className={`
                rounded-3xl bg-black/5 w-24 h-16 mx-auto flex items-center justify-center
                ${className}
            `}>
            <Icon className="w-8 h-8"/>
        </span>

        <span>
            {children}
        </span>
    </button>
}
