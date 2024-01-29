'use client';

import { ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';
import MaterialSymbolsCloseSmallRounded from '~icons/material-symbols/close-small-rounded';

import { useParams } from 'next/navigation';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { useQuery } from '@tanstack/react-query';

import MDEditor from '@/app/_components/md/editor/MD-editor';
import { Button } from '@/app/_components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/app/_components/ui/collapsible';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { Textarea } from '@/app/_components/ui/textarea';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import addEdit from '@/utils/api/edit/addEdit';
import { useAuthContext } from '@/utils/providers/auth-provider';
import useRouter from '@/utils/useRouter';


type FormValues = Hikka.EditParams & {
    description: string;
};

type Param = {
    param: keyof Hikka.EditParams;
    title: string;
    placeholder: string;
};

const TITLE_PARAMS: Param[] = [
    {
        param: 'title_ua',
        title: 'Українською',
        placeholder: 'Введіть назву українською',
    },
    {
        param: 'title_en',
        title: 'Англійською',
        placeholder: 'Введіть назву англійською',
    },
    {
        param: 'title_ja',
        title: 'Японською',
        placeholder: 'Введіть назву японською',
    },
];

const SYNOPSIS_PARAMS: Param[] = [
    {
        param: 'synopsis_ua',
        title: 'Українською',
        placeholder: 'Введіть опис українською',
    },
    {
        param: 'synopsis_en',
        title: 'Англійською',
        placeholder: 'Введіть опис англійською',
    },
];

const Component = () => {
    const captchaRef = useRef<TurnstileInstance>();
    const [editParams, setEditParams] = useState<(keyof Hikka.EditParams)[]>(
        [],
    );
    const params = useParams();
    const { secret } = useAuthContext();
    const router = useRouter();

    const { data: anime } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    const {
        control,
        register,
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<FormValues>();

    const [synonyms, setSynonyms] = useState<string[]>([]);
    const [newSynonym, setNewSynonym] = useState<string>();

    const getEditParams = (data: FormValues) => {
        return editParams.reduce(
            (obj, item) => ({
                ...obj,
                [item]: data[item],
            }),
            {},
        );
    };

    const onDismiss = () => {
        reset();
        router.push('/edit');
    };

    const onSaveSubmit = async (data: FormValues) => {
        try {
            if (captchaRef.current) {
                await addEdit({
                    secret: String(secret),
                    contentType: 'anime',
                    slug: String(params.slug),
                    after: {
                        ...getEditParams(data),
                        synonyms: synonyms,
                    },
                    description: data.description,
                    captcha: String(captchaRef.current.getResponse()),
                });

                onDismiss();
            } else {
                throw Error('No captcha found');
            }
        } catch (e) {
            return;
        }
    };

    const switchParam = (param: keyof Hikka.EditParams) => {
        setEditParams((prev) =>
            prev.includes(param)
                ? prev.filter((p) => p !== param)
                : [...prev, param],
        );
    };

    useEffect(() => {
        if (anime) {
            setSynonyms(anime.synonyms);
        }
    }, [anime]);

    if (!anime) {
        return null;
    }

    return (
        <div>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-6"
            >
                <div className="flex w-full flex-col gap-6">
                    <Collapsible className="w-full space-y-2 border border-accent rounded-lg p-4">
                        <CollapsibleTrigger asChild>
                            <div className="flex items-center justify-between">
                                <h5>Назва аніме</h5>
                                <Button
                                    id="title-collapse"
                                    variant="ghost"
                                    size="sm"
                                    className="w-9 p-0"
                                >
                                    <ChevronsUpDown className="h-4 w-4" />
                                    <span className="sr-only">Toggle</span>
                                </Button>
                            </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="flex flex-col gap-6">
                            <div className="flex flex-wrap gap-2">
                                {TITLE_PARAMS.map((param) => (
                                    <Button
                                        size="badge"
                                        variant={
                                            editParams.includes(param.param)
                                                ? 'default'
                                                : 'outline'
                                        }
                                        key={param.param}
                                        onClick={() => switchParam(param.param)}
                                    >
                                        {param.title}
                                    </Button>
                                ))}
                            </div>
                            {editParams.map((eParam) => {
                                const param = TITLE_PARAMS.find(
                                    (tParam) => tParam.param === eParam,
                                );

                                if (!param) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={param.param}
                                        className="flex flex-col gap-4 w-full"
                                    >
                                        <Label>{param.title}</Label>
                                        <Input
                                            type="text"
                                            placeholder={param.placeholder}
                                            className="w-full disabled:text-secondary-foreground"
                                            {...register(param.param, {
                                                value:
                                                    (anime![
                                                        param.param
                                                        ] as string) || undefined,
                                            })}
                                        />
                                    </div>
                                );
                            })}
                        </CollapsibleContent>
                    </Collapsible>

                    <Collapsible className="w-full space-y-2 border border-accent rounded-lg p-4">
                        <CollapsibleTrigger asChild>
                            <div className="flex items-center justify-between">
                                <h5>Синоніми</h5>
                                <Button
                                    id="title-collapse"
                                    variant="ghost"
                                    size="sm"
                                    className="w-9 p-0"
                                >
                                    <ChevronsUpDown className="h-4 w-4" />
                                    <span className="sr-only">Toggle</span>
                                </Button>
                            </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="flex flex-col gap-6">
                            <div className="flex gap-2 flex-wrap">
                                {synonyms.map((synonym) => {
                                    return (
                                        <div
                                            className="flex gap-2 items-center px-2 py-1 border border-secondary/30 text-sm rounded-md bg-secondary/30"
                                            key={synonym}
                                        >
                                            {synonym}
                                            <Button
                                                onClick={() =>
                                                    setSynonyms((prev) =>
                                                        prev.filter(
                                                            (s) =>
                                                                s !== synonym,
                                                        ),
                                                    )
                                                }
                                                variant="ghost"
                                                size="icon-xs"
                                            >
                                                <MaterialSymbolsCloseSmallRounded />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex flex-col gap-4 w-full">
                                <Label>Новий синонім</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newSynonym}
                                        onChange={(e) =>
                                            setNewSynonym(e.target.value)
                                        }
                                        className="flex-1"
                                    />
                                    <Button
                                        disabled={newSynonym?.length === 0}
                                        onClick={() => {
                                            setSynonyms((prev) => [
                                                ...prev,
                                                String(newSynonym),
                                            ]);
                                            setNewSynonym('');
                                        }}
                                        size="icon"
                                        variant="secondary"
                                    >
                                        <MaterialSymbolsAddRounded />
                                    </Button>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    <Collapsible className="w-full space-y-2 border border-accent  rounded-lg p-4">
                        <CollapsibleTrigger asChild>
                            <div className="flex items-center justify-between">
                                <h5>Опис аніме</h5>
                                <Button
                                    id="title-collapse"
                                    variant="ghost"
                                    size="sm"
                                    className="w-9 p-0"
                                >
                                    <ChevronsUpDown className="h-4 w-4" />
                                    <span className="sr-only">Toggle</span>
                                </Button>
                            </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="flex flex-col gap-6">
                            <div className="flex flex-wrap gap-2">
                                {SYNOPSIS_PARAMS.map((param) => (
                                    <Button
                                        size="badge"
                                        variant={
                                            editParams.includes(param.param)
                                                ? 'default'
                                                : 'outline'
                                        }
                                        key={param.param}
                                        onClick={() => switchParam(param.param)}
                                    >
                                        {param.title}
                                    </Button>
                                ))}
                            </div>
                            {editParams.map((eParam) => {
                                const param = SYNOPSIS_PARAMS.find(
                                    (tParam) => tParam.param === eParam,
                                );

                                if (!param) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={param.param}
                                        className="flex flex-col gap-4 w-full"
                                    >
                                        <Label>{param.title}</Label>
                                        <Controller
                                            control={control}
                                            name={param.param}
                                            render={({
                                                         field: {
                                                             onChange,
                                                             onBlur,
                                                             ref,
                                                         },
                                                     }) => (
                                                <MDEditor
                                                    ref={ref}
                                                    placeholder={
                                                        param.placeholder
                                                    }
                                                    className="dark-theme dark-editor bg-secondary/30 border-secondary/60 border rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1"
                                                    markdown={
                                                        (anime![
                                                            param.param
                                                            ] as string) || ''
                                                    }
                                                    onChange={onChange}
                                                    onBlur={onBlur}
                                                />
                                            )}
                                        />
                                    </div>
                                );
                            })}
                        </CollapsibleContent>
                    </Collapsible>

                    <div className="flex flex-col gap-4 w-full">
                        <Label className="flex justify-between">
                            <span>Опис правки</span>
                            <span className="text-muted-foreground">
                                Необов’язково
                            </span>
                        </Label>
                        <Textarea
                            placeholder="Введіть причину правки"
                            rows={3}
                            className="w-full disabled:text-secondary-foreground"
                            {...register('description')}
                        />
                    </div>
                </div>
                <div className="flex w-full flex-col gap-4">
                    <Turnstile
                        ref={captchaRef}
                        siteKey="0x4AAAAAAANXs8kaCqjo_FLF"
                    />
                    <Button
                        disabled={isSubmitting}
                        onClick={handleSubmit(onSaveSubmit)}
                        type="submit"
                        className="w-fit"
                    >
                        {isSubmitting && (
                            <span className="loading loading-spinner"></span>
                        )}
                        Створити
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Component;