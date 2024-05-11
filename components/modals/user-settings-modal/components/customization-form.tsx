'use client';

import { useTheme } from 'next-themes';
import * as React from 'react';
import MaterialSymbolsNightlightOutlineRounded from '~icons/material-symbols/nightlight-outline-rounded';
import MaterialSymbolsSunnyOutlineRounded from '~icons/material-symbols/sunny-outline-rounded';

import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useSettingsContext } from '@/services/providers/settings-provider';

const Component = () => {
    const { titleLanguage, setState: setSettingsState } = useSettingsContext();
    const { setTheme, theme } = useTheme();

    const handleChangeTitleLanguage = (value: string[]) =>
        setSettingsState!((prev) =>
            prev
                ? {
                      ...prev,
                      titleLanguage: value[0] as
                          | 'title_ua'
                          | 'title_en'
                          | 'title_ja',
                  }
                : prev,
        );

    return (
        <div className="flex w-full flex-col gap-6 p-6">
            <div className="flex w-full flex-col gap-2">
                <Label>Тема сайту</Label>

                <Select
                    value={[theme!]}
                    onValueChange={(value) => setTheme(value[0])}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Виберіть тему..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                <SelectItem value="dark">
                                    <div className="flex items-center gap-2">
                                        <MaterialSymbolsNightlightOutlineRounded className="text-[1.2rem]" />
                                        Темна тема
                                    </div>
                                </SelectItem>
                                <SelectItem value="light">
                                    <div className="flex items-center gap-2">
                                        <MaterialSymbolsSunnyOutlineRounded className="text-[1.2rem]" />
                                        Світла тема
                                    </div>
                                </SelectItem>
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex w-full flex-col gap-2">
                <Label>Мова назв контенту</Label>

                <Select
                    value={[titleLanguage!]}
                    onValueChange={handleChangeTitleLanguage}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Виберіть тему..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                <SelectItem value="title_ua">
                                    Українська
                                </SelectItem>
                                <SelectItem value="title_en">
                                    Англійська
                                </SelectItem>
                                <SelectItem value="title_ja">Рідна</SelectItem>
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default Component;
