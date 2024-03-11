import {useDeclaration} from "@/hooks/useDeclaration";
import DeclarationCard from "@/components/declarations/DeclarationCard";
import React from "react";
import {useRouter} from "next/router";

export default function ClaimedInDeclarationCard({declarationId}) {
    const router = useRouter();
    const {data: declaration} = useDeclaration({declarationId});
    return <DeclarationCard
        key={declarationId}
        declaration={declaration}
        onClick={() => router.push(`/declaration?id=${declarationId}`)}
    />
}
