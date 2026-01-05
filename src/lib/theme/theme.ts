import { createTheme, alpha } from '@mui/material/styles';

const deadSpaceBaseTheme = createTheme({
    palette: {
        mode: 'dark' as const,
        primary: {
            main: '#7ad0f0',           // Голубой - основной цвет интерфейса как на скриншоте
            light: '#a0e0ff',
            dark: '#4da0c0',
            contrastText: '#0a0a0a',
        },
        secondary: {
            main: '#ff8c42',           // Оранжевый для кнопок и акцентов
            light: '#ffb074',
            dark: '#cc7034',
            contrastText: '#0a0a0a',
        },
        info: {
            main: '#4da0c0',           // Темный голубой для информации
            light: '#7ad0f0',
            dark: '#3a78a0',
        },
        warning: {
            main: '#ffaa42',           // Оранжевый для предупреждений
            light: '#ffcc7a',
            dark: '#cc8834',
        },
        error: {
            main: '#ff5555',           // Красный для ошибок
            light: '#ff8888',
            dark: '#cc4444',
        },
        success: {
            main: '#42cc7a',           // Зеленый для успеха
            light: '#7affaa',
            dark: '#34a062',
        },
        background: {
            default: '#0a1419',        // Темный голубовато-серый фон
            paper: '#1a2830',          // Полупрозрачные панели
        },
        text: {
            primary: '#e6f7ff',        // Светлый голубой текст
            secondary: '#a0e0ff',      // Голубой вторичный текст
            disabled: '#607080',       // Серо-голубой для неактивных
        },
        divider: alpha('#7ad0f0', 0.2), // Полупрозрачные разделители
        action: {
            active: '#7ad0f0',
            hover: alpha('#7ad0f0', 0.08),
            hoverOpacity: 0.08,
            selected: alpha('#7ad0f0', 0.16),
            selectedOpacity: 0.16,
            disabled: '#607080',
            disabledBackground: alpha('#607080', 0.12),
            disabledOpacity: 0.38,
            focus: alpha('#7ad0f0', 0.12),
            focusOpacity: 0.12,
            activatedOpacity: 0.24,
        },
    },
    typography: {
        fontFamily: '"Roboto Mono", "Courier New", monospace', // Моноширинный шрифт как в интерфейсе
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#a0e0ff',
            letterSpacing: '0.5px',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            color: '#a0e0ff',
            letterSpacing: '0.25px',
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#7ad0f0',
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
            color: '#7ad0f0',
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            color: '#e6f7ff',
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            color: '#a0e0ff',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
            color: '#e6f7ff',
        },
        body2: {
            fontSize: '0.875rem',
            color: '#a0e0ff',
        },
        button: {
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: '1px',
            fontSize: '0.875rem',
        },
        caption: {
            color: '#88aacc',
            fontSize: '0.75rem',
            letterSpacing: '0.25px',
        },
        overline: {
            color: '#7ad0f0',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
        },
    },
    shape: {
        borderRadius: 4,               // Умеренные скругления
    },
});

// Тени с голубым свечением
const deadSpaceBlueShadows = [
    'none',
    `0 2px 8px ${alpha('#7ad0f0', 0.15)}`,
    `0 4px 16px ${alpha('#7ad0f0', 0.2)}`,
    `0 8px 24px ${alpha('#7ad0f0', 0.25)}`,
    `0 12px 32px ${alpha('#7ad0f0', 0.3)}`,
    `0 16px 40px ${alpha('#7ad0f0', 0.35)}`,
    ...Array(19).fill('none'),
] as const;

