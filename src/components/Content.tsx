import {AnimatePresence, motion} from 'framer-motion';

export default function Content({children, vAlign = 'start', className = '', ...props}: any) {
    const screenVariants = {
        offscreen: {
            x: '100%',
        },
        onscreen: {
            x: 0,
        }
    }

    const verticalAlignment = (vAlign === 'center') ? 'justify-center' : 'justify-start';

    return (
        <AnimatePresence>
            <motion.div
                className={`Content p-4 py-4 flex-1 flex flex-col w-full ${verticalAlignment} gap-2 ${className}`}
                variants={screenVariants}
                animate="onscreen"
                initial="offscreen"
                exit="offscreen"
                transition={{
                    type: 'spring',
                    bounce: 0.0,
                    duration: 0.2,
                    delay: 0.2,
                }}
                viewport={{
                    once: false,
                    amount: 0
                }}
                {...props}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}
