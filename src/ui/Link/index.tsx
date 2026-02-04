import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';
import { styled } from '@mui/material/styles';

// Базовая стилизованная ссылка с вашими глобальными стилями
const Link = styled(MuiLink)(() => ({
    textDecoration: 'none',
    fontWeight: 500,
    borderBottom: '1px solid rgba(var(--color-primary-main-rgb), 0.5)',
    transition: 'all 0.2s ease',
    '&:hover': {
        color: 'var(--color-primary-light)',
        borderBottom: '1px solid rgba(var(--color-primary-main-rgb), 0.8)',
    },
}));

// Кастомный вариант textSimilar
export const TextSimilarLink = styled(Link)(() => ({
    color: 'var(--color-primary-main)',
    textDecoration: 'none',
    borderBottom: '1px solid transparent',
    transition: 'all 0.2s ease',
    '&:hover': {
        color: 'var(--color-primary-light)',
        borderBottom: '1px solid rgba(var(--color-primary-main-rgb), 0.5)',
    },
}));

// Кастомный вариант accent
export const AccentLink = styled(Link)(() => ({
    color: 'var(--color-accent-main)',
    textDecoration: 'underline dashed',
    '&:hover': {
        color: 'var(--color-accent-light)',
        textDecoration: 'underline solid',
    },
}));

// Кастомный вариант glass
export const GlassLink = styled(Link)(() => ({
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
}));

// Экспортируем всё
export { Link };
export default Link; // Дефолтный экспорт