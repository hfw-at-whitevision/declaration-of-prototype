// @ts-ignore
import { interpolate } from 'flubber';
import React, { useState, useEffect } from 'react'
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';

export default function SVGMorph({paths}: any) {

    const [pathIndex, setPathIndex] = useState(0);
    const progress = useMotionValue(pathIndex);

    const arrayOfIndex = paths.map( (_: any, i: any) => i )
    const path = useTransform(progress, arrayOfIndex, paths, {
        mixer: (a, b) => interpolate(a, b, {maxSegmentLength: 1})
    })

    useEffect( () => {
        const animation = animate(progress, pathIndex, {
            duration: 0.4,
            ease: "easeInOut",
            delay: 0.5,
            onComplete: () => {
                if(pathIndex === paths.length - 1){
                    progress.set(1);
                    setPathIndex(1);
                }
                else{
                    setPathIndex(pathIndex + 1);
                }
            }
        })
        return () => {animation.stop()}
    }, [pathIndex])

    return (
        <motion.path fill="white" d={path}/>
    )
}
