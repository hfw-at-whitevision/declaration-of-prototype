import {useRouter} from "next/router";
import Button from "../Button";
import Content from "../Content";
import {useEffect, useState} from "react";
import {
    createDeclaration, createExpense,
    deleteDeclaration, deleteExpense,
    getExpenseAttachments,
    updateDeclaration,
    updateExpense
} from "@/firebase";
import {
    inputModalAtom,
    scannedImagesAtom,
} from "@/store/atoms";
import {useAtom} from "jotai";
import {Toast} from '@capacitor/toast';
import {LoadingSpinner} from "@/components/Loading";
import SinglePageHeader from "@/components/declarations/SinglePageHeader";

export default function SingleExpense({expense: inputExpense}: any) {
    const [expense, setExpense] = useState(inputExpense);
    const [scannedImages, setScannedImages] = useAtom(scannedImagesAtom);
    const [inputModal, setInputModal] = useAtom(inputModalAtom);
    const expenseId = useRouter()?.query?.id ?? null;
    const status = 'Bon';
    const router = useRouter();
    const allowEdit = true;

    const [title, setTitle] = useState(expense?.title ?? 'Nieuwe bon');
    const [description, setDescription] = useState(expense?.description);
    const [totalAmount, setTotalAmount] = useState(expense?.totalAmount);
    const [date, setDate] = useState(expense?.date);
    const [category, setCategory] = useState(expense?.category);
    const [attachments, setAttachments] = useState(expense?.attachments);

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

    const [isSaving, setIsSaving] = useState(false);
    const handleSave = async (e: any) => {
        e.preventDefault();
        setIsSaving(true);

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

        setIsSaving(false);
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
        await deleteExpense(expenseId);
        await Toast.show({
            text: 'Bon verwijderd.',
        });
        await router.push('/declarations');
    }

    useEffect(() => {
        if (!scannedImages?.length || !router.isReady) return;
        setExpense((oldDeclaration: any) => ({
            ...oldDeclaration,
            attachments: scannedImages,
        }));

        return () => {
            setScannedImages([]);
        }
    }, [router.pathname, router.asPath, scannedImages, router.isReady]);

    useEffect(() => {
        if (!expenseId) return;
        console.log('Fetching expense attachments: ', expense);
        getExpenseAttachments(expense?.attachments)
            .then((attachments: any) => {
                setScannedImages(attachments);
            });
    }, [expenseId]);

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
                    onConfirm={(value) => setDate(value)}
                    label="Datum"
                    title='Datum van uitgave:'
                    type='date'
                />

                {/*<CardInput*/}
                {/*    allowEdit={allowEdit}*/}
                {/*    value={currency}*/}
                {/*    onConfirm={(value: string) => setCurrency(value)}*/}
                {/*    label="Valuta"*/}
                {/*    title='Voer een valuta in:'*/}
                {/*    type='select'*/}
                {/*    options={['EUR', 'USD', 'GBP']}*/}
                {/*/>*/}

                {/*<CardInput*/}
                {/*    allowEdit={allowEdit}*/}
                {/*    value={vat}*/}
                {/*    onConfirm={(value: number) => setVat(value)}*/}
                {/*    label="BTW percentage"*/}
                {/*    title='Voer een BTW percentage in:'*/}
                {/*    type='select'*/}
                {/*    options={['0%', '9%', '21%']}*/}
                {/*/>*/}

                {/*<CardInput*/}
                {/*    allowEdit={allowEdit}*/}
                {/*    value={paymentMethod}*/}
                {/*    onConfirm={(value: string) => setPaymentMethod(value)}*/}
                {/*    label="Betaalmethode"*/}
                {/*    title='Voer een betaalmethode in:'*/}
                {/*    type='select'*/}
                {/*    options={['cash', 'pin', 'creditcard']}*/}
                {/*/>*/}

                <div className="bg-white rounded-md p-4 grid gap-2 grid-cols-3 relative pt-5">
                    <span className={
                        expense?.attachments?.length
                            ? 'absolute top-1 left-4 text-[10px] opacity-50'
                            : 'Bijlagen'
                    }>
                        Bijlagen
                    </span>

                    {expense?.attachments?.map((image: any) => (
                        <img
                            key={image}
                            src={image}
                            className="w-full h-[100px] p-2 object-contain rounded-md border-2 border-amber-400"
                            fetchPriority="high"
                        />
                    ))}
                </div>

                {/* action buttons */}
                {allowEdit
                    && <>
                        <div className="flex flex-row justify-between items-center gap-2">
                            <Button
                                secondary
                                padding='small'
                                fullWidth
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving &&
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <LoadingSpinner className="w-5 h-5"/>
                                    </span>
                                }
                                <span className={`!transition-none ${isSaving ? 'opacity-0' : ''}`}>
                                    Opslaan
                                </span>
                            </Button>

                            <Button
                                primary
                                padding='small'
                                fullWidth
                                onClick={handleSubmit}
                            >
                                Indienen
                            </Button>
                        </div>

                        <Button
                            tertiary
                            padding='small'
                            fullWidth
                            onClick={handleDelete}
                        >
                            Verwijderen
                        </Button>
                    </>
                }
            </div>

            <pre className="break-all overflow-x-auto hidden">
                {JSON.stringify(expense, null, 2)}
            </pre>
        </Content>
    )
}

const CardInput = (
    {
        allowEdit,
        value,
        onConfirm,
        type = 'text',
        label,
        title,
        options,
    }
) => {
    const [inputModal, setInputModal] = useAtom(inputModalAtom);
    return (
        <button
            disabled={!allowEdit}
            className="bg-white py-6 text-sm rounded-md p-4 cursor-pointer relative text-left"
            onClick={() => setInputModal({
                ...inputModal,
                show: true,
                title: title ?? label,
                type: type,
                defaultValue: value,
                onConfirm,
                options,
            })}
        >

            <span className={(value)
                ? 'absolute top-1 text-[10px] opacity-50'
                : 'opacity-50'
            }>
                {label}
            </span>
            {value}

        </button>
    )
}
