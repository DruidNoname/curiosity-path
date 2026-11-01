'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';

type Props = {
    error?: Error | null;
    /** Сбросить границу и отрисовать содержимое заново, без перезагрузки страницы. */
    onRetry: () => void;
};

/**
 * Запасной экран для упавшего блока. Цвета — из темы, так что в тёмной схеме он
 * выглядит своим. Текст ошибки виден только в разработке: читателю он ничего не скажет.
 */
const ErrorFallback: React.FC<Props> = ({ error, onRetry }) => (
    <Box
        role="alert"
        sx={{
            minHeight: '240px',
            py: 5,
            px: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: 1,
        }}
    >
        <Typography variant="h5" component="h2" color="error">
            Что-то сломалось
        </Typography>
        <Typography variant="body1">
            Этот кусок страницы не&nbsp;смог отрисоваться.
        </Typography>
        {process.env.NODE_ENV === 'development' && error?.message && (
            <Typography variant="body2" color="text.secondary" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {error.message}
            </Typography>
        )}
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button variant="contained" onClick={onRetry}>
                Попробовать снова
            </Button>
            {/* Если ошибка воспроизводится при каждом рендере, «снова» не поможет —
                остаётся полная перезагрузка. */}
            <Button variant="outlined" onClick={() => window.location.reload()}>
                Обновить страницу
            </Button>
        </Box>
    </Box>
);

export default ErrorFallback;