export const deadSpaceTheme = createTheme({
    ...deadSpaceBaseTheme,
    shadows: deadSpaceBlueShadows as any,
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#0a1419',
                    backgroundImage: 'radial-gradient(circle at 50% 0%, #1a2830 0%, #0a1419 100%)',
                    scrollbarColor: `${alpha('#7ad0f0', 0.3)} #0a1419`,
                    '&::-webkit-scrollbar': {
                        width: '8px',
                        backgroundColor: 'transparent',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: alpha('#1a2830', 0.5),
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: alpha('#7ad0f0', 0.3),
                        borderRadius: '4px',
                        '&:hover': {
                            backgroundColor: alpha('#7ad0f0', 0.5),
                        },
                    },
                },
                '::selection': {
                    backgroundColor: alpha('#7ad0f0', 0.3),
                    color: '#e6f7ff',
                },
                '@font-face': {
                    fontFamily: 'Roboto Mono',
                    fontStyle: 'normal',
                    fontWeight: '300 700',
                    fontDisplay: 'swap',
                    src: 'local("Roboto Mono"), url(https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;600;700&display=swap)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    fontWeight: 600,
                    letterSpacing: '1px',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid transparent',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                    },
                },
            },
            variants: [
                {
                    props: { variant: 'contained', color: 'primary' },
                    style: {
                        background: `linear-gradient(135deg, ${alpha('#7ad0f0', 0.9)} 0%, ${alpha('#4da0c0', 0.9)} 100%)`,
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha('#7ad0f0', 0.3)}`,
                        boxShadow: `0 4px 16px ${alpha('#7ad0f0', 0.25)}`,
                        '&:hover': {
                            background: `linear-gradient(135deg, ${alpha('#a0e0ff', 0.9)} 0%, ${alpha('#7ad0f0', 0.9)} 100%)`,
                            boxShadow: `0 6px 20px ${alpha('#7ad0f0', 0.35)}`,
                            border: `1px solid ${alpha('#7ad0f0', 0.5)}`,
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        },
                    },
                },
                {
                    props: { variant: 'contained', color: 'secondary' },
                    style: {
                        background: `linear-gradient(135deg, ${alpha('#ff8c42', 0.9)} 0%, ${alpha('#cc7034', 0.9)} 100%)`,
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha('#ff8c42', 0.3)}`,
                        boxShadow: `0 4px 16px ${alpha('#ff8c42', 0.25)}`,
                        '&:hover': {
                            background: `linear-gradient(135deg, ${alpha('#ffb074', 0.9)} 0%, ${alpha('#ff8c42', 0.9)} 100%)`,
                            boxShadow: `0 6px 20px ${alpha('#ff8c42', 0.35)}`,
                            border: `1px solid ${alpha('#ff8c42', 0.5)}`,
                        },
                    },
                },
                {
                    props: { variant: 'outlined', color: 'primary' },
                    style: {
                        backgroundColor: alpha('#1a2830', 0.5),
                        border: `1px solid ${alpha('#7ad0f0', 0.3)}`,
                        color: '#a0e0ff',
                        '&:hover': {
                            backgroundColor: alpha('#7ad0f0', 0.1),
                            border: `1px solid ${alpha('#7ad0f0', 0.5)}`,
                        },
                    },
                },
                {
                    props: { variant: 'outlined', color: 'secondary' },
                    style: {
                        backgroundColor: alpha('#1a2830', 0.5),
                        border: `1px solid ${alpha('#ff8c42', 0.3)}`,
                        color: '#ffb074',
                        '&:hover': {
                            backgroundColor: alpha('#ff8c42', 0.1),
                            border: `1px solid ${alpha('#ff8c42', 0.5)}`,
                        },
                    },
                },
                {
                    props: { variant: 'text' },
                    style: {
                        color: '#7ad0f0',
                        '&:hover': {
                            backgroundColor: alpha('#7ad0f0', 0.08),
                        },
                    },
                },
            ],
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha('#1a2830', 0.8),
                    backdropFilter: 'blur(20px)',
                    borderBottom: `1px solid ${alpha('#7ad0f0', 0.2)}`,
                    boxShadow: `0 2px 8px ${alpha('#000000', 0.3)}`,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha('#1a2830', 0.7),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha('#7ad0f0', 0.2)}`,
                    borderRadius: 8,
                },
                elevation1: {
                    boxShadow: `0 2px 8px ${alpha('#7ad0f0', 0.15)}`,
                },
                elevation2: {
                    boxShadow: `0 4px 16px ${alpha('#7ad0f0', 0.2)}`,
                },
                elevation3: {
                    boxShadow: `0 8px 24px ${alpha('#7ad0f0', 0.25)}`,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha('#1a2830', 0.7),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha('#7ad0f0', 0.2)}`,
                    borderRadius: 8,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        borderColor: alpha('#7ad0f0', 0.4),
                        boxShadow: `0 8px 32px ${alpha('#7ad0f0', 0.25)}`,
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha('#1a2830', 0.5),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha('#7ad0f0', 0.2)}`,
                    borderRadius: 4,
                    transition: 'all 0.2s ease',
                    '&.Mui-focused': {
                        borderColor: alpha('#7ad0f0', 0.5),
                        boxShadow: `0 0 0 2px ${alpha('#7ad0f0', 0.1)}`,
                    },
                },
                input: {
                    color: '#e6f7ff',
                    '&::placeholder': {
                        color: alpha('#a0e0ff', 0.6),
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha('#7ad0f0', 0.3),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha('#7ad0f0', 0.5),
                        borderWidth: '2px',
                    },
                },
                notchedOutline: {
                    borderColor: alpha('#7ad0f0', 0.2),
                    borderWidth: '1px',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    letterSpacing: '0.25px',
                    borderRadius: 16,
                    border: '1px solid transparent',
                    backdropFilter: 'blur(10px)',
                },
                colorPrimary: {
                    backgroundColor: alpha('#7ad0f0', 0.2),
                    color: '#a0e0ff',
                    border: `1px solid ${alpha('#7ad0f0', 0.3)}`,
                },
                colorSecondary: {
                    backgroundColor: alpha('#ff8c42', 0.2),
                    color: '#ffb074',
                    border: `1px solid ${alpha('#ff8c42', 0.3)}`,
                },
                colorInfo: {
                    backgroundColor: alpha('#4da0c0', 0.2),
                    color: '#7ad0f0',
                    border: `1px solid ${alpha('#4da0c0', 0.3)}`,
                },
                colorWarning: {
                    backgroundColor: alpha('#ffaa42', 0.2),
                    color: '#ffcc7a',
                    border: `1px solid ${alpha('#ffaa42', 0.3)}`,
                },
                colorError: {
                    backgroundColor: alpha('#ff5555', 0.2),
                    color: '#ff8888',
                    border: `1px solid ${alpha('#ff5555', 0.3)}`,
                },
                colorSuccess: {
                    backgroundColor: alpha('#42cc7a', 0.2),
                    color: '#7affaa',
                    border: `1px solid ${alpha('#42cc7a', 0.3)}`,
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    fontWeight: 500,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid transparent',
                },
                standardInfo: {
                    backgroundColor: alpha('#4da0c0', 0.15),
                    borderColor: alpha('#7ad0f0', 0.3),
                    color: '#a0e0ff',
                },
                standardSuccess: {
                    backgroundColor: alpha('#42cc7a', 0.15),
                    borderColor: alpha('#7affaa', 0.3),
                    color: '#7affaa',
                },
                standardWarning: {
                    backgroundColor: alpha('#ffaa42', 0.15),
                    borderColor: alpha('#ffcc7a', 0.3),
                    color: '#ffcc7a',
                },
                standardError: {
                    backgroundColor: alpha('#ff5555', 0.15),
                    borderColor: alpha('#ff8888', 0.3),
                    color: '#ff8888',
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                root: {
                    padding: '8px',
                },
                switchBase: {
                    color: alpha('#607080', 0.5),
                    '&.Mui-checked': {
                        color: '#7ad0f0',
                    },
                    '&.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#7ad0f0',
                        opacity: 0.8,
                    },
                },
                track: {
                    backgroundColor: alpha('#607080', 0.3),
                    opacity: 0.8,
                    borderRadius: '10px',
                },
                thumb: {
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha('#1a2830', 0.5),
                    borderRadius: 4,
                    height: '6px',
                    overflow: 'hidden',
                },
                bar: {
                    background: 'linear-gradient(90deg, #7ad0f0, #4da0c0)',
                    borderRadius: 4,
                },
            },
        },
        MuiCircularProgress: {
            styleOverrides: {
                root: {
                    color: '#7ad0f0',
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: alpha('#7ad0f0', 0.2),
                    borderWidth: '1px',
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: alpha('#607080', 0.7),
                    '&.Mui-checked': {
                        color: '#7ad0f0',
                    },
                },
            },
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    color: alpha('#607080', 0.7),
                    '&.Mui-checked': {
                        color: '#7ad0f0',
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${alpha('#7ad0f0', 0.2)}`,
                    minHeight: '48px',
                },
                indicator: {
                    backgroundColor: '#7ad0f0',
                    height: '2px',
                },
                flexContainer: {
                    gap: '24px',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    letterSpacing: '0.5px',
                    minHeight: '48px',
                    padding: '12px 16px',
                    '&.Mui-selected': {
                        color: '#a0e0ff',
                    },
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#7ad0f0',
                    textDecoration: 'none',
                    fontWeight: 500,
                    borderBottom: '1px solid transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        color: '#a0e0ff',
                        borderBottom: `1px solid ${alpha('#7ad0f0', 0.5)}`,
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#a0e0ff',
                    '&:hover': {
                        backgroundColor: alpha('#7ad0f0', 0.1),
                        color: '#7ad0f0',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${alpha('#7ad0f0', 0.1)}`,
                    padding: '16px',
                },
                head: {
                    fontWeight: 600,
                    color: '#a0e0ff',
                    backgroundColor: alpha('#1a2830', 0.5),
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: alpha('#7ad0f0', 0.05),
                    },
                    '&.Mui-selected': {
                        backgroundColor: alpha('#7ad0f0', 0.1),
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: alpha('#1a2830', 0.9),
                    backdropFilter: 'blur(20px)',
                    borderRight: `1px solid ${alpha('#7ad0f0', 0.2)}`,
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundColor: alpha('#1a2830', 0.9),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha('#7ad0f0', 0.2)}`,
                    boxShadow: `0 8px 32px ${alpha('#000000', 0.4)}`,
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: alpha('#1a2830', 0.9),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha('#7ad0f0', 0.2)}`,
                    color: '#e6f7ff',
                    fontSize: '0.75rem',
                    padding: '8px 12px',
                    maxWidth: '300px',
                },
                arrow: {
                    color: alpha('#1a2830', 0.9),
                    '&:before': {
                        border: `1px solid ${alpha('#7ad0f0', 0.2)}`,
                    },
                },
            },
        },
        MuiSlider: {
            styleOverrides: {
                root: {
                    color: '#7ad0f0',
                    height: '4px',
                },
                track: {
                    border: 'none',
                },
                rail: {
                    backgroundColor: alpha('#607080', 0.3),
                },
                thumb: {
                    backgroundColor: '#7ad0f0',
                    '&:hover': {
                        boxShadow: `0 0 0 8px ${alpha('#7ad0f0', 0.16)}`,
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    backgroundColor: alpha('#1a2830', 0.5),
                    backdropFilter: 'blur(10px)',
                },
                icon: {
                    color: '#a0e0ff',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: alpha('#1a2830', 0.9),
                    backdropFilter: 'blur(30px)',
                    border: `1px solid ${alpha('#7ad0f0', 0.2)}`,
                },
            },
        },
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha('#0a1419', 0.8),
                    backdropFilter: 'blur(4px)',
                },
            },
        },
    },
});

// Светлая версия (опционально)

export const deadSpaceLightTheme = createTheme({
    ...deadSpaceTheme,
    palette: {
        mode: 'light',
        primary: {
            main: '#2d7a9c',           // Темнее для лучшей читаемости в светлой теме
            light: '#4da0c0',
            dark: '#1e5c7a',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#cc7034',
            light: '#ff8c42',
            dark: '#a8582a',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f0f7fa',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a2830',        // Темный для светлой темы
            secondary: '#2d7a9c',      // Темный голубой
            disabled: '#8899aa',
        },
    },
    typography: {
        ...deadSpaceBaseTheme.typography,
        h1: {
            ...deadSpaceBaseTheme.typography.h1,
            color: '#1a2830',          // Темный заголовок
        },
        h2: {
            ...deadSpaceBaseTheme.typography.h2,
            color: '#1a2830',          // Темный заголовок
        },
        h3: {
            ...deadSpaceBaseTheme.typography.h3,
            color: '#2d7a9c',          // Темный голубой
        },
        h4: {
            ...deadSpaceBaseTheme.typography.h4,
            color: '#2d7a9c',          // Темный голубой
        },
        h5: {
            ...deadSpaceBaseTheme.typography.h5,
            color: '#1a2830',          // Темный текст
        },
        h6: {
            ...deadSpaceBaseTheme.typography.h6,
            color: '#2d7a9c',          // Темный голубой
        },
        body1: {
            ...deadSpaceBaseTheme.typography.body1,
            color: '#1a2830',          // Темный текст
        },
        body2: {
            ...deadSpaceBaseTheme.typography.body2,
            color: '#2d7a9c',          // Темный голубой
        },
        overline: {
            ...deadSpaceBaseTheme.typography.overline,
            color: '#2d7a9c',          // Темный голубой
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#1a2830',  // Темный текст на белом фоне
                    borderBottom: `1px solid ${alpha('#4da0c0', 0.2)}`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    border: `1px solid ${alpha('#4da0c0', 0.2)}`,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    border: `1px solid ${alpha('#4da0c0', 0.2)}`,
                    '&:hover': {
                        borderColor: alpha('#4da0c0', 0.4),
                    },
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#2d7a9c',
                    '&:hover': {
                        color: '#1e5c7a',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#2d7a9c',
                    '&:hover': {
                        backgroundColor: alpha('#2d7a9c', 0.1),
                        color: '#1e5c7a',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    color: '#2d7a9c',
                    backgroundColor: '#f8fcfd',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        color: '#1e5c7a',  // Темнее для читаемости
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: alpha('#2d7a9c', 0.1),
                    color: '#1e5c7a',
                    border: `1px solid ${alpha('#2d7a9c', 0.3)}`,
                },
                colorSecondary: {
                    backgroundColor: alpha('#cc7034', 0.1),
                    color: '#a8582a',
                    border: `1px solid ${alpha('#cc7034', 0.3)}`,
                },
            },
        },
        MuiButton: {
            variants: [
                {
                    props: { variant: 'contained', color: 'primary' },
                    style: {
                        background: `linear-gradient(135deg, #2d7a9c 0%, #1e5c7a 100%)`,
                        color: '#ffffff',
                        '&:hover': {
                            background: `linear-gradient(135deg, #3a8ab3 0%, #2d7a9c 100%)`,
                        },
                    },
                },
                {
                    props: { variant: 'outlined', color: 'primary' },
                    style: {
                        border: `1px solid ${alpha('#2d7a9c', 0.3)}`,
                        color: '#2d7a9c',
                        '&:hover': {
                            backgroundColor: alpha('#2d7a9c', 0.05),
                            border: `1px solid ${alpha('#2d7a9c', 0.5)}`,
                        },
                    },
                },
            ],
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: '#2d7a9c',
                },
            },
        },
    },
});

export const darkTheme = deadSpaceTheme;
export const lightTheme = deadSpaceLightTheme;