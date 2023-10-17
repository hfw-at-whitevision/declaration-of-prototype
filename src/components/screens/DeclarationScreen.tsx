import router, {useRouter} from "next/router";
import {BsArrowLeft} from "react-icons/bs";
import Button from "../Button";
import Content from "../Content";
import {useEffect, useState} from "react";
import {createDeclaration, createNotification, deleteDeclaration, updateDeclaration} from "@/firebase";
import {
    confirmationOverlayTitleAtom,
    inputModalAtom,
    scannedImagesAtom,
    showConfirmationOverlayAtom
} from "@/store/atoms";
import {useAtom} from "jotai";

export default function DeclarationScreen({declaration: inputDeclaration}: any) {
    const [declaration, setDeclaration] = useState(inputDeclaration);
    const [, setShowConfirmationOverlay] = useAtom(showConfirmationOverlayAtom);
    const [, setConfirmationOverlayTitle] = useAtom(confirmationOverlayTitleAtom);
    const [scannedImages, setScannedImages] = useAtom(scannedImagesAtom);
    const [inputModal, setInputModal] = useAtom(inputModalAtom);
    const declarationId = useRouter()?.query?.id ?? null;
    const status = declaration?.status ?? 'concept';
    const router = useRouter();

    const [name, setName] = useState(declaration?.name);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(declaration?.amount);
    const [currency, setCurrency] = useState(declaration?.currency);
    const [category, setCategory] = useState(declaration?.category);
    const [vat, setVat] = useState(declaration?.vat);
    const [paymentMethod, setPaymentMethod] = useState(declaration?.paymentMethod);

    const onInputChange = (e: any) => {
        const {name, value} = e.target;
        setDeclaration((oldDeclaration: any) => ({
            ...oldDeclaration,
            [name]: (name === 'amount') ? parseInt(value) : value,
        }));
    }

    const handleSave = async (e: any) => {
        e.preventDefault();

        // update
        if (declarationId) {
            const res = await updateDeclaration(declarationId, declaration);
        }
        // create
        else {
            const res = await createDeclaration({
                ...declaration,
                status: status,
            });
        }
        setConfirmationOverlayTitle('Bon opgeslagen.');
        setShowConfirmationOverlay(true);
        router.push('/');
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (declarationId) {
            await updateDeclaration(declarationId, {
                ...declaration,
                name,
                description,
                amount,
                attachments: scannedImages,
                status: 'ingediend',
            });
        } else {
            await createDeclaration({
                ...declaration,
                attachments: scannedImages,
                status: 'ingediend',
            });
        }

        // await createNotification({
        //     message: `Declaratie <b>${declaration.name}</b> is succesvol ingediend.`,
        // });
        setConfirmationOverlayTitle('Declaratie succesvol ingediend.');
        setShowConfirmationOverlay(true);
        setScannedImages([]);
        router.push('/');
    }

    const handleDelete = async (e: any) => {
        e.preventDefault();
        await deleteDeclaration(declarationId);
        router.push('/');
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

    return (
        <Content>
            <div className="grid gap-2 text-xs">

                <div className="w-full justify-between items-center flex">
                    <Button
                        secondary
                        padding='small'
                        onClick={() => router.push('/')}
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
                        h-full !rounded-full
                    `}>
                        {status}
                    </Button>
                </div>

                <div className="bg-white p-4 space-y-2 rounded-md">
                    <span
                        className="text-xl font-extrabold focus:outline-2 outline-amber-400 break-all w-full h-auto overflow-hidden cursor-pointer"
                        onClick={() => setInputModal({
                            show: true,
                            title: 'Voer een naam in:',
                            type: 'text',
                            defaultValue: name,
                            onConfirm: (value: string) => setName(value),
                        })}
                    >
                        {name ?? 'Nieuwe uitgave'}
                    </span>

                    <div className="flex flex-row justify-between items-center">
                        <span className="flex flex-row">
                            {currency}
                            {amount}
                        </span>

                        <span>
                            {declaration?.date}
                        </span>
                    </div>
                </div>

                <div className="bg-white rounded-md p-4 grid gap-2 grid-cols-2 relative pt-5">
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
                            className="w-full h-auto object-contain rounded-md border-2 border-amber-400"
                        />
                    ))}
                </div>

                <div
                    className="bg-white py-6 text-sm rounded-md p-4 cursor-pointer relative"
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
                </div>

                <div
                    className="bg-white py-6 text-sm rounded-md p-4 cursor-pointer relative"
                    onClick={() => setInputModal({
                        ...inputModal,
                        show: true,
                        title: 'Voer een categorie in:',
                        type: 'text',
                        defaultValue: category,
                        onConfirm: (value: number) => setCategory(value),
                    })}
                >
                    <InputLabel label={'Categorie'} value={category}/>
                </div>

                <div
                    className="bg-white py-6 text-sm rounded-md p-4 cursor-pointer relative"
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
                </div>

                <div
                    className="bg-white py-6 text-sm rounded-md p-4 cursor-pointer relative"
                    onClick={() => setInputModal({
                        ...inputModal,
                        show: true,
                        title: 'Voer een valuta in:',
                        type: 'text',
                        defaultValue: currency,
                        onConfirm: (value: string) => setCurrency(value),
                    })}
                >
                    <InputLabel label={'Valuta'} value={currency}/>
                </div>

                <div
                    className="bg-white py-6 text-sm rounded-md p-4 cursor-pointer relative"
                    onClick={() => setInputModal({
                        ...inputModal,
                        show: true,
                        title: 'Voer een BTW percentage in:',
                        type: 'text',
                        defaultValue: vat,
                        onConfirm: (value: number) => setVat(value),
                    })}
                >
                    <InputLabel label={'BTW percentage'} value={vat}/>
                </div>

                <div
                    className="bg-white py-6 text-sm rounded-md p-4 relative cursor-pointer"
                    onClick={() => setInputModal({
                        ...inputModal,
                        show: true,
                        title: 'Voer een betaalmethode in:',
                        type: 'text',
                        defaultValue: paymentMethod,
                        onConfirm: (value: string) => setPaymentMethod(value),
                    })}
                >
                    <InputLabel label={'Betaalmethode'} value={paymentMethod}/>
                </div>

                <div className="flex flex-row justify-between items-center gap-2">
                    <Button
                        secondary
                        padding='small'
                        fullWidth
                        onClick={handleSave}
                    >
                        Opslaan
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
