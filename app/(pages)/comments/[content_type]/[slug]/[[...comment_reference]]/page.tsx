import { FC } from 'react';

import { redirect } from 'next/navigation';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import Comments from '@/components/comments';
import getCommentThread from '@/services/api/comments/getCommentThread';
import getComments from '@/services/api/comments/getComments';
import getQueryClient from '@/utils/getQueryClient';

import Content from './components/content';
import ContentHeader from './components/content-header';
import { getContent } from './components/useContent';


interface Props {
    params: {
        content_type: API.ContentType;
        slug: string;
        comment_reference: string[];
    };
}

const CommentsPage: FC<Props> = async ({ params }) => {
    const queryClient = await getQueryClient();

    const comment_reference =
        params.comment_reference && params.comment_reference[0];

    await queryClient.prefetchQuery({
        queryKey: ['content', params.content_type, params.slug],
        queryFn: async () =>
            getContent({
                content_type: params.content_type,
                slug: params.slug,
            }),
    });

    const content = queryClient.getQueryData([
        'content',
        params.content_type,
        params.slug,
    ]);

    if (!content) {
        return redirect('/');
    }

    !comment_reference &&
        (await queryClient.prefetchInfiniteQuery({
            initialPageParam: 1,
            queryKey: ['comments', params.slug, params.content_type],
            queryFn: ({ pageParam, meta }) =>
                getComments({
                    params: {
                        slug: params.slug,
                        content_type: params.content_type,
                    },
                    page: pageParam,
                    auth: meta?.auth,
                }),
        }));

    comment_reference &&
        (await queryClient.prefetchQuery({
            queryKey: ['commentThread', comment_reference],
            queryFn: () =>
                getCommentThread({
                    params: {
                        reference: comment_reference,
                    },
                }),
        }));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_25%]">
                <div className="flex flex-col gap-16">
                    <ContentHeader
                        slug={params.slug}
                        content_type={params.content_type}
                    />
                    <Comments
                        comment_reference={comment_reference}
                        slug={params.slug}
                        content_type={params.content_type}
                    />
                </div>
                <Content
                    content_type={params.content_type}
                    slug={params.slug}
                />
            </div>
        </HydrationBoundary>
    );
};

export default CommentsPage;
