'use client';
import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import {Box, Divider, Typography} from "@mui/material";
import {usePosts} from "@/features/posts/hooks";
import InfoWidget from "@/app/(home)/components/InfoWidget";
import Loader from "@/ui/Loader";
import Pagination from "@/ui/Pagination";
import Tags from "@/app/(home)/components/Tags";
import {PER_PAGE} from "@/helpers/const";
import {PostCalendar} from "../../modules/PostCalendar";
import HistoryWidget from "@/app/(home)/components/HistoryWidget";
import { EntryPreview } from "../../modules/EntryPreview";
import {TransformedPost} from "@/features/posts/types";
import EntriesListLayout from "@/components/Layouts/EntriesListLayout";

const MainPage: React.FC = () => {
    const [page, setPage] = React.useState(1);

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

    return (
        <ErrorBoundary componentName={'MainPage'}>
            <Box sx={{ mb: 4 }}>
                <InfoWidget count={ total } isLoading={ isLoading } isError={isError} error={error}/>

                { isLoading ?

                    <Loader />

                    :

                    <EntriesListLayout
                        mainContent={
                            <>
                                { posts?.map((post: TransformedPost) => (
                                    <EntryPreview
                                        entryId={post.id}
                                        entrySlug={post.slug}
                                        entryTitle={post.title?.rendered || 'Без названия'}
                                        entryPreview={post.excerpt?.rendered || ''}
                                        entryDate={post.date || ''}
                                        entryTags={post.tags || []}
                                        entryImage={post.featuredImage ? post.featuredImage?.medium : undefined}
                                        key={`post_${post.id}`}
                                    />
                                ))
                                }
                                <Pagination
                                    sx={{ mt: 3, mb: 4 }}
                                    count={Math.ceil(total / PER_PAGE) || 1}
                                    page={page}
                                    onChange={(_e, page) => {
                                        setPage(page);
                                    }}
                                    disabled={isLoading}
                                />
                            </>
                        }
                        asideContent={
                            <>
                                <HistoryWidget/>
                                <PostCalendar/>
                                <Tags/>
                            </>
                        }
                    />
                }
            </Box>
        </ErrorBoundary>
    );
};

export default MainPage;