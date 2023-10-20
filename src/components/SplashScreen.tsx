import {useEffect, useState} from "react";
import {wvStart, wvEnd} from "@/components/svg/whitevisionPaths";
import {animate, useMotionValue} from "framer-motion";
import {useFlubber} from "@/hooks/useFlubber";
import {motion} from "framer-motion";

export default function SplashScreen() {
    const paths = [wvStart, wvEnd];
    const [pathIndex, setPathIndex] = useState(0);
    const progress = useMotionValue(pathIndex);
    const path = useFlubber(progress, paths);

    // const interpolator = interpolate(paths[0], paths[1], { maxSegmentLength: 1 });
    useEffect(() => {
        const animation = animate(progress, pathIndex, {
            duration: 0.8,
            ease: "easeInOut",
            onComplete: () => {
                if (pathIndex === paths.length - 1) {
                    progress.set(0);
                    setPathIndex(1);
                } else {
                    setPathIndex(pathIndex + 1);
                }
            }
        });

        return () => animation.stop();
    }, [pathIndex]);

    return <div className="bg-amber-400 fixed inset-0 flex flex-col items-center justify-center">

        <svg width="400" height="400" viewBox="0 0 12000 100">
            <g transform="translate(10 10) scale(17 17)">
                <motion.path fill="white" d={path} />
            </g>
        </svg>

    </div>
}
