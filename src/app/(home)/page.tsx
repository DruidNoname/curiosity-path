'use client'
import React from "react";
import { WP_REST_API_Post } from 'wp-types';
import PostPreview from "@/components/PostPreview";
import ErrorBoundary from "@/components/ErrorBoundary";
import {Box, Divider, Typography} from "@mui/material";
import {usePosts} from "@/features/posts/hooks";
import InfoWidget from "@/app/(home)/components/InfoWidget";
import Loader from "@/ui/Loader";
import Pagination from "@/ui/Pagination";
import Tags from "@/app/(home)/components/Tags";
import {PER_PAGE} from "@/features/posts/const";

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
        totalPages = 1
    } = data || {};

    return (
        <ErrorBoundary componentName={'MainPage'}>
            <Box sx={{ mb: 4 }}>
                <InfoWidget count={ total } isLoading={ isLoading } isError={isError} />

                { isLoading ?
                    <Loader/>
                    :
                    <>
                        { posts?.map((post: WP_REST_API_Post) => (
                            <PostPreview post={post} key={post.id}/>
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

                        <Tags/>
                    </>
                }
                { isError &&
                    <>
                        <Typography variant="body1" component="p">
                            А бек не завезли.
                        </Typography>
                        <Divider sx={{ mx: 4 }} />
                        <Typography variant="body2" component="p">
                            Ошибка: {error?.message}
                        </Typography>
                    </>
                }
            </Box>
        </ErrorBoundary>
    );
}

export default MainPage;