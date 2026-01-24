import { createTheme, alpha } from '@mui/material/styles';
import { deadSpaceBaseTheme } from "./BaseTheme/dsBaseTheme";
import { colors as darkThemeColors } from "./DarkTheme/Colors";
import { colors as lightThemeColors } from "./LightTheme/Colors";
import {generateRGBfromHEX} from "@/features/theme/model/utils";


const deadSpaceBlueShadows = [
    'none',
    `0 2px 8px ${alpha(darkThemeColors.primary.main, 0.15)}`,
    `0 4px 16px ${alpha(darkThemeColors.primary.main, 0.2)}`,
    `0 8px 24px ${alpha(darkThemeColors.primary.main, 0.25)}`,
    `0 12px 32px ${alpha(darkThemeColors.primary.main, 0.3)}`,
    `0 16px 40px ${alpha(darkThemeColors.primary.main, 0.35)}`,
    ...Array(19).fill('none'),
] as const;

export const deadSpaceTheme = createTheme({
    ...deadSpaceBaseTheme,
    shadows: deadSpaceBlueShadows as any,
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                ':root': {
                    // Определяем CSS переменные в HEX (для обычного использования)
                    '--color-primary-main': darkThemeColors.primary.main,
                    '--color-primary-light': darkThemeColors.primary.light,
                    '--color-primary-dark': darkThemeColors.primary.dark,
                    '--color-primary-contrast': darkThemeColors.primary.contrastText,
                    '--color-secondary-main': darkThemeColors.secondary.main,
                    '--color-secondary-light': darkThemeColors.secondary.light,
                    '--color-secondary-dark': darkThemeColors.secondary.dark,
                    '--color-secondary-contrast': darkThemeColors.secondary.contrastText,
                    '--color-background-default': darkThemeColors.background.default,
                    '--color-background-paper': darkThemeColors.background.paper,
                    '--color-text-primary': darkThemeColors.text.primary,
                    '--color-text-secondary': darkThemeColors.text.secondary,
                    '--color-text-disabled': darkThemeColors.text.disabled,
                    '--color-action-active': darkThemeColors.action.active,
                    '--color-action-disabled': darkThemeColors.action.disabled,

                    // Добавляем RGB переменные для использования с rgba()
                    '--color-primary-main-rgb': generateRGBfromHEX(darkThemeColors.primary.main),
                    '--color-primary-light-rgb': generateRGBfromHEX(darkThemeColors.primary.light),
                    '--color-primary-dark-rgb': generateRGBfromHEX(darkThemeColors.primary.dark),
                    '--color-secondary-main-rgb': generateRGBfromHEX(darkThemeColors.secondary.main),
                    '--color-secondary-light-rgb': generateRGBfromHEX(darkThemeColors.secondary.light),
                    '--color-secondary-dark-rgb': generateRGBfromHEX(darkThemeColors.secondary.dark),
                    '--color-background-default-rgb': generateRGBfromHEX(darkThemeColors.background.default),
                    '--color-background-paper-rgb': generateRGBfromHEX(darkThemeColors.background.paper),
                    '--color-text-primary-rgb': generateRGBfromHEX(darkThemeColors.text.primary),
                    '--color-text-secondary-rgb': generateRGBfromHEX(darkThemeColors.text.secondary),
                    '--color-text-disabled-rgb': generateRGBfromHEX(darkThemeColors.text.disabled),
                    '--color-action-active-rgb': generateRGBfromHEX(darkThemeColors.action.active),
                    '--color-action-disabled-rgb': generateRGBfromHEX(darkThemeColors.action.disabled),


                    // Дополнительные переменные для теней
                    '--shadow-widget': '0 4px 16px rgba(var(--color-primary-main-rgb), 0.2)',
                    '--shadow-widget-hover': '0 6px 20px rgba(var(--color-primary-main-rgb), 0.3)',
                },
                body: {
                    backgroundColor: darkThemeColors.background.default,
                    backgroundImage: `radial-gradient(circle at 50% 0%, ${darkThemeColors.background.paper} 0%, ${darkThemeColors.background.default} 100%)`,
                    scrollbarColor: `${alpha(darkThemeColors.primary.main, 0.3)} ${darkThemeColors.background.default}`,
                    '&::-webkit-scrollbar': {
                        width: '8px',
                        backgroundColor: 'transparent',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: alpha(darkThemeColors.background.paper, 0.5),
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: alpha(darkThemeColors.primary.main, 0.3),
                        borderRadius: '4px',
                        '&:hover': {
                            backgroundColor: alpha(darkThemeColors.primary.main, 0.5),
                        },
                    },
                },
                '::selection': {
                    backgroundColor: alpha(darkThemeColors.primary.main, 0.3),
                    color: darkThemeColors.text.primary,
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
                        background: `linear-gradient(135deg, ${alpha(darkThemeColors.primary.main, 0.9)} 0%, ${alpha(darkThemeColors.primary.dark, 0.9)} 100%)`,
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha(darkThemeColors.primary.main, 0.3)}`,
                        boxShadow: `0 4px 16px ${alpha(darkThemeColors.primary.main, 0.25)}`,
                        '&:hover': {
                            background: `linear-gradient(135deg, ${alpha(darkThemeColors.primary.light, 0.9)} 0%, ${alpha(darkThemeColors.primary.main, 0.9)} 100%)`,
                            boxShadow: `0 6px 20px ${alpha(darkThemeColors.primary.main, 0.35)}`,
                            border: `1px solid ${alpha(darkThemeColors.primary.main, 0.5)}`,
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        },
                    },
                },
                {
                    props: { variant: 'contained', color: 'secondary' },
                    style: {
                        background: `linear-gradient(135deg, ${alpha(darkThemeColors.secondary.main, 0.9)} 0%, ${alpha(darkThemeColors.secondary.dark, 0.9)} 100%)`,
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha(darkThemeColors.secondary.main, 0.3)}`,
                        boxShadow: `0 4px 16px ${alpha(darkThemeColors.secondary.main, 0.25)}`,
                        '&:hover': {
                            background: `linear-gradient(135deg, ${alpha(darkThemeColors.secondary.light, 0.9)} 0%, ${alpha(darkThemeColors.secondary.main, 0.9)} 100%)`,
                            boxShadow: `0 6px 20px ${alpha(darkThemeColors.secondary.main, 0.35)}`,
                            border: `1px solid ${alpha(darkThemeColors.secondary.main, 0.5)}`,
                        },
                    },
                },
                {
                    props: { variant: 'outlined', color: 'primary' },
                    style: {
                        backgroundColor: alpha(darkThemeColors.background.paper, 0.5),
                        border: `1px solid ${alpha(darkThemeColors.primary.main, 0.3)}`,
                        color: darkThemeColors.primary.light,
                        '&:hover': {
                            backgroundColor: alpha(darkThemeColors.primary.main, 0.1),
                            border: `1px solid ${alpha(darkThemeColors.primary.main, 0.5)}`,
                        },
                    },
                },
                {
                    props: { variant: 'outlined', color: 'secondary' },
                    style: {
                        backgroundColor: alpha(darkThemeColors.background.paper, 0.5),
                        border: `1px solid ${alpha(darkThemeColors.secondary.main, 0.3)}`,
                        color: darkThemeColors.secondary.light,
                        '&:hover': {
                            backgroundColor: alpha(darkThemeColors.secondary.main, 0.1),
                            border: `1px solid ${alpha(darkThemeColors.secondary.main, 0.5)}`,
                        },
                    },
                },
                {
                    props: { variant: 'text' },
                    style: {
                        color: darkThemeColors.primary.main,
                        '&:hover': {
                            backgroundColor: alpha(darkThemeColors.primary.main, 0.08),
                        },
                    },
                },
            ],
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha(darkThemeColors.background.paper, 0.8),
                    backdropFilter: 'blur(20px)',
                    borderBottom: `1px solid ${alpha(darkThemeColors.primary.main, 0.2)}`,
                    boxShadow: `0 2px 8px ${alpha('#000000', 0.3)}`,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha(darkThemeColors.background.paper, 0.7),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(darkThemeColors.primary.main, 0.2)}`,
                    borderRadius: 8,
                },
                elevation1: {
                    boxShadow: `0 2px 8px ${alpha(darkThemeColors.primary.main, 0.15)}`,
                },
                elevation2: {
                    boxShadow: `0 4px 16px ${alpha(darkThemeColors.primary.main, 0.2)}`,
                },
                elevation3: {
                    boxShadow: `0 8px 24px ${alpha(darkThemeColors.primary.main, 0.25)}`,
                },
            },
        },
        MuiCard: {
            variants: [
                {
                    props: { variant: 'contrast' },
                    style: ({ theme }) => ({
                        backgroundColor: '#1a2830',
                        backgroundImage: 'linear-gradient(rgba(255 255 255 / 0.07), rgba(255 255 255 / 0.07))',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(var(--color-primary-main-rgb), 0.4)',
                        boxShadow: `var(--shadow-widget), inset 0 0 0 1px rgba(var(--color-primary-light-rgb), 0.1)`,

                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '2px',
                            background: `linear-gradient(90deg, transparent, var(--color-primary-main), transparent)`,
                        },
                        '& .MuiTypography-root': {
                            color: 'var(--color-text-primary)',
                        },
                        '& .MuiTypography-h5': {
                            color: 'var(--color-primary-light)',
                        },
                        '& .MuiTypography-body2': {
                            color: 'var(--color-text-secondary)',
                        },
                    }),
                }
            ],
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha(darkThemeColors.background.paper, 0.5),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(darkThemeColors.primary.main, 0.2)}`,
                    borderRadius: 4,
                    transition: 'all 0.2s ease',
                    '&.Mui-focused': {
                        borderColor: alpha(darkThemeColors.primary.main, 0.5),
                        boxShadow: `0 0 0 2px ${alpha(darkThemeColors.primary.main, 0.1)}`,
                    },
                },
                input: {
                    color: darkThemeColors.text.primary,
                    '&::placeholder': {
                        color: alpha(darkThemeColors.primary.light, 0.6),
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(darkThemeColors.primary.main, 0.3),
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(darkThemeColors.primary.main, 0.5),
                        borderWidth: '2px',
                    },
                },
                notchedOutline: {
                    borderColor: alpha(darkThemeColors.primary.main, 0.2),
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
                    backgroundColor: alpha(darkThemeColors.primary.main, 0.2),
                    color: darkThemeColors.primary.light,
                    border: `1px solid ${alpha(darkThemeColors.primary.main, 0.3)}`,
                },
                colorSecondary: {
                    backgroundColor: alpha(darkThemeColors.secondary.main, 0.2),
                    color: darkThemeColors.secondary.light,
                    border: `1px solid ${alpha(darkThemeColors.secondary.main, 0.3)}`,
                },
                colorInfo: {
                    backgroundColor: alpha(darkThemeColors.info.main, 0.2),
                    color: darkThemeColors.info.light,
                    border: `1px solid ${alpha(darkThemeColors.info.main, 0.3)}`,
                },
                colorWarning: {
                    backgroundColor: alpha(darkThemeColors.warning.main, 0.2),
                    color: darkThemeColors.warning.light,
                    border: `1px solid ${alpha(darkThemeColors.warning.main, 0.3)}`,
                },
                colorError: {
                    backgroundColor: alpha(darkThemeColors.error.main, 0.2),
                    color: darkThemeColors.error.light,
                    border: `1px solid ${alpha(darkThemeColors.error.main, 0.3)}`,
                },
                colorSuccess: {
                    backgroundColor: alpha(darkThemeColors.success.main, 0.2),
                    color: darkThemeColors.success.light,
                    border: `1px solid ${alpha(darkThemeColors.success.main, 0.3)}`,
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
                    backgroundColor: alpha(darkThemeColors.info.main, 0.15),
                    borderColor: alpha(darkThemeColors.primary.main, 0.3),
                    color: darkThemeColors.primary.light,
                },
                standardSuccess: {
                    backgroundColor: alpha(darkThemeColors.success.main, 0.15),
                    borderColor: alpha(darkThemeColors.success.light, 0.3),
                    color: darkThemeColors.success.light,
                },
                standardWarning: {
                    backgroundColor: alpha(darkThemeColors.warning.main, 0.15),
                    borderColor: alpha(darkThemeColors.warning.light, 0.3),
                    color: darkThemeColors.warning.light,
                },
                standardError: {
                    backgroundColor: alpha(darkThemeColors.error.main, 0.15),
                    borderColor: alpha(darkThemeColors.error.light, 0.3),
                    color: darkThemeColors.error.light,
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                root: {
                    padding: '8px',
                },
                switchBase: {
                    color: alpha(darkThemeColors.text.disabled, 0.5),
                    '&.Mui-checked': {
                        color: darkThemeColors.primary.main,
                    },
                    '&.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: darkThemeColors.primary.main,
                        opacity: 0.8,
                    },
                },
                track: {
                    backgroundColor: alpha(darkThemeColors.text.disabled, 0.3),
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
                    backgroundColor: alpha(darkThemeColors.background.paper, 0.5),
                    borderRadius: 4,
                    height: '6px',
                    overflow: 'hidden',
                },
                bar: {
                    background: `linear-gradient(90deg, ${darkThemeColors.primary.main}, ${darkThemeColors.primary.dark})`,
                    borderRadius: 4,
                },
            },
        },
        MuiCircularProgress: {
            styleOverrides: {
                root: {
                    color: darkThemeColors.primary.main,
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: alpha(darkThemeColors.primary.main, 0.2),
                    borderWidth: '1px',
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: alpha(darkThemeColors.text.disabled, 0.7),
                    '&.Mui-checked': {
                        color: darkThemeColors.primary.main,
                    },
                },
            },
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    color: alpha(darkThemeColors.text.disabled, 0.7),
                    '&.Mui-checked': {
                        color: darkThemeColors.primary.main,
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${alpha(darkThemeColors.primary.main, 0.2)}`,
                    minHeight: '48px',
                },
                indicator: {
                    backgroundColor: darkThemeColors.primary.main,
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
                        color: darkThemeColors.primary.light,
                    },
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: darkThemeColors.primary.main,
                    textDecoration: 'none',
                    fontWeight: 500,
                    borderBottom: '1px solid transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        color: darkThemeColors.primary.light,
                        borderBottom: `1px solid ${alpha(darkThemeColors.primary.main, 0.5)}`,
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: darkThemeColors.primary.light,
                    '&:hover': {
                        backgroundColor: alpha(darkThemeColors.primary.main, 0.1),
                        color: darkThemeColors.primary.main,
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${alpha(darkThemeColors.primary.main, 0.1)}`,
                    padding: '16px',
                },
                head: {
                    fontWeight: 600,
                    color: darkThemeColors.primary.light,
                    backgroundColor: alpha(darkThemeColors.background.paper, 0.5),
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: alpha(darkThemeColors.primary.main, 0.05),
                    },
                    '&.Mui-selected': {
                        backgroundColor: alpha(darkThemeColors.primary.main, 0.1),
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: alpha(darkThemeColors.background.paper, 0.9),
                    backdropFilter: 'blur(20px)',
                    borderRight: `1px solid ${alpha(darkThemeColors.primary.main, 0.2)}`,
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundColor: alpha(darkThemeColors.background.paper, 0.9),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(darkThemeColors.primary.main, 0.2)}`,
                    boxShadow: `0 8px 32px ${alpha('#000000', 0.4)}`,
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: alpha(darkThemeColors.background.paper, 0.9),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(darkThemeColors.primary.main, 0.2)}`,
                    color: darkThemeColors.text.primary,
                    fontSize: '0.75rem',
                    padding: '8px 12px',
                    maxWidth: '300px',
                },
                arrow: {
                    color: alpha(darkThemeColors.background.paper, 0.9),
                    '&:before': {
                        border: `1px solid ${alpha(darkThemeColors.primary.main, 0.2)}`,
                    },
                },
            },
        },
        MuiSlider: {
            styleOverrides: {
                root: {
                    color: darkThemeColors.primary.main,
                    height: '4px',
                },
                track: {
                    border: 'none',
                },
                rail: {
                    backgroundColor: alpha(darkThemeColors.text.disabled, 0.3),
                },
                thumb: {
                    backgroundColor: darkThemeColors.primary.main,
                    '&:hover': {
                        boxShadow: `0 0 0 8px ${alpha(darkThemeColors.primary.main, 0.16)}`,
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    backgroundColor: alpha(darkThemeColors.background.paper, 0.5),
                    backdropFilter: 'blur(10px)',
                },
                icon: {
                    color: darkThemeColors.primary.light,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: alpha(darkThemeColors.background.paper, 0.9),
                    backdropFilter: 'blur(30px)',
                    border: `1px solid ${alpha(darkThemeColors.primary.main, 0.2)}`,
                },
            },
        },
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha(darkThemeColors.background.default, 0.8),
                    backdropFilter: 'blur(4px)',
                },
            },
        },
    },
});

