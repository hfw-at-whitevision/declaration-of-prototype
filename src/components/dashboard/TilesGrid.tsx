import {displayFont} from "@/components/layout/DisplayHeading";
import {useRouter} from "next/router";
import {motion} from "framer-motion";

export default function TilesGrid({items}) {
    return <section className="grid grid-cols-2 w-full gap-4">
        {items?.map((item, index) => {
            return <Tile
                backgroundColor={colors[index % colors.length]}
                key={index}
                Icon={item.Icon}
                route={item.route}
                color={item?.color}
                label={item.label}
                value={item?.value}
                onClick={item?.onClick}
            />
        })}
    </section>
}

const Tile = ({
                  Icon = undefined,
                  value = undefined,
                  label,
                  className = '',
                  color = undefined,
                  children,
                  route,
                  onClick: inputOnClick = undefined,
                  backgroundColor,
                  ...props
              }: any) => {
    const router = useRouter();
    const handleGoToPage = (route: string) => {
        if (!route) return;
        router.push(`/${route}`);
    }
    const onClick = async (e) => {
        e.preventDefault();
        if (inputOnClick) await inputOnClick(e);
        else handleGoToPage(route);
    }
    if (!!color) backgroundColor = `bg-${color}-500`;

    return <motion.button
        whileHover={{scale: 1.01}}
        whileTap={{scale: 0.99, backgroundColor: 'rgba(0, 0, 0, 0.2)'}}
        className={`
            ${displayFont.className}
            rounded-2xl p-4 flex flex-col items-start justify-start gap-4 relative text-sm relative overflow-hidden
        `}
        onClick={onClick}
        {...props}
    >
        <div className={`absolute inset-0 ${backgroundColor} opacity-95 z-[0]`}/>

        <span className="flex flex-row w-full justify-between items-start">
            <span className="text-white opacity-50 text-xl text-left text-nowrap overflow-hidden">
                {value}
            </span>
            <span
                className={`
                    rounded-3xl bg-black/5 ml-auto flex items-center justify-center z-10
                    ${className}
                `}
                {...props}
            >
                <Icon className="w-6 h-6 text-white"/>
            </span>
        </span>

        <span className="text-white z-10 text-left">
            {label} {children}
        </span>
    </motion.button>
}

const colors = [
    "bg-green-500",
    "bg-blue-500",
    "bg-red-500",
    "bg-yellow-500",
]
