'use client';

import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { range } from '@antfu/utils';

import AnimeCard from '@/components/anime-card';
import SkeletonCard from '@/components/skeletons/entry-card';
import { Button } from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';
import Pagination from '@/components/ui/pagination';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useSettingsContext } from '@/services/providers/settings-provider';

import { useList, useNextPage, useUpdatePage } from '../page.hooks';


const Component = () => {
    const { titleLanguage } = useSettingsContext();
    const { secret } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = searchParams.get('search');

    const page = searchParams.get('page');
    const iPage = searchParams.get('iPage');

    const types = searchParams.getAll('types');
    const statuses = searchParams.getAll('statuses');
    const seasons = searchParams.getAll('seasons');
    const ageRatings = searchParams.getAll('ratings');
    const years = searchParams.getAll('years');
    const genres = searchParams.getAll('genres');
    const lang = searchParams.get('only_translated');
    const sort = searchParams.get('sort');

    const dataKeys = {
        page: Number(page),
        iPage: Number(iPage),
        search,
        types,
        statuses,
        seasons,
        ageRatings,
        years,
        lang,
        genres,
        secret,
        sort,
    };

    const {
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        list,
        pagination,
    } = useList(dataKeys);

    const updatePage = useUpdatePage(dataKeys);
    const nextPage = useNextPage({ fetchNextPage, pagination });

    if (isLoading && !isFetchingNextPage) {
        return (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
                {range(1, 20).map((v) => (
                    <SkeletonCard key={v} />
                ))}
            </div>
        );
    }

    if (list === undefined || list.length == 0) {
        return (
            <NotFound
                title="Не знайдено результатів за Вашим запитом"
                description="Очистіть або змініть фільтри, щоб отримати інший результат"
            >
                <Button
                    variant="destructive"
                    onClick={() => router.push(pathname)}
                    className="w-full lg:w-auto"
                >
                    <AntDesignClearOutlined />
                    Очистити
                </Button>
            </NotFound>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
                {list &&
                    list.map((x: Hikka.Anime) => {
                        return (
                            <AnimeCard
                                href={`/anime/${x.slug}`}
                                poster={x.poster}
                                title={
                                    x[titleLanguage!] ||
                                    x.title_ua ||
                                    x.title_en ||
                                    x.title_ja
                                }
                                key={x.slug}
                                slug={x.slug}
                                watch={
                                    x.watch.length > 0 ? x.watch[0] : undefined
                                }
                            />
                        );
                    })}
            </div>
            {hasNextPage && (
                <Button
                    variant="secondary"
                    disabled={isFetchingNextPage}
                    onClick={nextPage}
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Заванатажити ще
                </Button>
            )}
            {list && pagination && pagination.pages > 1 && (
                <div className="sticky z-10 bottom-2 flex items-center justify-center">
                    <div className="bg-background border p-2 border-secondary/60 rounded-lg shadow w-fit">
                        <Pagination
                            page={Number(iPage)}
                            pages={pagination.pages}
                            setPage={updatePage}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Component;