// Светлая версия темы
export const deadSpaceLightTheme = createTheme({
    ...deadSpaceBaseTheme,
    ...deadSpaceTheme,
    palette: {
        ...deadSpaceTheme.palette,
        mode: 'light',
        primary: {
            main: lightThemeColors.primary.main,
            light: lightThemeColors.primary.light,
            dark: lightThemeColors.primary.dark,
            contrastText: lightThemeColors.primary.contrastText,
        },
        secondary: {
            main: lightThemeColors.secondary.main,
            light: lightThemeColors.secondary.light,
            dark: lightThemeColors.secondary.dark,
            contrastText: lightThemeColors.secondary.contrastText,
        },
        background: {
            default: lightThemeColors.background.default,
            paper: lightThemeColors.background.paper,
        },
        text: {
            primary: lightThemeColors.text.primary,
            secondary: lightThemeColors.text.secondary,
            disabled: lightThemeColors.text.disabled,
        },
        action: {
            ...deadSpaceTheme.palette.action,
            active: lightThemeColors.action.active,
            disabled: lightThemeColors.action.disabled,
        },
        divider: alpha(lightThemeColors.primary.main, 0.2),
    },
    typography: {
        ...deadSpaceTheme.typography,
        h1: {
            ...deadSpaceTheme.typography.h1,
            color: lightThemeColors.text.primary,
        },
        h2: {
            ...deadSpaceTheme.typography.h2,
            color: lightThemeColors.text.primary,
        },
        h3: {
            ...deadSpaceTheme.typography.h3,
            color: lightThemeColors.text.secondary,
        },
        h4: {
            ...deadSpaceTheme.typography.h4,
            color: lightThemeColors.text.secondary,
        },
        h5: {
            ...deadSpaceTheme.typography.h5,
            color: lightThemeColors.text.primary,
        },
        h6: {
            ...deadSpaceTheme.typography.h6,
            color: lightThemeColors.text.secondary,
        },
        body1: {
            ...deadSpaceTheme.typography.body1,
            color: lightThemeColors.text.primary,
        },
        body2: {
            ...deadSpaceTheme.typography.body2,
            color: lightThemeColors.text.secondary,
        },
        overline: {
            ...deadSpaceTheme.typography.overline,
            color: lightThemeColors.text.secondary,
        },
    },
    components: {
        ...deadSpaceTheme.components,
        MuiCssBaseline: {
            styleOverrides: {
                ':root': {
                    // Обновляем переменные для светлой темы
                    '--color-primary-main': lightThemeColors.primary.main,
                    '--color-primary-light': lightThemeColors.primary.light,
                    '--color-primary-dark': lightThemeColors.primary.dark,
                    '--color-primary-contrast': lightThemeColors.primary.contrastText,
                    '--color-secondary-main': lightThemeColors.secondary.main,
                    '--color-secondary-light': lightThemeColors.secondary.light,
                    '--color-secondary-dark': lightThemeColors.secondary.dark,
                    '--color-secondary-contrast': lightThemeColors.secondary.contrastText,
                    '--color-background-default': lightThemeColors.background.default,
                    '--color-background-paper': lightThemeColors.background.paper,
                    '--color-text-primary': lightThemeColors.text.primary,
                    '--color-text-secondary': lightThemeColors.text.secondary,
                    '--color-text-disabled': lightThemeColors.text.disabled,
                    '--color-action-active': lightThemeColors.action.active,
                    '--color-action-disabled': lightThemeColors.action.disabled,

                    // RGB переменные для светлой темы
                    '--color-primary-main-rgb': generateRGBfromHEX(lightThemeColors.primary.main),
                    '--color-primary-light-rgb': generateRGBfromHEX(lightThemeColors.primary.light),
                    '--color-primary-dark-rgb': generateRGBfromHEX(lightThemeColors.primary.dark),
                    '--color-secondary-main-rgb': generateRGBfromHEX(lightThemeColors.secondary.main),
                    '--color-secondary-light-rgb': generateRGBfromHEX(lightThemeColors.secondary.light),
                    '--color-secondary-dark-rgb': generateRGBfromHEX(lightThemeColors.secondary.dark),
                    '--color-background-default-rgb': generateRGBfromHEX(lightThemeColors.background.default),
                    '--color-background-paper-rgb': generateRGBfromHEX(lightThemeColors.background.paper),
                    '--color-text-primary-rgb': generateRGBfromHEX(lightThemeColors.text.primary),
                    '--color-text-secondary-rgb': generateRGBfromHEX(lightThemeColors.text.secondary),
                    '--color-text-disabled-rgb': generateRGBfromHEX(lightThemeColors.text.disabled),
                    '--color-action-active-rgb': generateRGBfromHEX(lightThemeColors.action.active),
                    '--color-action-disabled-rgb': generateRGBfromHEX(lightThemeColors.action.disabled),

                    // Тени для светлой темы
                    '--shadow-widget': '0 4px 16px rgba(var(--color-primary-main-rgb), 0.15)',
                    '--shadow-widget-hover': '0 6px 20px rgba(var(--color-primary-main-rgb), 0.25)'
                },
                body: {
                    backgroundColor: lightThemeColors.background.default,
                    backgroundImage: 'none',
                    scrollbarColor: `${alpha(lightThemeColors.primary.main, 0.3)} ${lightThemeColors.background.default}`,
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: alpha(lightThemeColors.primary.light, 0.1),
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: alpha(lightThemeColors.primary.main, 0.3),
                        '&:hover': {
                            backgroundColor: alpha(lightThemeColors.primary.main, 0.5),
                        },
                    },
                },
                '::selection': {
                    backgroundColor: alpha(lightThemeColors.primary.main, 0.2),
                    color: lightThemeColors.text.primary,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    borderBottom: `1px solid ${alpha(theme.palette.primary.light, 0.3)}`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',

                    '& .MuiIconButton-root': {
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.contrastText, 0.1),
                        },
                    },

                    '& .MuiTypography-root': {
                        color: theme.palette.primary.contrastText,
                    },
                }),
            },
        },
        MuiPaper: {
            variants: [
                {
                    props: { variant: 'contrast' },
                    style: ({ theme }) => ({
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.primary.contrastText || '#ffffff',
                        border: `1px solid ${theme.palette.primary.main}`,

                        '& .MuiTypography-root': {
                            color: 'inherit',
                        },
                        '& .MuiButton-contained': {
                            backgroundColor: alpha('#ffffff', 0.2),
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: alpha('#ffffff', 0.3),
                            },
                        },
                    }),
                }
            ],
            styleOverrides: {
                root: {
                    backgroundColor: lightThemeColors.background.paper,
                    border: `1px solid ${alpha(lightThemeColors.primary.light, 0.2)}`,
                },
                elevation1: {
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                },
                elevation2: {
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                },
                elevation3: {
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                },
            },
        },
        MuiCard: {
            ...deadSpaceTheme.components?.MuiCard,
            variants: [
                ...(deadSpaceTheme.components?.MuiCard?.variants || []),
                {
                    props: { variant: 'contrast' },
                    style: {

                        backgroundColor: 'rgba(var(--color-primary-light-rgb), 0.5)',
                        boxShadow: `
              0 4px 16px rgba(var(--color-primary-main-rgb), 0.15),
              inset 0 0 0 1px rgba(var(--color-primary-light-rgb), 0.08)
            `,

                        border: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',

                        '&::before': {
                            background: `linear-gradient(
                90deg,
                transparent,
                var(--color-primary-dark), // Более темный цвет для контраста
                transparent
              )`,
                        },

                        '&::after': {
                            filter: `
                        brightness(0.3) 
                        invert(1)
                        drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3))
                        drop-shadow(0 6px 12px rgba(var(--color-primary-dark-rgb, 122, 208, 240), 0.3))
                        drop-shadow(0 0 15px rgba(var(--color-primary-dark-rgb, 160, 224, 255), 0.2))
                    `
                        },

                        '& .MuiTypography-root': {
                            color: 'var(--color-primary-contrast)',
                        },

                    },
                },
            ]
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: lightThemeColors.text.secondary,
                    '&:hover': {
                        color: lightThemeColors.primary.dark,
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: lightThemeColors.text.secondary,
                    '&:hover': {
                        backgroundColor: alpha(lightThemeColors.text.secondary, 0.1),
                        color: lightThemeColors.primary.contrastText
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    color: lightThemeColors.text.secondary,
                    backgroundColor: '#f8fcfd',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        color: lightThemeColors.primary.dark,
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: alpha(lightThemeColors.primary.main, 0.1),
                    color: lightThemeColors.primary.dark,
                    border: `1px solid ${alpha(lightThemeColors.primary.main, 0.3)}`,
                },
                colorSecondary: {
                    backgroundColor: alpha(lightThemeColors.secondary.main, 0.1),
                    color: lightThemeColors.secondary.dark,
                    border: `1px solid ${alpha(lightThemeColors.secondary.main, 0.3)}`,
                },
            },
        },
        MuiButton: {
            variants: [
                {
                    props: { variant: 'contained', color: 'primary' },
                    style: {
                        background: `linear-gradient(135deg, ${lightThemeColors.primary.main} 0%, ${lightThemeColors.primary.dark} 100%)`,
                        color: lightThemeColors.primary.contrastText,
                        '&:hover': {
                            background: `linear-gradient(135deg, ${lightThemeColors.primary.light} 0%, ${lightThemeColors.primary.main} 100%)`,
                        },
                    },
                },
                {
                    props: { variant: 'outlined', color: 'primary' },
                    style: {
                        border: `1px solid ${alpha(lightThemeColors.primary.main, 0.3)}`,
                        color: lightThemeColors.primary.main,
                        '&:hover': {
                            backgroundColor: alpha(lightThemeColors.primary.main, 0.05),
                            border: `1px solid ${alpha(lightThemeColors.primary.main, 0.5)}`,
                        },
                    },
                },
            ],
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: lightThemeColors.primary.main,
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha(lightThemeColors.background.paper, 0.8),
                    border: `1px solid ${alpha(lightThemeColors.primary.main, 0.2)}`,
                },
                input: {
                    color: lightThemeColors.text.primary,
                },
            },
        },
    },
});

export const darkTheme = deadSpaceTheme;
export const lightTheme = deadSpaceLightTheme;