import {BsCreditCard2FrontFill, BsFillPatchCheckFill, BsSend, BsUpcScan} from "react-icons/bs";
import {displayFont} from "@/components/layout/DisplayHeading";
import {useRouter} from "next/router";
import {RiQrScanFill} from "react-icons/ri";
import {motion} from "framer-motion";

export default function ActionsGrid() {
    const items = [
        {
            Icon: BsFillPatchCheckFill,
            route: 'advice',
            text: 'Goedkeuren & Advies',
        },
        {
            Icon: BsCreditCard2FrontFill,
            route: 'declarations',
            text: 'Declaraties indienen',
        },
        {
            Icon: RiQrScanFill,
            route: 'scanpage',
            text: 'Documenten scannen',
        }
    ];

    return <section className="grid grid-cols-2 w-full gap-4">
        {items.map((item, index) => {
            return <ActionCard
                backgroundColor={colors[index % colors.length]}
                key={index}
                Icon={item.Icon}
                route={item.route}
            >
                {item.text}
            </ActionCard>
        })}
    </section>
}

const ActionCard = ({Icon = undefined, className = '', children, route, backgroundColor, ...props}: any) => {
    const router = useRouter();
    const handleGoToPage = (route: string) => {
        if (!route) return;
        router.push(`/${route}`);
    }

    return <motion.button
        className={`
            ${displayFont.className} ${backgroundColor}
            rounded-2xl p-4 flex flex-col items-start justify-start gap-4 relative text-sm
        `}
        onClick={() => handleGoToPage(route)}
        {...props}
    >
        <span
            {...props}
            className={`
                rounded-3xl bg-black/5 ml-auto flex items-center justify-center
                ${className}
            `}>
            <Icon className="w-6 h-6 text-white"/>
        </span>

        <span className="text-white">
            {children}
        </span>
    </motion.button>
}

const colors = [
    "bg-green-500/95",
    "bg-blue-500/95",
    "bg-red-500/95",
    "bg-yellow-500/95",
]
