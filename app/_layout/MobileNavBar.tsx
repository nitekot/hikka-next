'use client';

import Link from 'next/link';
import MaterialSymbolsLightGridViewRounded from '~icons/material-symbols-light/grid-view-rounded';
import MingcuteTelegramFill from '~icons/mingcute/telegram-fill'
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded'
import { useEffect, useState } from 'react';

const Component = () => {
    const [drawer, setDrawer] = useState<HTMLInputElement | null>(null);

    useEffect(() => {
        setDrawer(
            document.getElementById('mobileNavDrawer') as HTMLInputElement,
        );
    }, []);

    const closeDrawer = () => {
        if (drawer) {
            drawer.checked = false;
        }
    };

    return (
        <div className="w-60 overflow-y-scroll overscroll-contain border-l border-l-secondary h-full bg-black text-base-content">
            <ul className="menu menu-lg p-0 w-full [&_li>*]:rounded-none  mt-4">
                <li className="menu-title">Загальне</li>
                <li>
                    <Link href={'/anime'} onClick={closeDrawer}>
                        <MaterialSymbolsLightGridViewRounded />
                        Каталог
                    </Link>
                </li>
                <li>
                    <Link href={'/anime'} onClick={closeDrawer}>
                        <MaterialSymbolsInfoRounded />
                        Про нас
                    </Link>
                </li>
                <li className="menu-title">Соцмережі</li>
                <li>
                    <Link href="https://t.me/hikka_io" target="_blank" onClick={closeDrawer}>
                        <MingcuteTelegramFill />
                        Telegram
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Component;
