import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Content from "@/components/Content";
import TabNavigation from "@/components/TabNavigation";
import PlusMenu from "@/components/declarations/PlusMenu";
import WaitingForApprovalList from "@/components/dashboard/WaitingForApprovalList";
import RejectionsList from "@/components/dashboard/RejectionsList";
import ActionsGrid from "@/components/dashboard/ActionsGrid";
import {useRouter} from "next/router";

export default function HomePage() {
    const isApprover = process.env.NEXT_PUBLIC_IS_APPROVER === 'true';
    const router = useRouter();
    const query = router.query;
    const name = query?.name;
    const email = query?.email;
    const company = query?.company;

    return <>
        <DashboardHeader/>

        <Content className="">

            <section className="py-16 flex flex-col text-center">
                <h1 className="font-extrabold text-4xl">Welkom {name ?? 'onbekende'}!</h1>
                <small className="mt-4 opacity-50">{email ?? 'anoniempje'}</small>
                <small className="opacity-50">{company ?? 'anoniem bedrijf'}</small>
            </section>
            {isApprover
                ? <WaitingForApprovalList/>
                : <RejectionsList className="mt-8"/>
            }

            <ActionsGrid/>

        </Content>

        <PlusMenu/>

        <TabNavigation/>
    </>
}
