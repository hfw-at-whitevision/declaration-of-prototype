import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Content from "@/components/Content";
import TabNavigation from "@/components/TabNavigation";
import PlusMenu from "@/components/declarations/PlusMenu";
import ActionsGrid from "@/components/dashboard/ActionsGrid";
import {useRouter} from "next/router";
import DisplayHeading from "@/components/layout/DisplayHeading";
import {useAtom} from "jotai";
import {primaryColorAtom} from "@/store/generalAtoms";
import {useEffect} from "react";
import {BsFillPersonLinesFill} from "react-icons/bs";
import OverviewHeader from "@/components/layout/OverviewHeader";

export default function HomePage() {
    const isApprover = process.env.NEXT_PUBLIC_IS_APPROVER === 'true';
    const router = useRouter();
    const query = router.query;
    const name = query?.name;
    const email = query?.email;
    const company = query?.company;

    const [primaryColor, setPrimaryColor] = useAtom(primaryColorAtom);
    useEffect(() => {
        setPrimaryColor('bg-amber-400');
    }, []);

    return <>
        <OverviewHeader/>

        <Content className="">

            <button className="rounded-2xl bg-black/10 p-4 text-black/80 relative pl-20">
                <BsFillPersonLinesFill className="absolute top-5 left-4 w-8 h-8"/>

                <span className="flex flex-col text-sm items-start">
                    <span className="font-extrabold">
                        {name ?? 'onbekende'}
                    </span>
                    <span className="font-thin">
                    {email ?? 'geen email'} - {company ?? 'geen bedrijf'}
                    </span>
                </span>
            </button>

            <section className="py-8 flex flex-col">
                <DisplayHeading className="font-extrabold text-3xl">
                    <span className="font-thin mr-2">Welkom</span>
                    {name ?? 'onbekende'}!
                </DisplayHeading>
            </section>
            {/*{isApprover*/}
            {/*    ? <WaitingForApprovalList/>*/}
            {/*    : <RejectionsList className="mt-8"/>*/}
            {/*}*/}

            <ActionsGrid/>

        </Content>

        <TabNavigation/>
    </>
}
