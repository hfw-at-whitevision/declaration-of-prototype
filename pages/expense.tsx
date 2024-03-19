import {getExpense} from "@/firebase";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import SingleExpense from "@/components/expenses/SingleExpense";
import {useAtom} from "jotai";
import {loadingAtom, primaryColorAtom, scannedImagesAtom} from "@/store/generalAtoms";

export default function SingleExpensePage() {
    const router = useRouter();
    const {id, title, description, totalAmount, date} = router.query || {};
    const [expense, setExpense]: any = useState(null);
    const [loading, setLoading] = useAtom(loadingAtom);
    const {isLoading} = loading || {};
    const [, setPrimaryColor]  = useAtom(primaryColorAtom);
    const [scannedImages] = useAtom(scannedImagesAtom);
    const isCreatingNewExpense = !id;

    useEffect(() => {
        if (!router.isReady) return;
        setLoading({
            isLoading: true,
            message: 'Bon aan het laden..'
        });

        // if we are creating a new expense
        if (isCreatingNewExpense) setExpense({
            title,
            description,
            totalAmount,
            date,
            attachments: scannedImages,
        });
        // opening an existing expense
        else getExpense(id).then((item: any) => {
            setExpense(item);
        });

        setLoading({
            isLoading: false,
        });
    }, [id, router.isReady]);

    useEffect(() => {
        setPrimaryColor('bg-gray-50');

        return () => {
            setPrimaryColor('bg-amber-400');
        }
    }, []);

    useEffect(() => {
        if (!expense) setLoading({
            isLoading: true,
            message: 'Bon aan het laden..'
        });
        else setLoading({
            isLoading: false,
        });
    }, [expense]);

    if (isLoading) return null;
    return <SingleExpense expense={expense}/>
}
