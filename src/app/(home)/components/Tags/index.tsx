import React from 'react';
import { Box, CircularProgress, Alert } from "@mui/material";
import {useTags} from "@/lib/tags/hooks";

const Tags: React.FC = () => {
    // Используем хук useTags
    const { data, isLoading, isError, error } = useTags();

    if (isLoading) {
        return (
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={20} />
                <span>Загрузка тегов...</span>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={{ mb: 4 }}>
                <Alert severity="error">
                    Ошибка загрузки тегов: {error?.message}
                </Alert>
            </Box>
        );
    }

    // Получаем строку с именами тегов
    const tagNames = data?.tags?.map((tag: any) => tag.name).join(', ') || '';

    return (
        <Box sx={{ mb: 4 }}>
            {`Доступные теги (${data?.count || 0}): ${tagNames}`}
        </Box>
    );
};

export default Tags;