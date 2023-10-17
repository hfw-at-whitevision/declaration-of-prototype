import DeclarationScreen from "@/components/screens/DeclarationScreen";
import { getDeclaration } from "@/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function DeclarationScreenPage() {
    const router = useRouter();
    const id = router.query?.id ?? null;
    const [declaration, setDeclaration] = useState(null);

    useEffect(() => {
        if (!id) return;
        getDeclaration(id).then((declaration: any) => {
            setDeclaration(declaration);
        });
    }, [id]);

    if (id && !declaration) return <Loading />
    return <DeclarationScreen declaration={declaration}/>
}
