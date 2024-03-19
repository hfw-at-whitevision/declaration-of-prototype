import {useRouter} from "next/router";
import Button from "../Button";
import Content from "../Content";
import React, {useEffect, useState} from "react";
import CardInput from '@/components/layout/CardInput';
import {
    createDeclaration, createExpense,
    deleteExpense,
    updateExpense
} from "@/firebase";
import {
    inputModalAtom, loadingAtom, primaryColorAtom,
    scannedImagesAtom,
} from "@/store/generalAtoms";
import {useAtom} from "jotai";
import {Toast} from '@capacitor/toast';
import {LoadingSpinner} from "@/components/Loading";
import SinglePageHeader from "@/components/declarations/SinglePageHeader";
import {Gallery, Item} from 'react-photoswipe-gallery'
import ExpenseAttachmentThumbnail from "@/components/expenses/ExpenseAttachmentThumbnail";
import {Dialog} from "@capacitor/dialog";
import ClaimedInDeclarationCard from "@/components/expenses/ClaimedInDeclaration";

export default function SingleExpense({expense: inputExpense}: any) {
    const [expense, setExpense] = useState(inputExpense);
    const [scannedImages, setScannedImages] = useAtom(scannedImagesAtom);
    const [inputModal, setInputModal] = useAtom(inputModalAtom);
    const [primaryColor, setPrimaryColor] = useAtom(primaryColorAtom);
    const expenseId = useRouter()?.query?.id ?? null;
    const status = 'Bon';
    const router = useRouter();
    const isAlreadyClaimed = expense?.claimedIn?.length > 0;
    let allowEdit = !isAlreadyClaimed ? true : false;

    const [title, setTitle] = useState(expense?.title ?? 'Nieuwe bon');
    const [description, setDescription] = useState(expense?.description);
    const [totalAmount, setTotalAmount] = useState(expense?.totalAmount);
    const [date, setDate] = useState(expense?.date);
    const [category, setCategory] = useState(expense?.category);

    const serializeExpense = (props?: any) => ({
        ...expenseId
            ? {
                // edit declaration
                id: expenseId,
                attachments: expense?.attachments,
            }
            : {
                // new expense
                attachments: expense?.attachments,
            },
        ...title && {title},
        ...description && {description},
        ...totalAmount && {totalAmount: Number(totalAmount)},
        ...category && {category},
        ...date && {date},
        status: props?.status ?? status,
    });

    const [loading, setLoading] = useAtom(loadingAtom);
    const {isLoading} = loading || {};
    const handleSave = async (e: any) => {
        e.preventDefault();
        setLoading({
            isLoading: true,
            message: 'Bon wordt opgeslagen..',
        })

        // update
        if (expenseId) {
            const res = await updateExpense(expenseId, serializeExpense());
        }
        // create
        else {
            const res = await createExpense(serializeExpense());
        }
        // setConfirmationOverlayTitle('Bon opgeslagen.');
        // setShowConfirmationOverlay(true);
        await Toast.show({
            text: 'Bon opgeslagen.',
        });

        setLoading({
            isLoading: false,
        })
        await router.push('/declarations');
    }

    const createDeclarationFromExpense = async () => {
        const isExistingExpense = !!expenseId;
        let currentExpenseId = expenseId;

        console.log('Saving expense');
        const currentExpense = serializeExpense();
        if (!isExistingExpense)
            currentExpenseId = await createExpense(currentExpense);
        console.log('Expense saved. Expense ID: ' + currentExpenseId);

        console.log('Creating new declaration');
        const declarationToSubmit = {
            status: '100',
            title: currentExpense?.title,
            description: currentExpense?.description,
            totalAmount: currentExpense?.totalAmount,
            expenses: [currentExpenseId],
        };
        const newDeclarationId = await createDeclaration(declarationToSubmit);
        console.log('New declaration created. Declaration ID: ' + newDeclarationId);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (isAlreadyClaimed) {
            const {value} = await Dialog.confirm({
                title: 'Reeds ingediend',
                message: 'Deze bon is reeds ingediend in een declaratie. Weet je zeker dat je deze bon opnieuw wilt indienen?',
            });
            if (!value) return;
        }

        await createDeclarationFromExpense();
        // setConfirmationOverlayTitle('Declaratie succesvol ingediend.');
        // setShowConfirmationOverlay(true);
        await Toast.show({
            text: 'Declaratie succesvol ingediend.'
        });
        setScannedImages([]);
        await router.push('/declarations');
    }

    const handleDelete = async (e: any) => {
        e.preventDefault();
        const {value} = await Dialog.confirm({
            title: 'Bon verwijderen',
            message: 'Weet je zeker dat je deze bon wilt verwijderen?',
        });
        if (!value) return;
        await deleteExpense(expenseId);
        await Toast.show({
            text: 'Bon verwijderd.',
        });
        await router.push('/declarations');
    }

    useEffect(() => {
        setPrimaryColor('bg-gray-100');

        return () => {
            setPrimaryColor('bg-amber-400');
        }
    }, []);

    return (
        <Content>
            <div className="mt-8 grid gap-2 text-xs">

                <SinglePageHeader status={status}/>

                <div className="my-4 space-y-2 rounded-md">
                    <label
                        className="text-xl font-extrabold focus:outline-2 outline-amber-400 break-all w-full h-auto overflow-hidden text-left"
                    >
                        {title ?? <span className="opacity-25">Nieuwe uitgave</span>}
                    </label>

                    <div className="flex flex-row justify-between items-center text-lg">
                        <span className="flex flex-row">
                            €{totalAmount}
                        </span>

                        <span>
                        </span>
                    </div>

                    <div className="flex flex-row justify-between items-center text-xs opacity-50">
                        <span>

                        </span>

                        <span>
                            {date}
                        </span>
                    </div>
                </div>

                {/* reeds ingediend in declaraties */}
                {isAlreadyClaimed
                    && <section className="rounded-md grid gap-2 grid-cols-1 relative pt-4 w-full mt-0 mb-8">
                        <span className={
                            isAlreadyClaimed
                                ? 'absolute top-0 left-0 text-[10px] opacity-50'
                                : ''
                        }>
                            Ingediend in de volgende declaraties:
                        </span>

                        {expense?.claimedIn?.map((declarationId: any, i: any) =>
                            <ClaimedInDeclarationCard declarationId={declarationId} key={declarationId + i}/>
                        )}
                    </section>
                }

                <CardInput
                    allowEdit={allowEdit}
                    value={title}
                    onConfirm={(value: string) => setTitle(value)}
                    label="Titel"
                    title='Voer een titel in:'
                />

                <CardInput
                    allowEdit={allowEdit}
                    value={description}
                    onConfirm={(value: string) => setDescription(value)}
                    label="Omschrijving"
                    title='Voer een omschrijving in:'
                />

                <CardInput
                    allowEdit={allowEdit}
                    value={totalAmount}
                    onConfirm={(value: number) => setTotalAmount(value)}
                    label="Totaalbedrag"
                    title='Voer een bedrag in:'
                    type='number'
                />

                <CardInput
                    allowEdit={allowEdit}
                    value={category}
                    onConfirm={(value: string) => setCategory(value)}
                    label="Categorie"
                    title='Voer een categorie in:'
                    type='select'
                    options={['voeding', 'kleding', 'transport', 'accomodatie', 'overig']}
                />

                <CardInput
                    allowEdit={allowEdit}
                    value={date}
                    onConfirm={(value: any) => setDate(value)}
                    label="Datum"
                    title='Datum van uitgave:'
                    type='date'
                />

                <div className="bg-white rounded-md p-4 grid gap-2 grid-cols-3 relative pt-5">
                    <span className={
                        expense?.attachments?.length
                            ? 'absolute top-1 left-4 text-[10px] opacity-50'
                            : 'Bijlagen'
                    }>
                        Bijlagen
                    </span>

                    <Gallery>
                        {expense?.attachments?.map((attachment: any, i: any) => (
                            <ExpenseAttachmentThumbnail key={attachment + i} imageUrl={attachment}/>
                        ))}
                    </Gallery>


                </div>

                {/* action buttons */}
                <div className="flex flex-row justify-between items-center gap-2">
                    {allowEdit
                        && <Button
                            rounded="full"
                            secondary
                            padding='small'
                            fullWidth
                            onClick={handleSave}
                            disabled={isLoading}
                        >
                            {isLoading &&
                                <span className="absolute inset-0 flex items-center justify-center">
                                        <LoadingSpinner className="w-5 h-5"/>
                                    </span>
                            }
                            <span className={`!transition-none ${isLoading ? 'opacity-0' : ''}`}>
                                    Opslaan
                                </span>
                        </Button>
                    }

                    <Button
                        primary
                        rounded="full"
                        padding='small'
                        fullWidth
                        onClick={handleSubmit}
                    >
                        {isAlreadyClaimed ? 'Opnieuw indienen' : 'Indienen'}
                    </Button>
                </div>

                <Button
                        tertiary
                        padding='small'
                        rounded="full"
                        fullWidth
                        onClick={handleDelete}
                    >
                        Verwijderen
                    </Button>
            </div>

            {/*<pre className="break-all overflow-x-auto">*/}
            {/*    {JSON.stringify(expense, null, 2)}*/}

            {/*    {JSON.stringify(scannedImages, null, 2)}*/}
            {/*</pre>*/}
        </Content>
    )
}
