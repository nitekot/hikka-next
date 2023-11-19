import config from '@/utils/api/config';

export interface Response extends Hikka.Edit {}

export default async function req({
    secret,
    description,
    after,
    edit_id,
}: {
    secret: string;
    description?: string;
    after: Hikka.EditParams;
    edit_id: number;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI + '/edit/' + edit_id + '/update',
        {
            method: 'post',
            body: JSON.stringify({ after, description }),
            ...config.config,
            headers: {
                ...config.config.headers,
                auth: secret || '',
            },
        },
    );

    if (!res.ok) {
        if (res.status >= 400 && res.status <= 499) {
            throw await res.json();
        }
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}
