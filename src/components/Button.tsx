import {motion} from "framer-motion";

interface Props {
    primary?: boolean;
    secondary?: boolean;
    tertiary?: boolean;
    children: React.ReactNode;
    padding?: 'small' | 'large';
    fullWidth?: boolean;
    className?: string;
    onClick?: (e: any) => void;
    disabled?: boolean;
    rounded?: string;
    icon?: React.ReactNode;
}

export default function Button(
    {
        primary = false,
        secondary = false,
        tertiary = false,
        children,
        padding = 'large',
        fullWidth = false,
        rounded = 'medium',
        className = '',
        icon = null,
        ...props
    }: Props
) {
    return <motion.button
        whileHover={{scale: 1.01}}
        whileTap={{scale: 0.99, backgroundColor: 'rgba(0, 0, 0, 0.1)'}}
        className={`
            inline-flex flex-row justify-center items-center font-extrabold gap-2
            ${rounded === 'medium' ? 'rounded-md' : ''}
            ${rounded === 'large' ? 'rounded-lg' : ''}
            ${rounded === 'full' ? 'rounded-full' : ''}
            ${fullWidth ? 'w-full flex-1' : ''}
            ${padding === 'large' ? 'p-8' : 'p-4'}
            ${primary ? "bg-amber-400 text-white" : ""}
            ${!primary && !tertiary ? "bg-gray-200 text-black" : ""}
            ${tertiary ? "bg-transparent text-black" : ""}
            ${className}
        `}
        {...props}
    >
        {icon &&
            <span className="mr-auto">
                {icon}
            </span>
        }

        <span className="flex-1 flex flex-row items-center justify-center text-center gap-2">
            {children}
        </span>
    </motion.button>
}
