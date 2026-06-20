import { createTheme, alpha } from '@mui/material/styles';
import type { PaletteOptions } from '@mui/material/styles';
import { baseThemeOptions } from './BaseTheme/dsBaseTheme';
import { colors as darkColors } from './DarkTheme/Colors';
import { colors as lightColors } from './LightTheme/Colors';
import { buildCssVars, type ThemeColorTokens } from './model/utils';

/**
 * Единая тема на нативной системе цветовых схем MUI v6 (`colorSchemes` + CSS-переменные).
 *
 * Зачем так:
 *  - Раньше было два отдельных объекта темы, а активный выбирался React-стейтом, который
 *    на сервере и при первом клиентском рендере всегда был 'light'. Из-за этого при
 *    загрузке сохранённой тёмной темы возникала вспышка светлой темы (FOUC) после того,
 *    как useEffect переключал стейт.
 *  - Теперь одна тема описывает обе схемы. MUI генерирует СТАТИЧЕСКИЙ CSS для обеих схем,
 *    scoped по селектору `[data-theme="..."]`. Блокирующий `<InitColorSchemeScript />`
 *    выставляет нужный `data-theme` на <html> ДО первой отрисовки → браузер сразу красит
 *    правильными цветами. Гидрация не ломается: объект темы один, разметка идентична на
 *    сервере и клиенте.
 */

// Тени-«свечения» в фирменном синем — применяются к поверхностям с дефолтной elevation.
const deadSpaceBlueShadows = [
    'none',
    `0 2px 8px ${alpha(darkColors.primary.main, 0.15)}`,
    `0 4px 16px ${alpha(darkColors.primary.main, 0.2)}`,
    `0 8px 24px ${alpha(darkColors.primary.main, 0.25)}`,
    `0 12px 32px ${alpha(darkColors.primary.main, 0.3)}`,
    `0 16px 40px ${alpha(darkColors.primary.main, 0.35)}`,
    ...Array(19).fill('none'),
] as const;

// Единая фабрика палитры action — производит оттенки от primary текущей схемы.
const buildAction = (c: ThemeColorTokens) => ({
    active: c.action.active,
    hover: alpha(c.primary.main, 0.08),
    hoverOpacity: 0.08,
    selected: alpha(c.primary.main, 0.16),
    selectedOpacity: 0.16,
    disabled: c.action.disabled,
    disabledBackground: alpha(c.action.disabled, 0.12),
    disabledOpacity: 0.38,
    focus: alpha(c.primary.main, 0.12),
    focusOpacity: 0.12,
    activatedOpacity: 0.24,
});

const buildPalette = (c: ThemeColorTokens, mode: 'light' | 'dark'): PaletteOptions => ({
    mode,
    primary: {
        main: c.primary.main,
        light: c.primary.light,
        dark: c.primary.dark,
        contrastText: c.primary.contrastText,
    },
    secondary: {
        main: c.secondary.main,
        light: c.secondary.light,
        dark: c.secondary.dark,
        contrastText: c.secondary.contrastText,
    },
    info: { main: c.info.main, light: c.info.light, dark: c.info.dark },
    warning: { main: c.warning.main, light: c.warning.light, dark: c.warning.dark },
    error: { main: c.error.main, light: c.error.light, dark: c.error.dark },
    success: { main: c.success.main, light: c.success.light, dark: c.success.dark },
    background: { default: c.background.default, paper: c.background.paper },
    text: { primary: c.text.primary, secondary: c.text.secondary, disabled: c.text.disabled },
    divider: alpha(c.primary.main, 0.2),
    action: buildAction(c),
});

