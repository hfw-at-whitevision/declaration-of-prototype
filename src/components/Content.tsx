import {motion} from 'framer-motion';

export default function Content({children, className = ''}: any) {
    const screenVariants = {
        offscreen: {
            x: '100%',
        },
        onscreen: {
            x: 0,
        }
    }
    return (
        <motion.div
            className={`p-4 py-8 grid gap-2 ${className}`}
            variants={screenVariants}
            whileInView="onscreen"
            initial="offscreen"
            transition={{
                type: 'spring',
                bounce: 0.0,
                duration: 0.2,
            }}
            viewport={{
                once: false,
                amount: 0
            }}
        >
            {children}
        </motion.div>
    )
}
