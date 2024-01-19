'use client';

import { format } from 'date-fns';
import * as React from 'react';



import Link from 'next/link';
import { useParams } from 'next/navigation';



import { useQuery, useQueryClient } from '@tanstack/react-query';



import BaseCard from '@/app/_components/base-card';
import SubHeader from '@/app/_components/sub-header';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/app/_components/ui/avatar';
import { Label } from '@/app/_components/ui/label';
import getEdit from '@/utils/api/edit/getEdit';


const Component = () => {
    const params = useParams();

    const { data: edit } = useQuery({
        queryKey: ['edit', params.editId],
        queryFn: () => getEdit({ edit_id: Number(params.editId) })
    });

    if (!edit) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <Label className="text-muted-foreground">Автор</Label>
            <div className="flex w-full items-center gap-4">
                <Avatar className="rounded-md w-12 h-12">
                    <AvatarImage className="rounded-md" src={edit.author!.avatar} alt={edit.author!.username} />
                    <AvatarFallback className="rounded-md">{edit.author!.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col">
                    <Link href={'/u/' + edit.author!.username}>
                        <h5>{edit.author!.username}</h5>
                    </Link>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-4">
                            <p className="text-xs text-muted-foreground">
                                {format(
                                    edit.created * 1000,
                                    'd MMM yyyy kk:mm',
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Component;