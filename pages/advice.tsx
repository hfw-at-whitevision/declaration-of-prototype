import OverviewHeader from "@/components/layout/OverviewHeader";
import TabNavigation from "@/components/TabNavigation";
import React, {useEffect} from "react";
import {primaryColorAtom} from "@/store/generalAtoms";
import {useAtom} from "jotai";

export default function AdvicePage() {
    const [primaryColor, setPrimaryColor] = useAtom(primaryColorAtom);
    useEffect(() => {
        setPrimaryColor('bg-green-500');

        return () => {
            setPrimaryColor('bg-amber-400');
        }
    }, []);

    return <>
        <OverviewHeader title={<>Goedkeuren <span className="!font-thin !text-lg ml-1">& advies</span></>}/>

        <TabNavigation/>
    </>
}
