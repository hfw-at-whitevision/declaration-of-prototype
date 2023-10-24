import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Content from "@/components/Content";
import Card from "@/components/primitives/Card";
import Button from "@/components/Button";
import {BsArrowRight} from "react-icons/bs";
import {BiImport, BiScan} from "react-icons/bi";
import {useRouter} from "next/router";
import {CiBookmarkCheck, CiFileOn, CiReceipt, CiSettings} from "react-icons/ci";
import TabBar from "@/components/TabBar";

export default function HomePage() {
    const router = useRouter();
    return <>
        <DashboardHeader/>

        <Content className="">

            <section className="py-16 flex flex-col text-center">
                <h1 className="font-bold text-4xl">Welkom Heinz!</h1>
                <small className="mt-4 opacity-50">heinz@hotmail.com</small>
                <small className="opacity-50">12345 Bouwbedrijf de Steen</small>
            </section>

            <h2 className="font-bold text-2xl">
                Goedkeuren & advies
            </h2>
            <section className="grid gap-2">
                <Card borderLeft={true} borderColor="amber-400">
                    <span className="font-bold">
                        Hotel
                        <br/>
                        <span className="font-normal opacity-50">
                            Declaratie
                        </span>
                    </span>
                    <span>
                        €120,00
                    </span>
                </Card>

                <Card borderLeft={true} borderColor="sky-400">
                    <span className="font-bold">
                        Gimini Consultancy & Financial Advice
                        <br/>
                        <span className="font-normal opacity-50">
                            Factuur
                        </span>
                    </span>
                    <span>
                        €325.999,69
                    </span>
                </Card>

                <Card borderLeft={true} borderColor="sky-400">
                    <span className="font-bold">
                        Holten Voorburg
                        <br/>
                        <span className="font-normal opacity-50">
                            Factuur
                        </span>
                    </span>
                    <span>
                        €50.000
                    </span>
                </Card>

                <Card borderLeft={true} borderColor="amber-400">
                    <span className="font-bold">
                        Albert Heijn
                        <br/>
                        <span className="font-normal opacity-50">
                            Declaratie
                        </span>
                    </span>
                    <span>
                        €50.000
                    </span>
                </Card>
            </section>
            <Button
                rounded="full"
                padding="small"
                icon={<BsArrowRight className="w-5 h-5"/>}
                onClick={() => router.push('/declarations')}
            >
                Bekijk alle documenten
            </Button>

            <section className="flex flex-row gap-2 w-full mt-16">
                <button
                    className="rounded-2xl bg-white shadow-md p-8 text-sm font-bold flex-1 flex flex-col justify-center items-center gap-2">
                    <BiImport className="w-12 h-12" strokeWidth={0.1}/>
                    Importeer
                </button>

                <button
                    className="rounded-2xl bg-white shadow-md p-8 text-sm font-bold flex-1 flex flex-col justify-center items-center gap-2">
                    <BiScan className="w-12 h-12"/>
                    Scannen
                </button>
            </section>

        </Content>

        <TabBar />
    </>
}
