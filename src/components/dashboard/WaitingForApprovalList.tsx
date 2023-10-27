import Card from "@/components/primitives/Card";

export default function WaitingForApprovalList() {
    return <>
        <h2 className="font-extrabold text-2xl">
            Goedkeuring gevraagd
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

            <Card borderLeft={true} borderColor="bg-sky-400">
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

            <Card borderLeft={true} borderColor="bg-sky-400">
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
    </>
}
