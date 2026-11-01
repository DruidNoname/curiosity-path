import { Box, Link, Typography } from '@mui/material';
import ErrorBoundary from '@/components/ErrorBoundary';

/**
 * Общая «не найдено». Показывается на любой несуществующий адрес и там, где
 * страница сама вызвала notFound(): запись, рецепт, тег, раздел рецептов.
 * Next сам ставит ей статус 404 (если ответ ещё не начал отдаваться) и noindex.
 */
export default function NotFound() {
    return (
        <ErrorBoundary componentName={'NotFound'}>
            <Box sx={{ px: '24px', py: 8, textAlign: 'center' }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Здесь ничего нет
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Такой страницы не существует — возможно, в&nbsp;адресе опечатка
                    или запись переехала.
                </Typography>
                <Typography variant="body1">
                    <Link href="/">На главную</Link>
                </Typography>
            </Box>
        </ErrorBoundary>
    );
}
