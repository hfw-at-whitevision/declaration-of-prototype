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
import { motion } from "framer-motion"

let longPressStartTimestamp: any = null;
let longPressTimer: any = null;

export default function Home() {
    const router = useRouter();
    const [declarations, setDeclarations] = useAtom(declarationsAtom);
    const [currentTabIndex] = useAtom(currentTabIndexAtom);
    const [searchQuery] = useAtom(searchQueryAtom);
    const [selectedDeclarations, setSelectedDeclarations] = useState<Array<string>>([]);
    const [, setShowOverlay] = useAtom(showOverlayAtom);
    const [notifications] = useAtom(notificationsAtom);

    const handleSelectDeclaration = (inputDeclaration: any) => {
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

    const handleTapStart = (e) => {
        e.preventDefault();
        longPressStartTimestamp = new Date().getTime();
    }

    const handleTapEnd = (declaration) => {
        const now = new Date().getTime();
        const pressDuration = now - longPressStartTimestamp;
        if (pressDuration < 500) {
            handleClickDeclaration(declaration?.id);
        }
        else {
            handleSelectDeclaration(declaration);
        }
    }

    useEffect(() => {
        getDeclarations().then((declarations) => {
            console.log('declarations', declarations);
            setDeclarations(declarations);
        });
    }, []);

    useEffect(() => {
        setShowOverlay(false);
    }, [router.query, router.asPath, router.pathname, router.query]);

    return <>
        <Header />

        <Content>
            <SearchSortBar />

            {
                declarations
                    .filter((declaration: any) => declaration?.status === tabs[currentTabIndex])
                    .filter((declaration: any) => declaration?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((declaration: any) => (

                        <motion.button
                            key={JSON.stringify(declaration)}
                            onTapStart={handleTapStart}
                            onTap={() => handleTapEnd(declaration)}
                        >
                            <DeclarationCard
                                declaration={declaration}
                                selected={selectedDeclarations.includes(JSON.stringify(declaration))}
                                // onClick={() => handleClickDeclaration(declaration?.id)}
                            />
                        </motion.button>

                    ))
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
