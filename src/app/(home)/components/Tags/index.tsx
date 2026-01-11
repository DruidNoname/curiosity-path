'use client';

import React from 'react';
import { Box, Link } from "@mui/material";
import {useTags} from "@/features/tags/hooks";
import Skeleton from "@/ui/Skeleton";
import { WP_REST_API_Tag } from 'wp-types';

const Tags: React.FC = () => {
    const { data, isLoading, isError, error } = useTags();

    const tagElements = data?.tags?.map((tag: WP_REST_API_Tag, index: number, array: WP_REST_API_Tag[]) => (
        <span key={tag.id}>
            <Link href={`tag/${tag.slug}` || tag.link}>
                {tag.name}
            </Link>
            {index < array.length - 1 && ', '}
        </span>
    ));

    return (
        <Box sx={{ mb: 4 }}>
            {isLoading ? (
                <Skeleton width={200} sx={{ ml: 'auto' }}/>
            ) : isError ? (
                `Ошибка загрузки тегов: ${error?.message}`
                ) : (
                <>
                    {`Доступные теги (${data?.count || 0}): `} { tagElements }
                </>
            )}
        </Box>
    );
};

export default Tags;