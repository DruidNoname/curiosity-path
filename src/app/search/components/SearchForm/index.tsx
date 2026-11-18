'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField } from '@mui/material';
import { buildSearchHref } from '@/features/search/href';

type Props = {
    /** Есть ли запрос в адресе. Без него курсор сразу ставится в поле. */
    hasQuery: boolean;
    /** Движок из адреса (`&engine=wp`): новый запрос его не сбрасывает. */
    engine: string | null;
};

/**
 * Поле поиска на самой странице `/search`. Без него страница без `?q` просила
 * «Введите запрос», а ввести его было негде: `SearchWidget` есть только на главной.
 *
 * Поле всегда начинается пустым: текущий запрос и так виден в заголовке. После перехода
 * к новому запросу родитель очищает поле пересозданием по `key`, а не setState в эффекте.
 */
const SearchForm: React.FC<Props> = ({ hasQuery, engine }) => {
    const router = useRouter();
    const [query, setQuery] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const href = buildSearchHref(query, engine);
        if (href) router.push(href);
    };

    return (
        <Box
            component="form"
            role="search"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                gap: 1,
                // ml: auto прижимает форму к правому краю строки с заголовком.
                ml: { md: 'auto' },
                mb: 1,
                width: { xs: '100%', md: 420 },
            }}
        >
            <TextField
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по постам"
                size="small"
                fullWidth
                // Без запроса пришли сюда именно искать — сразу ставим курсор в поле.
                // На выдаче — нет: на телефоне клавиатура закрыла бы результаты.
                autoFocus={!hasQuery}
                slotProps={{ htmlInput: { 'aria-label': 'Поисковый запрос', enterKeyHint: 'search' } }}
            />
            <Button
                type="submit"
                variant="contained"
                size="small"
                disabled={!query.trim()}
                sx={{ flexShrink: 0 }}
            >
                Новый поиск
            </Button>
        </Box>
    );
};

export default SearchForm;
