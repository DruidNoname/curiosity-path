'use client';
import React, { Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import {Box} from "@mui/material";
import {usePosts} from "@/features/posts/hooks";
import InfoWidget from "@/app/(home)/components/InfoWidget";
import Loader from "@/ui/Loader";
import Pagination from "@/ui/Pagination";
import Tags from "@/app/(home)/components/Tags";
import {PER_PAGE} from "@/helpers/const";
import HistoryWidget from "@/app/(home)/components/HistoryWidget";
import { PostPreview } from "../../modules/EntryPreview/components/PostPreview";
import {TransformedPost} from "@/features/posts/types";
import MainNAsideLayout from "@/components/Layouts/MainNAsideLayout";
import {PostCalendar} from "@/modules";
import SearchWidget from "@/app/(home)/components/SearchWidget";
import { usePageParam } from "@/helpers/usePageParam";

const MainPageContent: React.FC = () => {
    const { page, setPage } = usePageParam();

    const {
        data,
        isLoading,
        isError,
        error
    } = usePosts(page, PER_PAGE);

    const {
        posts = [],
        total = 0,
    } = data || {};

    const totalPages = Math.ceil(total / PER_PAGE) || 1;

    return (
        <ErrorBoundary componentName={'MainPage'}>
            <Box sx={{ mb: 4 }}>
                <InfoWidget count={ total } isLoading={ isLoading } isError={isError} error={error}/>

                { isLoading ?

                    <Loader />

                    :

                    <MainNAsideLayout
                        mainContent={
                            <>
                                { posts?.map((post: TransformedPost) => (
                                    <PostPreview
                                        entryId={post.id}
                                        entrySlug={post.slug}
                                        entryTitle={post.title?.rendered || 'Без названия'}
                                        entryPreview={post.excerpt?.rendered || ''}
                                        entryDate={post.date || ''}
                                        entryTags={post.tags}
                                        entryImage={post.featuredImage ? post.featuredImage?.medium : undefined}
                                        key={`post_${post.id}`}
                                    />
                                ))
                                }
                                <Pagination
                                    sx={{ mt: 3, mb: 4 }}
                                    count={totalPages}
                                    page={Math.min(page, totalPages)}
                                    onChange={(_e, nextPage) => setPage(nextPage)}
                                    disabled={isLoading}
                                />
                            </>
                        }
                        asideContent={
                            <>
                                <HistoryWidget/>
                                <PostCalendar/>
                                <Tags/>
                                <SearchWidget/>
                            </>
                        }
                    />
                }
            </Box>
        </ErrorBoundary>
    );
};

// usePageParam опирается на useSearchParams, а тот требует Suspense:
// без него статическая страница не соберётся.
const MainPage: React.FC = () => (
    <Suspense fallback={<Loader />}>
        <MainPageContent />
    </Suspense>
);

export default MainPage;