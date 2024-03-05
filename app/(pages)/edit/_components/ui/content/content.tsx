'use client';

import * as React from 'react';

import General from '@/app/(pages)/edit/_components/ui/content/_components/general';
import SubHeader from '@/components/sub-header';
import { Button } from '@/components/ui/button';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { CONTENT_TYPE_LINKS } from '@/utils/constants';

import Details from './_components/details';

interface Props {
    slug: string;
    content_type: API.ContentType;
    content?: API.AnimeInfo | API.Character;
}

const Component = ({ slug, content_type, content }: Props) => {
    const [type, setType] = React.useState<'general' | 'details'>('general');
    const { titleLanguage } = useSettingsContext();

    if (!content) {
        return null;
    }

    const link = `${CONTENT_TYPE_LINKS[content_type]}/${slug}`;

    const poster = 'poster' in content ? content.poster : content.image;
    const title =
        'title_en' in content
            ? content[titleLanguage!] ||
              content.title_ua ||
              content.title_en ||
              content.title_ja
            : content.name_ua || content.name_en;

    return (
        <div className="flex flex-col gap-8">
            <SubHeader title="Контент" variant="h4">
                <Button
                    variant={type === 'general' ? 'secondary' : 'outline'}
                    size="badge"
                    onClick={() => setType('general')}
                >
                    Загальне
                </Button>
                <Button
                    variant={type === 'details' ? 'secondary' : 'outline'}
                    size="badge"
                    onClick={() => setType('details')}
                >
                    Деталі
                </Button>
            </SubHeader>
            {type === 'general' && (
                <General href={link} poster={poster} title={title} />
            )}
            {type === 'details' && <Details content={content} />}
        </div>
    );
};

export default Component;
