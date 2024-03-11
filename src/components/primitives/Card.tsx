import {BsFillCheckSquareFill, BsSquare, BsTrash} from "react-icons/bs";
import {motion, useAnimate} from 'framer-motion';
import {useState} from "react";

interface CardProps {
    // onClick?: () => void;
    padding?: number;
    backgroundColor?: string;
    onSwipeLeft?: any;
    allowSwipeLeft?: boolean;
    selected?: boolean;
    deselectFn?: () => void;
    selectFn?: () => void;
    children?: any;
    className?: string;
    borderLeft?: boolean;
    borderColor?: string;
    isSelectingItems?: boolean;
    borderRadius?: string;

    [x: string]: any;
}

export default function Card(
    {
        // onClick,
        onSwipeLeft,
        padding = 4,
        allowSwipeLeft,
        className,
        selected,
        deselectFn,
        selectFn,
        isSelectingItems = false,
        children,
        backgroundColor = 'bg-white',
        borderLeft,
        borderColor,
        borderRadius = 'rounded-md',
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
            className={`flex flex-row items-center gap-4 text-xs w-full cursor-pointer`}
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
            {isSelectingItems && !selected
                && <BsSquare
                    className="w-8 h-8 text-blue-500"
                    onClick={() => selectFn && selectFn()}
                />
            }

            {selected
                && <BsFillCheckSquareFill
                    className="w-8 h-8 text-blue-500"
                    onClick={() => deselectFn && deselectFn()}
                />
            }

            <a
                className={`
                    w-full p-${padding} gap-2 ${borderRadius} ${backgroundColor} focus:bg-black/5
                    cursor-pointer ring-blue-500
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
                <span className={`flex bg-red-600 ${borderRadius} w-16 text-white h-full items-center justify-center p-2`}>
                    <BsTrash className="text-white w-4 h-4"/>
                </span>
            }
        </motion.button>
    )
}
