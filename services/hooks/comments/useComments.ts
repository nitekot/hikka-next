import getComments from '@/services/api/comments/getComments';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const useComments = ({
    slug,
    content_type,
    enabled = true,
}: {
    slug: string;
    content_type: API.ContentType;
    enabled?: boolean;
}) => {
    return useInfiniteList({
        queryKey: ['comments', slug, content_type],
        queryFn: ({ pageParam }) =>
            getComments({
                params: {
                    slug,
                    content_type,
                },
                page: pageParam,
            }),
        enabled,
    });
};

export default useComments;
