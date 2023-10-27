import Card from "@/components/primitives/Card";
import Button from "@/components/Button";
import {BsArrowRight} from "react-icons/bs";
import {useRouter} from "next/router";

export default function RejectionsList({className = ''}) {
    const router = useRouter();
    return <section className={`flex flex-col gap-2 ${className}`}>
        <h2 className="font-extrabold text-2xl">
            Afgekeurd
        </h2>
        <section className="grid gap-2">
            <Card borderLeft={true} borderColor="bg-amber-400">
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

            <Card borderLeft={true} borderColor="bg-amber-400">
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
        {/*<Button*/}
        {/*    rounded="full"*/}
        {/*    padding="small"*/}
        {/*    icon={<BsArrowRight className="w-5 h-5"/>}*/}
        {/*    onClick={() => router.push('/declarations')}*/}
        {/*>*/}
        {/*    Bekijk alle documenten*/}
        {/*</Button>*/}
    </section>
}