export const theme = createTheme({
    ...baseThemeOptions,

    cssVariables: {
        // Генерируем правила вида `[data-theme="dark"] { ... }` / `[data-theme="light"] { ... }`.
        colorSchemeSelector: 'data-theme',
    },
    // Схема по умолчанию для `:root` (когда атрибут ещё не выставлен на SSR) — тёмная.
    defaultColorScheme: 'dark',
    colorSchemes: {
        dark: { palette: buildPalette(darkColors, 'dark') },
        light: { palette: buildPalette(lightColors, 'light') },
    },

    shadows: deadSpaceBlueShadows as unknown as ReturnType<typeof createTheme>['shadows'],

    components: {
        ...baseThemeOptions.components,

        // --- CSS-переменные обеих схем + специфика body, статично и scoped ---
        MuiCssBaseline: {
            styleOverrides: () => ({
                ':root, [data-theme="dark"]': {
                    ...buildCssVars(darkColors),
                    '--shadow-widget': '0 4px 16px rgba(var(--color-primary-main-rgb), 0.2)',
                    '--shadow-widget-hover': '0 6px 20px rgba(var(--color-primary-main-rgb), 0.3)',
                },
                '[data-theme="light"]': {
                    ...buildCssVars(lightColors),
                    '--shadow-widget': '0 4px 16px rgba(var(--color-primary-main-rgb), 0.15)',
                    '--shadow-widget-hover': '0 6px 20px rgba(var(--color-primary-main-rgb), 0.25)',
                },
                body: {
                    backgroundColor: 'var(--color-background-default)',
                    backgroundImage:
                        'radial-gradient(circle at 50% 0%, var(--color-background-paper) 0%, var(--color-background-default) 100%)',
                    scrollbarColor:
                        'rgba(var(--color-primary-main-rgb), 0.3) var(--color-background-default)',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                        backgroundColor: 'transparent',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.5)',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.3)',
                        borderRadius: '4px',
                        '&:hover': {
                            backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.5)',
                        },
                    },
                },
                // Светлая схема: ровный фон без радиального градиента + свой трек скроллбара.
                '[data-theme="light"] body': {
                    backgroundImage: 'none',
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'rgba(var(--color-primary-light-rgb), 0.1)',
                    },
                },
                '::selection': {
                    backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.3)',
                    color: 'var(--color-text-primary)',
                },
                '@font-face': {
                    fontFamily: 'Roboto Mono',
                    fontStyle: 'normal',
                    fontWeight: '300 700',
                    fontDisplay: 'swap',
                    src: `
                        local('Roboto Mono'),
                        local('RobotoMono-Regular'),
                        url('/fonts/roboto-mono/RobotoMono-VariableFont_wght.ttf') format('truetype-variations'),
                        url('/fonts/roboto-mono/RobotoMono-VariableFont_wght.ttf') format('truetype')
                    `,
                },
            }),
        },

        // --- AppBar: тёмная — стеклянная панель; светлая — заливка primary.light ---
        MuiAppBar: {
            styleOverrides: {
                root: ({ theme: t }) => [
                    {
                        borderBottom: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.8)',
                        backdropFilter: 'blur(20px)',
                    },
                    t.applyStyles('light', {
                        backgroundColor: 'rgba(var(--color-primary-light-rgb), 0.7)',
                        color: 'var(--color-primary-contrast)',
                        borderBottom: '1px solid rgba(var(--color-primary-light-rgb), 0.3)',
                        '& .MuiIconButton-root': {
                            color: 'var(--color-primary-contrast)',
                            '&:hover': {
                                backgroundColor: 'rgba(var(--color-primary-contrast-rgb), 0.1)',
                            },
                        },
                        '& .MuiTypography-root': {
                            color: 'var(--color-primary-contrast)',
                        },
                    }),
                ],
            },
        },

        // --- IconButton ---
        MuiIconButton: {
            styleOverrides: {
                root: ({ theme: t }) => [
                    {
                        color: 'var(--color-primary-light)',
                        '&:hover': {
                            backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.1)',
                            color: 'var(--color-primary-main)',
                        },
                    },
                    t.applyStyles('light', {
                        color: 'var(--color-text-secondary)',
                        '&:hover': {
                            backgroundColor: 'rgba(var(--color-text-secondary-rgb), 0.1)',
                            color: 'var(--color-primary-contrast)',
                        },
                    }),
                ],
            },
        },

        // --- Button: светлая схема использует сплошные заливки вместо полупрозрачных ---
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
                        background:
                            'linear-gradient(135deg, rgba(var(--color-primary-main-rgb), 0.9) 0%, rgba(var(--color-primary-dark-rgb), 0.9) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(var(--color-primary-main-rgb), 0.3)',
                        boxShadow: '0 4px 16px rgba(var(--color-primary-main-rgb), 0.25)',
                        '&:hover': {
                            background:
                                'linear-gradient(135deg, rgba(var(--color-primary-light-rgb), 0.9) 0%, rgba(var(--color-primary-main-rgb), 0.9) 100%)',
                            boxShadow: '0 6px 20px rgba(var(--color-primary-main-rgb), 0.35)',
                            border: '1px solid rgba(var(--color-primary-main-rgb), 0.5)',
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        },
                    },
                },
                {
                    props: { variant: 'contained', color: 'secondary' },
                    style: {
                        background:
                            'linear-gradient(135deg, rgba(var(--color-secondary-main-rgb), 0.9) 0%, rgba(var(--color-secondary-dark-rgb), 0.9) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(var(--color-secondary-main-rgb), 0.3)',
                        boxShadow: '0 4px 16px rgba(var(--color-secondary-main-rgb), 0.25)',
                        '&:hover': {
                            background:
                                'linear-gradient(135deg, rgba(var(--color-secondary-light-rgb), 0.9) 0%, rgba(var(--color-secondary-main-rgb), 0.9) 100%)',
                            boxShadow: '0 6px 20px rgba(var(--color-secondary-main-rgb), 0.35)',
                            border: '1px solid rgba(var(--color-secondary-main-rgb), 0.5)',
                        },
                    },
                },
                {
                    props: { variant: 'outlined', color: 'primary' },
                    style: {
                        backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.5)',
                        border: '1px solid rgba(var(--color-primary-main-rgb), 0.3)',
                        color: 'var(--color-primary-light)',
                        '&:hover': {
                            backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.1)',
                            border: '1px solid rgba(var(--color-primary-main-rgb), 0.5)',
                        },
                    },
                },
                {
                    props: { variant: 'outlined', color: 'secondary' },
                    style: {
                        backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.5)',
                        border: '1px solid rgba(var(--color-secondary-main-rgb), 0.3)',
                        color: 'var(--color-secondary-light)',
                        '&:hover': {
                            backgroundColor: 'rgba(var(--color-secondary-main-rgb), 0.1)',
                            border: '1px solid rgba(var(--color-secondary-main-rgb), 0.5)',
                        },
                    },
                },
                {
                    props: { variant: 'text' },
                    style: {
                        color: 'var(--color-primary-main)',
                        '&:hover': {
                            backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.08)',
                        },
                    },
                },
                // Светлая схема — сплошные заливки (выигрывают по специфичности под [data-theme="light"])
                {
                    props: { variant: 'contained', color: 'primary' },
                    style: ({ theme: t }) =>
                        t.applyStyles('light', {
                            background:
                                'linear-gradient(135deg, var(--color-primary-main) 0%, var(--color-primary-dark) 100%)',
                            color: 'var(--color-primary-contrast)',
                            '&:hover': {
                                background:
                                    'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-main) 100%)',
                            },
                        }),
                },
                {
                    props: { variant: 'outlined', color: 'primary' },
                    style: ({ theme: t }) =>
                        t.applyStyles('light', {
                            border: '1px solid rgba(var(--color-primary-main-rgb), 0.3)',
                            color: 'var(--color-primary-main)',
                            '&:hover': {
                                backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.05)',
                                border: '1px solid rgba(var(--color-primary-main-rgb), 0.5)',
                            },
                        }),
                },
            ],
        },

        // --- Paper: тёмная — полупрозрачное стекло; светлая — сплошной фон, мягкие тени ---
        MuiPaper: {
            styleOverrides: {
                root: ({ theme: t }) => [
                    {
                        backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.7)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',
                        borderRadius: 8,
                    },
                    t.applyStyles('light', {
                        backgroundColor: 'var(--color-background-paper)',
                        border: '1px solid rgba(var(--color-primary-light-rgb), 0.2)',
                    }),
                ],
                elevation1: ({ theme: t }) => [
                    { boxShadow: '0 2px 8px rgba(var(--color-primary-main-rgb), 0.15)' },
                    t.applyStyles('light', { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }),
                ],
                elevation2: ({ theme: t }) => [
                    { boxShadow: '0 4px 16px rgba(var(--color-primary-main-rgb), 0.2)' },
                    t.applyStyles('light', { boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }),
                ],
                elevation3: ({ theme: t }) => [
                    { boxShadow: '0 8px 24px rgba(var(--color-primary-main-rgb), 0.25)' },
                    t.applyStyles('light', { boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }),
                ],
            },
            variants: [
                ...(baseThemeOptions.components?.MuiPaper?.variants ?? []),
                {
                    props: { variant: 'contrast' },
                    style: ({ theme: t }) =>
                        t.applyStyles('light', {
                            backgroundColor: 'rgba(var(--color-primary-light-rgb), 0.5)',
                            boxShadow: `0 4px 16px rgba(var(--color-primary-dark-rgb), 0.3),
                                inset 0 0 0 2px rgba(var(--color-primary-light-rgb), 0.1)`,
                            border: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',
                            '& .MuiTypography-root': {
                                color: 'var(--color-text-primary)',
                            },
                            '& .MuiTypography-h5': {
                                color: 'var(--color-primary-dark)',
                            },
                        }),
                },
                {
                    props: { variant: 'iced' },
                    style: ({ theme: t }) =>
                        t.applyStyles('light', {
                            backgroundColor: 'var(--color-background-paper)',
                            backgroundImage: `
                                linear-gradient(135deg,
                                    rgba(var(--color-primary-light-rgb), 0.08) 0%,
                                    rgba(var(--color-primary-light-rgb), 0.03) 25%,
                                    transparent 50%,
                                    rgba(var(--color-primary-dark-rgb), 0.03) 75%,
                                    rgba(var(--color-primary-dark-rgb), 0.08) 100%
                                ),
                                linear-gradient(rgba(var(--color-primary-light-rgb), 0.04), rgba(var(--color-primary-light-rgb), 0.04))
                            `,
                            border: '1px solid rgba(var(--color-primary-light-rgb), 0.3)',
                            boxShadow: `
                                0 4px 12px rgba(var(--color-primary-main-rgb), 0.08),
                                0 1px 3px rgba(var(--color-primary-main-rgb), 0.05),
                                inset 0 0 20px rgba(var(--color-primary-light-rgb), 0.06),
                                inset 0 0 30px rgba(var(--color-primary-light-rgb), 0.03),
                                inset 0 1px 0 rgba(255, 255, 255, 0.9),
                                inset 0 -1px 0 rgba(var(--color-primary-dark-rgb), 0.08)
                            `,
                            backdropFilter: 'blur(6px)',
                        }),
                },
            ],
        },

        // --- Card ---
        MuiCard: {
            variants: [
                ...(baseThemeOptions.components?.MuiCard?.variants ?? []),
                {
                    props: { variant: 'contrast' },
                    style: ({ theme: t }) =>
                        t.applyStyles('light', {
                            backgroundColor: 'rgba(var(--color-primary-light-rgb), 0.5)',
                            boxShadow: `0 4px 16px rgba(var(--color-primary-dark-rgb), 0.3),
                                inset 0 0 0 2px rgba(var(--color-primary-light-rgb), 0.1)`,
                            border: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',
                            '& .MuiTypography-root': {
                                color: 'var(--color-text-primary)',
                            },
                            '& .MuiTypography-h5': {
                                color: 'var(--color-primary-dark)',
                            },
                        }),
                },
            ],
        },

        // --- Link ---
        MuiLink: {
            styleOverrides: {
                root: ({ theme: t }) => [
                    {
                        textDecoration: 'none',
                        fontWeight: 500,
                        borderBottom: '1px solid rgba(var(--color-primary-main-rgb), 0.5)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            color: 'var(--color-primary-light)',
                            borderBottom: '1px solid rgba(var(--color-primary-main-rgb), 0.8)',
                        },
                    },
                    t.applyStyles('light', {
                        color: 'var(--color-text-secondary)',
                        '&:hover': {
                            color: 'var(--color-primary-dark)',
                        },
                    }),
                ],
            },
        },

        // --- TableCell ---
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgba(var(--color-primary-main-rgb), 0.1)',
                    padding: '16px',
                },
                head: ({ theme: t }) => [
                    {
                        fontWeight: 600,
                        color: 'var(--color-primary-light)',
                        backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.5)',
                    },
                    t.applyStyles('light', {
                        color: 'var(--color-text-secondary)',
                        backgroundColor: 'var(--color-background-paper)',
                    }),
                ],
            },
        },

        // --- Tab ---
        MuiTab: {
            styleOverrides: {
                root: ({ theme: t }) => [
                    {
                        fontWeight: 500,
                        letterSpacing: '0.5px',
                        minHeight: '48px',
                        padding: '12px 16px',
                        '&.Mui-selected': {
                            color: 'var(--color-primary-light)',
                        },
                    },
                    t.applyStyles('light', {
                        '&.Mui-selected': {
                            color: 'var(--color-primary-dark)',
                        },
                    }),
                ],
            },
        },

        // --- Chip ---
        MuiChip: {
            styleOverrides: {
                ...baseThemeOptions.components?.MuiChip?.styleOverrides,
                colorPrimary: ({ theme: t }) => [
                    {
                        backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.2)',
                        color: 'var(--color-primary-light)',
                        border: '1px solid rgba(var(--color-primary-main-rgb), 0.3)',
                    },
                    t.applyStyles('light', {
                        backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.1)',
                        color: 'var(--color-primary-dark)',
                    }),
                ],
                colorSecondary: ({ theme: t }) => [
                    {
                        backgroundColor: 'rgba(var(--color-secondary-main-rgb), 0.2)',
                        color: 'var(--color-secondary-light)',
                        border: '1px solid rgba(var(--color-secondary-main-rgb), 0.3)',
                    },
                    t.applyStyles('light', {
                        backgroundColor: 'rgba(var(--color-secondary-main-rgb), 0.1)',
                        color: 'var(--color-secondary-dark)',
                    }),
                ],
            },
        },

        // --- InputBase ---
        MuiInputBase: {
            styleOverrides: {
                root: ({ theme: t }) => [
                    {
                        backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.5)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',
                        borderRadius: 4,
                        transition: 'all 0.2s ease',
                        '&.Mui-focused': {
                            borderColor: 'rgba(var(--color-primary-main-rgb), 0.5)',
                            boxShadow: '0 0 0 2px rgba(var(--color-primary-main-rgb), 0.1)',
                        },
                    },
                    t.applyStyles('light', {
                        backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.8)',
                    }),
                ],
                input: {
                    color: 'var(--color-text-primary)',
                    '&::placeholder': {
                        color: 'rgba(var(--color-primary-light-rgb), 0.6)',
                    },
                },
            },
        },
    },
});

// Обратная совместимость по именам экспортов (теперь это одна и та же тема для обеих схем).
export const darkTheme = theme;
export const lightTheme = theme;
