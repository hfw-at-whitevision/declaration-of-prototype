import {BsFillCheckSquareFill, BsTrash} from "react-icons/bs";
import {motion, useAnimate} from 'framer-motion';
import {useState} from "react";

interface CardProps {
    // onClick?: () => void;
    onSwipeLeft?: any;
    allowSwipeLeft?: boolean;
    selected?: boolean;
    deselectFn?: () => void;
    children?: any;
    className?: string;
    borderLeft?: boolean;
    borderColor?: string;

    [x: string]: any;
}

export default function Card(
    {
        // onClick,
        onSwipeLeft,
        allowSwipeLeft,
        className,
        selected,
        deselectFn,
        children,
        borderLeft,
        borderColor,
        ...props
    }: CardProps = {}
) {
    const [scope, animate] = useAnimate();
    const [swipedLeft, setSwipedLeft] = useState(false);

    const handleDragEnd = (event, info) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset < -200 || velocity < -500) {
            setTimeout(() => setSwipedLeft(true), 200);
            if (onSwipeLeft)
                setTimeout(async () => {
                    const success = await onSwipeLeft();
                    if (!success) setSwipedLeft(false);
                }, 500);
        }
    }

    return (
        <motion.button
            layout
            ref={scope}
            whileHover={{scale: 1.01}}
            className={`flex flex-row items-center gap-4 text-xs w-full`}
            onBlur={() => setSwipedLeft(false)}
            {...allowSwipeLeft && {
                drag: 'x',
                dragDirectionLock: true,
                onDragEnd: handleDragEnd,
                dragConstraints: {
                    left: 0,
                    right: 0,
                },
                dragElastic: {
                    left: 0.9,
                    right: 0,
                },
            }}
            {...props}
        >
            {selected
                && <BsFillCheckSquareFill
                    className="w-8 h-8 text-blue-500"
                    onClick={() => deselectFn && deselectFn()}
                />
            }

            <a
                className={`
                    w-full p-4 gap-2 rounded-md bg-white focus:bg-black/5
                    cursor-pointer ring-blue-500 shadow-xl shadow-gray-500/5
                    overflow-hidden relative flex justify-between text-left
                    ${selected ? 'ring-2 shadow-md' : ''}
                    ${className}
                `}
            >
                {borderLeft &&
                    <div
                        className={`card-border-left absolute left-0 top-0 bottom-0 w-[4px] ${borderColor ?? 'bg-amber-400'}`}/>
                }

                {children}
            </a>

            {swipedLeft &&
                <span className="flex bg-red-600 rounded-md w-16 text-white h-full items-center justify-center p-2">
                    <BsTrash className="text-white w-4 h-4"/>
                </span>
            }
        </motion.button>
    )
}
