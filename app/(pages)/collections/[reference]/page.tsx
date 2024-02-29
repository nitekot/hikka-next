import React from 'react';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import { getCookie } from '@/app/actions';
import Comments from '@/components/comments/comments';
import getCollection from '@/services/api/collections/getCollection';
import CollectionProvider from '@/services/providers/collection-provider';
import getQueryClient from '@/utils/getQueryClient';

import CollectionGroups from './_components/collection-groups';
import CollectionInfo from './_components/collection-info';
import CollectionTitle from './_components/collection-title';


const Component = async ({
    params: { reference },
}: {
    params: Record<string, any>;
}) => {
    const queryClient = getQueryClient();
    const secret = await getCookie('secret');

    await queryClient.prefetchQuery({
        queryKey: ['collection', { reference, secret }],
        queryFn: () => getCollection({ reference, secret }),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <CollectionProvider>
                <div>
                    <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                        <div className="flex flex-col gap-12">
                            <div className="flex flex-col gap-8">
                                <CollectionTitle />
                                <div className="lg:hidden block">
                                    <CollectionInfo />
                                </div>
                                <CollectionGroups />
                            </div>
                            <Comments
                                slug={reference}
                                content_type="collection"
                            />
                        </div>
                        <div className="order-1 hidden w-full lg:order-2 lg:block">
                            <CollectionInfo />
                        </div>
                    </div>
                </div>
            </CollectionProvider>
        </HydrationBoundary>
    );
};

export default Component;
