import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Content from "@/components/Content";
import TabNavigation from "@/components/TabNavigation";
import PlusMenu from "@/components/declarations/PlusMenu";
import TilesGrid from "@/components/dashboard/TilesGrid";
import {useRouter} from "next/router";
import DisplayHeading from "@/components/layout/DisplayHeading";
import {useAtom} from "jotai";
import {primaryColorAtom} from "@/store/generalAtoms";
import {useEffect} from "react";
import {
    BsCreditCard2FrontFill,
    BsFillBellFill,
    BsFillLightbulbFill,
    BsFillPatchCheckFill,
    BsFillPersonLinesFill
} from "react-icons/bs";
import OverviewHeader from "@/components/layout/OverviewHeader";
import {environmentCodeAtom, userAtom} from "@/store/authAtoms";
import {RiQrScanFill} from "react-icons/ri";

export default function HomePage() {
    const router = useRouter();
    const isApprover = process.env.NEXT_PUBLIC_IS_APPROVER === 'true';
    const [user] = useAtom(userAtom);
    const {firstName, emailAddress}: any = user ?? {};
    const [environmentCode] = useAtom(environmentCodeAtom);

    const [primaryColor, setPrimaryColor] = useAtom(primaryColorAtom);
    useEffect(() => {
        setPrimaryColor('bg-amber-400');
    }, []);

    const handleProfileClick = (e) => {
        e.preventDefault();
        router.push('/settings');
    }

    return <>
        <OverviewHeader/>

        <Content className="">

            <button className="rounded-2xl bg-black/10 p-4 text-black/80 relative flex flex-row items-center justify-start" onClick={handleProfileClick}>
                <BsFillPersonLinesFill className="w-8 h-8 mr-4"/>

                <span className="flex flex-col text-sm items-start">
                    <span className="font-extrabold">
                        {firstName} <span className="font-thin">({emailAddress})</span>
                    </span>
                    <span className="font-thin">
                        Omgevingscode <span className="font-bold">{environmentCode}</span>
                    </span>
                </span>
            </button>

            <section className="py-8 flex flex-col">
                <DisplayHeading className="font-extrabold text-3xl">
                    <span className="font-thin mr-2">Welkom</span>
                    {firstName ?? 'onbekende'}!
                </DisplayHeading>
            </section>
            {/*{isApprover*/}
            {/*    ? <WaitingForApprovalList/>*/}
            {/*    : <RejectionsList className="mt-8"/>*/}
            {/*}*/}

            <TilesGrid items={[
                {
                    Icon: BsFillPatchCheckFill,
                    route: 'advice',
                    label: 'Goedkeuren & Advies',
                },
                {
                    Icon: BsCreditCard2FrontFill,
                    route: 'declarations',
                    label: 'Declaraties indienen',
                },
                {
                    Icon: RiQrScanFill,
                    route: 'scanpage',
                    label: 'Documenten scannen',
                },
                {
                    Icon: BsFillLightbulbFill,
                    route: 'settings',
                    label: 'Tips & Tricks',
                }
            ]}/>

        </Content>

        <TabNavigation/>
    </>
}
