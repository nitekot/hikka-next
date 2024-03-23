import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response<TContent extends API.Content>
    extends API.WithPagination<
        {
            favourite_created: number;
        } & TContent
    > {}

export default async function req<TContent extends API.Content>({
    username,
    page = 1,
    size = 15,
    auth,
    content_type,
}: {
    username: string;
    page?: number;
    size?: number;
    auth?: string;
    content_type: API.ContentType;
}): Promise<Response<TContent>> {
    return fetchRequest<Response<TContent>>({
        path: `/favourite/${content_type}/${username}/list`,
        method: 'post',
        auth,
        page,
        size,
    });
}
