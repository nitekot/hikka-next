import getAnimeFranchise from '@/services/api/anime/getAnimeFranchise';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnimeList } from '@/utils/animeAdapter';

const useFranchise = ({ slug }: { slug: string }) => {
    const { titleLanguage } = useSettingsContext();

    return useInfiniteList({
        queryKey: ['franchise', slug],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeFranchise({
                params: { slug },
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: convertAnimeList<API.Anime>({
                    anime: a.list,
                    titleLanguage: titleLanguage!,
                }),
            })),
        }),
    });
};

export default useFranchise;
