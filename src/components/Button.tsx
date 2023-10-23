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
}

export default function Button({
   primary = false,
   secondary = false,
   tertiary = false,
   children,
   padding = 'large',
   fullWidth = false,
   className = '',
   ...props
}: Props) {
    return <motion.button
        whileHover={{scale: 1.01}}
        whileTap={{scale: 0.99, backgroundColor: 'rgba(0, 0, 0, 0.1)'}}
        className={`
            inline-flex flex-row justify-center items-center font-bold gap-2 rounded-md
            ${fullWidth ? 'w-full flex-1' : ''}
            ${padding === 'large' ? 'p-8' : 'p-4 px-8'}
            ${primary ? "bg-amber-400 text-white" : ""}
            ${!primary && !tertiary ? "bg-gray-200 text-black" : ""}
            ${tertiary ? "bg-transparent text-black" : ""}
            ${className}
        `}
        {...props}
    >
        {children}
    </motion.button>
}
