import {useRouter} from "next/router";
import {BsArrowLeft} from "react-icons/bs";
import Button from "../Button";
import Content from "../Content";
import {useEffect, useState} from "react";
import {createDeclaration, deleteDeclaration, getDeclarationAttachments, updateDeclaration} from "@/firebase";
import {
    inputModalAtom,
    scannedImagesAtom,
} from "@/store/atoms";
import {useAtom} from "jotai";
import {Toast} from '@capacitor/toast';
import {LoadingSpinner} from "@/components/Loading";

export default function DeclarationScreen({declaration: inputDeclaration}: any) {
    const [declaration, setDeclaration] = useState(inputDeclaration);
    const [scannedImages, setScannedImages] = useAtom(scannedImagesAtom);
    const [inputModal, setInputModal] = useAtom(inputModalAtom);
    const declarationId = useRouter()?.query?.id ?? null;
    const status = declaration?.status ?? 'concept';
    const router = useRouter();
    const allowEdit =
        status !== 'goedgekeurd'
        && status !== 'ingediend';

    const [name, setName] = useState(declaration?.name);
    const [description, setDescription] = useState(declaration?.description);
    const [amount, setAmount] = useState(declaration?.amount);
    const [currency, setCurrency] = useState(declaration?.currency);
    const [category, setCategory] = useState(declaration?.category);
    const [vat, setVat] = useState(declaration?.vat);
    const [paymentMethod, setPaymentMethod] = useState(declaration?.paymentMethod);
    const [attachments, setAttachments] = useState(declaration?.attachments);

    const serializeDeclaration = (props?: any) => ({
        ...declarationId
            ? {
                // edit declaration
                id: declarationId,
                attachments: declaration?.attachments,
            }
            : {
                // new declaration
                attachments: declaration?.attachments,
            },
        ...name && {name},
        ...description && {description},
        ...amount && {amount},
        ...currency && {currency},
        ...category && {category},
        ...vat && {vat},
        ...paymentMethod && {paymentMethod},
        status: props?.status ?? status,
    });

    const [isSaving, setIsSaving] = useState(false);
    const handleSave = async (e: any) => {
        e.preventDefault();
        setIsSaving(true);

        // update
        if (declarationId) {
            const res = await updateDeclaration(declarationId, serializeDeclaration());
        }
        // create
        else {
            const res = await createDeclaration(serializeDeclaration());
        }
        // setConfirmationOverlayTitle('Bon opgeslagen.');
        // setShowConfirmationOverlay(true);
        await Toast.show({
            text: 'Declaratie opgeslagen.',
        });

        setIsSaving(false);
        await router.push('/');
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (declarationId) {
            await updateDeclaration(declarationId, serializeDeclaration({
                status: 'ingediend',
            }));
        } else {
            await createDeclaration(serializeDeclaration({
                status: 'ingediend',
            }));
        }
        // setConfirmationOverlayTitle('Declaratie succesvol ingediend.');
        // setShowConfirmationOverlay(true);
        await Toast.show({
            text: 'Declaratie succesvol ingediend.'
        });
        setScannedImages([]);
        await router.push('/');
    }

    const handleDelete = async (e: any) => {
        e.preventDefault();
        await deleteDeclaration(declarationId);
        await Toast.show({
            text: 'Declaratie verwijderd.',
        });
        await router.push('/');
    }

    useEffect(() => {
        if (!scannedImages?.length || !router.isReady) return;
        setDeclaration((oldDeclaration: any) => ({
            ...oldDeclaration,
            attachments: scannedImages,
        }));

        return () => {
            setScannedImages([]);
        }
    }, [router.pathname, router.asPath, scannedImages, router.isReady]);

    useEffect(() => {
        if (!declarationId) return;
        getDeclarationAttachments(declarationId, declaration?.attachments)
            .then((attachments: any) => {
                setScannedImages(attachments);
            });
    }, [declarationId]);

    return (
        <Content>
            <div className="mt-8 grid gap-2 text-xs">

                <div className="w-full justify-between items-center flex">
                    <Button
                        secondary
                        padding='small'
                        onClick={() => router.push('/declarations')}
                        className="!rounded-full"
                    >
                        <BsArrowLeft className="w-4 h-4"/>
                        Terug
                    </Button>

                    <Button
                        primary
                        padding='small'
                        className={`
                        ${status === 'ingediend' ? '!bg-green-600' : undefined}
                        ${status === 'afgekeurd' ? '!bg-red-600' : undefined}
                        h-full !rounded-full
                    `}>
                        {status}
                    </Button>
                </div>

                <div className="bg-white p-4 space-y-2 rounded-md">
                    <button
                        disabled={!allowEdit}
                        className="text-xl font-extrabold focus:outline-2 outline-amber-400 break-all w-full h-auto overflow-hidden cursor-pointer text-left"
                        onClick={() => setInputModal({
                            show: true,
                            title: 'Voer een naam in:',
                            type: 'text',
                            defaultValue: name,
                            onConfirm: (value: string) => setName(value),
                        })}
                    >
                        {name ?? <span className="opacity-25">Nieuwe uitgave</span>}
                    </button>

                    <div className="flex flex-row justify-between items-center text-lg">
                        <span className="flex flex-row">
                            {amount} {currency}
                        </span>

                        <span>
                        </span>
                    </div>

                    <div className="flex flex-row justify-between items-center text-xs opacity-50">
                        <span>
                            DECL-18992/565
                        </span>

                        <span>
                            08-06-1992
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-md p-4 grid gap-2 grid-cols-3 relative pt-5">
                    <span className={
                        declaration?.attachments?.length
                            ? 'absolute top-1 left-4 text-[10px] opacity-50'
                            : 'Bijlagen'
                    }>
                        Bijlagen
                    </span>

                    {declaration?.attachments?.map((image: any) => (
                        <img
                            key={image}
                            src={image}
                            className="w-full h-[100px] p-2 object-contain rounded-md border-2 border-amber-400"
                        />
                    ))}
                </div>

                <button
                    disabled={!allowEdit}
                    className="bg-white py-6 text-sm rounded-md p-4 cursor-pointer relative text-left"
                    onClick={() => setInputModal({
                        ...inputModal,
                        show: true,
                        title: 'Voer een omschrijving in:',
                        type: 'text',
                        defaultValue: description,
                        onConfirm: (value: string) => setDescription(value),
                    })}
                >
                    <InputLabel label={'Omschrijving'} value={description}/>
                </button>

                <button
                    disabled={!allowEdit}
                    className="bg-white py-6 text-sm rounded-md p-4 cursor-pointer relative text-left"
                    onClick={() => setInputModal({
                        ...inputModal,
                        show: true,
                        title: 'Voer een categorie in:',
                        type: 'select',
                        options: ['voeding', 'kleding', 'transport', 'accomodatie', 'overig'],
                        defaultValue: category,
                        onConfirm: (value: number) => setCategory(value),
                    })}
                >
                    <InputLabel label={'Categorie'} value={category}/>
                </button>

                <button
                    disabled={!allowEdit}
                    className="bg-white py-6 text-sm rounded-md p-4 cursor-pointer relative text-left"
                    onClick={() => setInputModal({
                        ...inputModal,
                        show: true,
                        title: 'Voer een bedrag in:',
                        type: 'number',
                        defaultValue: amount,
                        onConfirm: (value: number) => setAmount(value),
                    })}
                >
                    <InputLabel label={'Bedrag'} value={amount}/>
                </button>

                <button
                    disabled={!allowEdit}
                    className="bg-white py-6 text-sm rounded-md p-4 cursor-pointer relative text-left"
                    onClick={() => setInputModal({
                        ...inputModal,
                        show: true,
                        title: 'Voer een valuta in:',
                        type: 'select',
                        options: ['EUR', 'USD', 'GBP'],
                        defaultValue: currency,
                        onConfirm: (value: string) => setCurrency(value),
                    })}
                >
                    <InputLabel label={'Valuta'} value={currency}/>
                </button>

                <button
                    disabled={!allowEdit}
                    className="bg-white py-6 text-sm rounded-md p-4 cursor-pointer relative text-left"
                    onClick={() => setInputModal({
                        ...inputModal,
                        show: true,
                        title: 'Voer een BTW percentage in:',
                        type: 'select',
                        options: ['0%', '9%', '21%'],
                        defaultValue: vat,
                        onConfirm: (value: number) => setVat(value),
                    })}
                >
                    <InputLabel label={'BTW percentage'} value={vat}/>
                </button>

                <button
                    disabled={!allowEdit}
                    className="bg-white py-6 text-sm rounded-md p-4 relative cursor-pointer text-left"
                    onClick={() => setInputModal({
                        ...inputModal,
                        show: true,
                        title: 'Voer een betaalmethode in:',
                        type: 'select',
                        options: ['cash', 'pin', 'creditcard'],
                        defaultValue: paymentMethod,
                        onConfirm: (value: string) => setPaymentMethod(value),
                    })}
                >
                    <InputLabel label={'Betaalmethode'} value={paymentMethod}/>
                </button>

                {allowEdit
                    ? <>
                        <div className="flex flex-row justify-between items-center gap-2">
                            <Button
                                secondary
                                padding='small'
                                fullWidth
                                onClick={handleSave}
                                className="shadow-md"
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
                                className="shadow-md"
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
                    : null}
            </div>

            <pre className="break-all overflow-x-auto hidden">
                {JSON.stringify(declaration, null, 2)}
            </pre>
        </Content>
    )
}

const InputLabel = (props: any) => {
    return <>
        <span className={
            props?.value
                ? 'absolute top-1 text-[10px] opacity-50'
                : 'opacity-50'
        }>
            {props.label}
        </span>
        {props.value}
    </>
}
