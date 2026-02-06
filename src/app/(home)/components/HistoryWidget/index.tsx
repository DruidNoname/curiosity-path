import ErrorBoundary from "@/components/ErrorBoundary";
import {Box, Card, Paper, Tooltip, Typography} from "@mui/material";
import Loader from "@/ui/Loader";
import React from "react";
import {usePostsByToday} from "@/features/posts/hooks";
import {WP_REST_API_Post} from "wp-types";
import {Link} from "@/ui/Link";

const HistoryWidget: React.FC = ( ) => {
    const {
        data,
        isLoading,
        error,
        isError
    } = usePostsByToday();

    const {
        posts = [],
    } = data || {};


    return(
        <ErrorBoundary componentName={'HistoryWidget'}>
            { !isError ?
                <Box  sx={{marginBottom: '4px'}}>
                    <Typography variant={'h5'} sx={{marginBottom: '8px'}}>
                        Окно в историю {isLoading && <Loader isDots={true}/> }
                    </Typography>
                    <Typography variant={'body2'}>
                        Что было в&nbsp;фокусе в&nbsp;этот&nbsp;день, <strong>{new Date().toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long'
                    })}</strong>:
                    </Typography>
                </Box>
                :
                <Typography variant={'h6'} sx={{ lineHeight: '1.25em', fontSize: '12px'}}>
                    {error?.message}
                </Typography>
            }
            <Paper
                variant={'iced'}
                sx={{padding: '16px', marginBottom: '20px;', minHeight: '180px', marginRight: '-3px', marginLeft: '-3px',}}
            >
                {   posts?.length > 0
                    ?
                    posts?.map((post: WP_REST_API_Post) => {
                    const postDate = new Date(post.date);
                    const postYear = postDate.getFullYear();

                    return (
                        <Tooltip
                            key={post.id}
                            title={post.title.rendered.replace(/<[^>]*>/g, '')} // Убираем HTML-теги
                            arrow
                            placement="bottom-end"
                        >
                            <Link key={post.id} href={`/${post.slug}`} sx={{ margin: '0 8px'}}>
                                { `${postYear}`}
                            </Link>
                        </Tooltip>
                    );
                })
                :
                    <Typography variant={'body2'}>
                        ...ничего не произошло.
                    </Typography>
                }
            </Paper>
        </ErrorBoundary>
    );
};

export default HistoryWidget;