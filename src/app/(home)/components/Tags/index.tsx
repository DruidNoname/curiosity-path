'use client';

import React from 'react';
import {Box, Link, Typography} from "@mui/material";
import { useQuery } from '@apollo/client';
import Skeleton from "@/ui/Skeleton";
import {GET_ALL_TAGS} from "@/features/tags/queries";
import {GraphQLTagsResponse} from "@/app/(home)/components/Tags/types";

const Tags: React.FC = () => {

    const { data, loading, error} = useQuery<GraphQLTagsResponse>(GET_ALL_TAGS, {
        variables: { first: 100 },
    });
    const rawTags = data?.tags?.nodes || [];
    const tags = [...rawTags].sort((a, b) => b.count - a.count) || [];
    const totalTags = tags.length || 0;

    const errorMessage =  error?.graphQLErrors?.[0]?.message || error?.message || 'Неизвестная ошибка';

    const tagElements = tags.map((tag: any, index: number, array: any[]) => (
        <React.Fragment key={tag.id}>
            <Link href={`/tag/${tag.slug}`}>
                {tag.name}
            </Link>
            {index < array.length - 1 && ', '}
        </React.Fragment>
    ));

    return (
        <Box sx={{ mb: 4 }}>
            {loading ? (
                <Skeleton width={200} sx={{ ml: 'auto' }}/>
            ) : error ? (
                `Ошибка загрузки тегов: ${errorMessage}`
            ) : (
                <>
                    <Typography variant={'h5'} sx={{ mb: '16px' }}>
                        {`Доступные теги (${totalTags || 0}): `}
                    </Typography>
                    <Typography variant={'body1'}>
                        { tagElements }
                    </Typography>
                </>
            )}
        </Box>
    );
};

export default Tags;