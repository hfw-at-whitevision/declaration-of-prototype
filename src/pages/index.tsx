import { useAtom } from 'jotai'
import {
    currentTabIndexAtom,
    declarationsAtom, notificationsAtom,
    searchQueryAtom,
    showOverlayAtom,
} from '@/store/atoms'
import React, { useEffect, useState } from 'react';
import { getDeclarations } from '@/firebase';
import DeclarationCard from '@/components/DeclarationCard';
import SearchSortBar from '@/components/SearchSortBar';
import Header, { tabs } from '@/components/Header';
import Content from '@/components/Content';
import { useRouter } from 'next/router';
import Overlay from "@/components/overlays/Overlay";
import { motion } from "framer-motion";
import Button from '@/components/Button';
import { Haptics } from '@capacitor/haptics';

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

    const handleSelectDeclaration = async (inputDeclaration: any) => {
        const declaration = JSON.stringify(inputDeclaration);

        // remove
        if (selectedDeclarations.includes(declaration))
            setSelectedDeclarations(selectedDeclarations.filter((selectedDeclaration) => selectedDeclaration !== declaration));
        // add
        else
            setSelectedDeclarations([...selectedDeclarations, declaration]);
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
            handleSelectDeclaration(declaration);
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
                    handleSelectDeclaration(declaration);
                }
                return;
            };
            // else open the declaration
            handleClickDeclaration(declaration?.id);
        }
    }

    const handleTapCancel = () => {
        clearTimeout(longPressTimer);
        longPressStartTimestamp = null;
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
        <Header />

        <Content>
            <SearchSortBar />

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
                                selected={selectedDeclarations.includes(JSON.stringify(declaration))}
                            // onClick={() => handleClickDeclaration(declaration?.id)}
                            />
                        </motion.button>

                    ))
            }

            {selectedDeclarations?.length
                ? <Button
                    primary
                    className="fixed bottom-8 left-8 right-8 h-16 rounded-lg !bg-black shadow-lg"
                >
                    Geselecteerde {selectedDeclarations.length} bonnen samenvoegen
                </Button>
                : null
            }

            <pre className="text-xs mt-8 overflow-x-auto hidden">
                notifications: {JSON.stringify(notifications, null, 2)}
                <br />
                currentTab: {tabs[currentTabIndex]}
                <br />
                currentTabIndex: {JSON.stringify(currentTabIndex, null, 2)}
                <br />
                tabs: {JSON.stringify(tabs, null, 2)}
                <br />
                searchQuery: {searchQuery}
                <br />
                declarations: {JSON.stringify(declarations, null, 2)}
            </pre>
        </Content>

        <Overlay />
    </>
}
