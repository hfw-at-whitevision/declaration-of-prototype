import SingleDeclaration from "@/components/declarations/SingleDeclaration";
import {getDeclaration, getExpense} from "@/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
// import useDocbase from "@/hooks/useDocbase";

export default function DeclarationScreenPage() {
    const router = useRouter();
    const id = router.query?.id ?? null;
    const [declaration, setDeclaration]: any = useState(null);
    const { createFromExpenses } = router.query;
    const isCreatingFromExpenses = (createFromExpenses) ? createFromExpenses?.length > 0 : false;
    // const {getDocbasePdf} = useDocbase();

    useEffect(() => {
        if (!router.isReady) return;

        // if we are viewing an existing declaration
        if (!!id) getDeclaration(id).then(async (declaration: any) => {
            const expensePromises = declaration?.expenses?.map((expenseId: any) => getExpense(expenseId));
            // const pdfBase64 = await getDocbasePdf(declaration?.docbaseId);
            const expenses = await Promise.all(expensePromises);
            setDeclaration({
                ...declaration,
                expenses,
                // pdfBase64,
            });
        });
        // if we are creating a declaration from selected expenses
        else if (isCreatingFromExpenses) {
            const expensesArray = createFromExpenses?.toString()?.split(',') ?? [];
            let declarationToCreate = {
                title: 'Nieuwe declaratie',
                description: '',
                expenses: [],
                totalAmount: 0,
            };

            // get the expenses
            const promises = expensesArray?.map((id: string) => getExpense(id));
            Promise.all(promises).then((expensesResponse: any) => {
                let totalAmount = 0;
                expensesResponse.map((expense: any) => (expense?.totalAmount) ? totalAmount += expense?.totalAmount : null);
                declarationToCreate.expenses = expensesResponse;
                declarationToCreate.description = expensesResponse.map((expense: any) => expense?.title).join(', ');
                declarationToCreate.totalAmount = totalAmount;
                console.log('Creating a new declaration from expenses', declarationToCreate);
                setDeclaration(declarationToCreate);
            });
            return;
        }
    }, [id, router.isReady, createFromExpenses]);

    if (!declaration || !createFromExpenses && !id) return <Loading />
    return <SingleDeclaration declaration={declaration} />
}
