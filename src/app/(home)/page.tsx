'use client'
import React from "react";
import { WP_REST_API_Post } from 'wp-types';
import PostPreview from "@/components/PostPreview";
import ErrorBoundary from "@/components/ErrorBoundary";
import {Box, Divider, Typography} from "@mui/material";
import {usePosts} from "@/lib/posts/hooks";
import InfoWidget from "@/app/(home)/components/InfoWidget";
import Loader from "@/ui/Loader";

const MainPage: React.FC = () => {
    const [page, setPage] = React.useState(1);
    const perPage = 10;

    const {
        data,
        isLoading,
        isError,
        error
    } = usePosts(page, perPage);

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
                    posts?.map((post: WP_REST_API_Post) => (
                        <PostPreview post={post} key={post.id}/>
                    ))
                }
                { isError &&
                    <>
                        <Typography variant="body1" component="p">
                            А бек не завезли.
                        </Typography>
                        <Divider/>
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