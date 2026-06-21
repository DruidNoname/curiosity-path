'use client';

import {Box, Button, TextField, Typography} from "@mui/material";
import {useRouter} from "next/navigation";
import React from "react";

const SearchWidget: React.FC = () => {
    const router = useRouter();
    const [query, setQuery] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const value = query.trim();
        if (!value) return;
        router.push(`/search?q=${encodeURIComponent(value)}`);
    };

    return (
        <Box sx={{marginBottom: '4px'}}>
            <Typography variant={'h5'} sx={{marginBottom: '8px'}}>
                Поиск
            </Typography>

            <Box
                component={'form'}
                onSubmit={handleSubmit}
                sx={{display: 'flex', gap: '8px'}}
            >
                <TextField
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={'Поиск по постам'}
                    size={'small'}
                    fullWidth
                />
                <Button type={'submit'} variant={'contained'} size={'small'} disabled={!query.trim()}>
                    Найти
                </Button>
            </Box>
        </Box>
    );
};

export default SearchWidget;
