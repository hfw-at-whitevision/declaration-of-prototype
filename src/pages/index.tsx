import {useAtom} from 'jotai'
import {
    currentTabIndexAtom,
    declarationsAtom, notificationsAtom,
    searchQueryAtom,
    showOverlayAtom,
} from '@/store/atoms'
import React, {useEffect, useState} from 'react';
import {deleteDeclaration, getDeclarations} from '@/firebase';
import DeclarationCard from '@/components/DeclarationCard';
import SearchSortBar from '@/components/SearchSortBar';
import Header, {tabs} from '@/components/Header';
import Content from '@/components/Content';
import {useRouter} from 'next/router';
import Overlay from "@/components/overlays/Overlay";
import {motion} from "framer-motion";
import Button from '@/components/Button';
import {Haptics} from '@capacitor/haptics';
import {BsTrash} from "react-icons/bs";
import {Toast} from "@capacitor/toast";

let longPressStartTimestamp: any = null;
let longPressTimer: any = null;

interface Declaration {
    id?: string;
    name?: string;
    amount?: number;
    status?: string;
    attachments?: Array<string>;
    date?: string;
    description?: string;
    type?: string;
    user?: string;
    created?: string;
    updated?: string;
}

export default function Home() {
    const router = useRouter();
    const [declarations, setDeclarations] = useAtom(declarationsAtom);
    const [currentTabIndex] = useAtom(currentTabIndexAtom);
    const [searchQuery] = useAtom(searchQueryAtom);
    const [selectedDeclarations, setSelectedDeclarations] = useState<Array<string>>([]);
    const [, setShowOverlay] = useAtom(showOverlayAtom);
    const [notifications] = useAtom(notificationsAtom);

    const handleSelectDeclaration = async (declarationId: any) => {
        // remove
        if (selectedDeclarations.includes(declarationId))
            setSelectedDeclarations(selectedDeclarations.filter((selectedDeclarationId) => selectedDeclarationId !== declarationId));
        // add
        else
            setSelectedDeclarations([...selectedDeclarations, declarationId]);
    }

    const handleClickDeclaration = (id: any) => {
        router.push('/declaration?id=' + id);
    }

    const handleTapStart = async (declaration: Declaration) => {
        longPressStartTimestamp = new Date().getTime();

        if (longPressTimer) clearTimeout(longPressTimer);
        longPressTimer = setTimeout(async () => {
            await Haptics.vibrate({
                duration: 50,
            });
            handleSelectDeclaration(declaration.id);
        }, 500);
    }

    const handleTapEnd = (declaration: Declaration) => {
        const now = new Date().getTime();
        const pressDuration = now - longPressStartTimestamp;

        clearTimeout(longPressTimer);
        longPressStartTimestamp = null;

        if (pressDuration < 500) {
            if (selectedDeclarations?.length) {
                // (de-)select declaration
                if (selectedDeclarations.includes(JSON.stringify(declaration))) {
                    handleSelectDeclaration(declaration.id);
                }
                return;
            }
            ;
            // else open the declaration
            handleClickDeclaration(declaration?.id);
        }
    }

    const handleTapCancel = () => {
        clearTimeout(longPressTimer);
        longPressStartTimestamp = null;
    }

    const handleDeleteSelectedDeclarations = async (e) => {
        e.preventDefault();
        const deletePromises = [];
        for (const declarationId of selectedDeclarations) {
            deletePromises.push(deleteDeclaration(declarationId));
        }
        const res = await Promise.all(deletePromises);
        if (!res) await Toast.show({
            text: 'Error.',
        });
        else {
            await Toast.show({
                text: 'Geselecteerde declaraties verwijderd.',
            });
            setDeclarations(oldDeclarations => oldDeclarations.filter((oldDeclaration: any) => !selectedDeclarations.includes(oldDeclaration.id)));
            setSelectedDeclarations([]);
        }
    }

    useEffect(() => {
        getDeclarations().then((declarations) => {
            setDeclarations(declarations);
        });
    }, []);

    useEffect(() => {
        setShowOverlay(false);
        setSelectedDeclarations([]);
        if (longPressTimer) clearTimeout(longPressTimer);
        longPressStartTimestamp = null;
    }, [router.query, router.asPath, router.pathname, router.query]);

    return <>
        <Header/>

        <Content>
            <SearchSortBar/>
            {
                declarations
                    .filter((declaration: any) => declaration?.status === tabs[currentTabIndex])
                    .filter((declaration: any) => declaration?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((declaration: any, index: number) => (

                        <motion.button
                            key={`${JSON.stringify(declaration)}-${index}`}
                            onTapStart={async () => await handleTapStart(declaration)}
                            onTapCancel={handleTapCancel}
                            onTap={async () => await handleTapEnd(declaration)}
                        >
                            <DeclarationCard
                                declaration={declaration}
                                selected={selectedDeclarations.includes(declaration.id)}
                                // onClick={() => handleClickDeclaration(declaration?.id)}
                            />
                        </motion.button>

                    ))
            }

            {selectedDeclarations?.length > 0
                && <div className="fixed bottom-4 left-4 right-4 flex flex-row items-center justify-center gap-2">
                    <Button
                        primary
                        className="flex-1 h-16 rounded-lg !bg-black shadow-lg text-sm"
                    >
                        Geselecteerde {selectedDeclarations.length} bonnen samenvoegen
                    </Button>
                    <Button
                        primary
                        className="h-16 rounded-lg !bg-red-600 shadow-lg text-sm"
                        onClick={handleDeleteSelectedDeclarations}
                    >
                        <BsTrash className="w-6 h-6 text-white"/>
                    </Button>
                </div>
            }

            <pre className="text-xs mt-8 overflow-x-auto hidden">
                notifications: {JSON.stringify(notifications, null, 2)}
                <br/>
                currentTab: {tabs[currentTabIndex]}
                <br/>
                currentTabIndex: {JSON.stringify(currentTabIndex, null, 2)}
                <br/>
                tabs: {JSON.stringify(tabs, null, 2)}
                <br/>
                searchQuery: {searchQuery}
                <br/>
                declarations: {JSON.stringify(declarations, null, 2)}
            </pre>
        </Content>

        <Overlay/>
    </>
}
