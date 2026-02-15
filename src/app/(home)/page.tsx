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
import {PostCalendar} from "@/components/PostCalendar";
import HistoryWidget from "@/app/(home)/components/HistoryWidget";
import { EntryPreview } from "@/modules/components/EntryPreview";
import {TransformedPost} from "@/features/posts/types";

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

                <InfoWidget count={ total } isLoading={ isLoading } isError={isError} />

                { isLoading ?
                    <Loader/>
                    :
                    <Box
                        component={'div'}
                        sx={{
                            display: {xs: 'block', sm: 'flex'},
                            gap:  { sm: '16px', lg: '32px'},
                        }}
                    >
                        { isError ?
                            <Box
                                component={'div'}
                                sx={{ flexGrow: 1 }}
                            >
                                <Typography variant="body1" component="p">
                                    А бек не завезли.
                                </Typography>
                                <Divider sx={{ mt: '20px', mb: '36px'}} />
                                <Typography variant="body1" component="p">
                                    Ошибка: {error?.message}
                                </Typography>
                            </Box>

                            :

                            <Box
                                component={'div'}
                                sx={{ flexGrow: 1 }}
                            >
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
                            </Box>
                        }
                        <Box
                            component="aside"
                            sx={{
                                width: '20%',
                                minWidth: '300px',
                                p: 3,
                                bgcolor: 'background.paper',
                                borderLeft: 1,
                                borderColor: 'divider'
                            }}
                        >
                            <HistoryWidget/>
                            <PostCalendar/>
                            { isError && 'И сюда.' }
                            <Tags/>
                        </Box>
                    </Box>
                }
            </Box>
        </ErrorBoundary>
    );
};

export default MainPage;