import { createTheme, alpha } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { deadSpaceBaseTheme } from "./BaseTheme/dsBaseTheme";
import { colors as darkThemeColors } from "./DarkTheme/Colors";
import { colors as lightThemeColors } from "./LightTheme/Colors";
import {buildCssVars} from "@/features/theme/model/utils";


const deadSpaceBlueShadows = [
    'none',
    `0 2px 8px ${alpha(darkThemeColors.primary.main, 0.15)}`,
    `0 4px 16px ${alpha(darkThemeColors.primary.main, 0.2)}`,
    `0 8px 24px ${alpha(darkThemeColors.primary.main, 0.25)}`,
    `0 12px 32px ${alpha(darkThemeColors.primary.main, 0.3)}`,
    `0 16px 40px ${alpha(darkThemeColors.primary.main, 0.35)}`,
    ...Array(19).fill('none'),
] as const;


export const deadSpaceTheme = createTheme(
    deepmerge(deadSpaceBaseTheme, {
        cssVariables: true,
        palette: {
            mode: 'dark',
            primary: {
                main: darkThemeColors.primary.main,
                light: darkThemeColors.primary.light,
                dark: darkThemeColors.primary.dark,
                contrastText: darkThemeColors.primary.contrastText,
            },
            secondary: {
                main: darkThemeColors.secondary.main,
                light: darkThemeColors.secondary.light,
                dark: darkThemeColors.secondary.dark,
                contrastText: darkThemeColors.secondary.contrastText,
            },
            info: {
                main: darkThemeColors.info.main,
                light: darkThemeColors.info.light,
                dark: darkThemeColors.info.dark,
            },
            warning: {
                main: darkThemeColors.warning.main,
                light: darkThemeColors.warning.light,
                dark: darkThemeColors.warning.dark,
            },
            error: {
                main: darkThemeColors.error.main,
                light: darkThemeColors.error.light,
                dark: darkThemeColors.error.dark,
            },
            success: {
                main: darkThemeColors.success.main,
                light: darkThemeColors.success.light,
                dark: darkThemeColors.success.dark,
            },
            background: {
                default: darkThemeColors.background.default,
                paper: darkThemeColors.background.paper,
            },
            text: {
                primary: darkThemeColors.text.primary,
                secondary: darkThemeColors.text.secondary,
                disabled: darkThemeColors.text.disabled,
            },
            divider: alpha(darkThemeColors.primary.main, 0.2),
            action: {
                active: darkThemeColors.action.active,
                hover: alpha(darkThemeColors.primary.main, 0.08),
                hoverOpacity: 0.08,
                selected: alpha(darkThemeColors.primary.main, 0.16),
                selectedOpacity: 0.16,
                disabled: darkThemeColors.action.disabled,
                disabledBackground: alpha(darkThemeColors.action.disabled, 0.12),
                disabledOpacity: 0.38,
                focus: alpha(darkThemeColors.primary.main, 0.12),
                focusOpacity: 0.12,
                activatedOpacity: 0.24,
            },
        },
        shadows: deadSpaceBlueShadows as any,
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    ':root': {
                        ...buildCssVars(darkThemeColors),
                        '--shadow-widget': '0 4px 16px rgba(var(--color-primary-main-rgb), 0.2)',
                        '--shadow-widget-hover': '0 6px 20px rgba(var(--color-primary-main-rgb), 0.3)',
                    }
                }
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.8)',
                        backdropFilter: 'blur(20px)',
                    },
                },
            },
        }
    })
);

// Светлая версия темы
export const deadSpaceLightTheme = createTheme(
    deepmerge(deadSpaceBaseTheme, {
        cssVariables: true,
        palette: {
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
            info: {
                main: lightThemeColors.info.main,
                light: lightThemeColors.info.light,
                dark: lightThemeColors.info.dark,
            },
            warning: {
                main: lightThemeColors.warning.main,
                light: lightThemeColors.warning.light,
                dark: lightThemeColors.warning.dark,
            },
            error: {
                main: lightThemeColors.error.main,
                light: lightThemeColors.error.light,
                dark: lightThemeColors.error.dark,
            },
            success: {
                main: lightThemeColors.success.main,
                light: lightThemeColors.success.light,
                dark: lightThemeColors.success.dark,
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
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    ':root': {
                        colorScheme: 'light',
                        ...buildCssVars(lightThemeColors),
                        '--shadow-widget': '0 4px 16px rgba(var(--color-primary-main-rgb), 0.15)',
                        '--shadow-widget-hover': '0 6px 20px rgba(var(--color-primary-main-rgb), 0.25)',
                    },
                    body: {
                        backgroundImage: 'none',
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'rgba(var(--color-primary-light-rgb), 0.1)',
                        },
                    },
                },
            },
            MuiButton: {
                variants: [
                    {
                        props: { variant: 'contained', color: 'primary' },
                        style: {
                            background: 'linear-gradient(135deg, var(--color-primary-main) 0%, var(--color-primary-dark) 100%)',
                            color: 'var(--color-primary-contrast)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-main) 100%)',
                            },
                        },
                    },
                    {
                        props: { variant: 'outlined', color: 'primary' },
                        style: {
                            border: '1px solid rgba(var(--color-primary-main-rgb), 0.3)',
                            color: 'var(--color-primary-main)',
                            '&:hover': {
                                backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.05)',
                                border: '1px solid rgba(var(--color-primary-main-rgb), 0.5)',
                            },
                        },
                    },
                ],
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        color: 'var(--color-text-secondary)',
                        '&:hover': {
                            backgroundColor: 'rgba(var(--color-text-secondary-rgb), 0.1)',
                            color: 'var(--color-primary-contrast)',
                        },
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
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
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'var(--color-background-paper)',
                        border: '1px solid rgba(var(--color-primary-light-rgb), 0.2)',
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
                variants: [
                    ...(deadSpaceTheme.components?.MuiPaper?.variants || []),
                    {
                        props: { variant: 'contrast' },
                        style: {
                            backgroundColor: 'rgba(var(--color-primary-light-rgb), 0.5)',
                            boxShadow: `0 4px 16px rgba(var(--color-primary-dark-rgb), 0.3),
                    inset 0 0 0 2px rgba(var(--color-primary-light-rgb), 0.1)
                `,
                            border: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',

                            '& .MuiTypography-root': {
                                color: 'var(--color-text-primary)',
                            },

                            '& .MuiTypography-h5': {
                                color: 'var(--color-primary-dark)',
                            },
                        },
                    },
                    {
                        props: { variant: 'iced' },
                        style: {
                            backgroundColor: 'var(--color-background-paper)', // #ffffff
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
                            position: 'relative',
                            backdropFilter: 'blur(6px)',
                            overflow: 'hidden',

                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '1px',
                                background: `linear-gradient(90deg, 
                transparent, 
                rgba(var(--color-primary-light-rgb), 0.5), 
                rgba(var(--color-primary-main-rgb), 0.7), 
                rgba(var(--color-primary-light-rgb), 0.5), 
                transparent
              )`,
                                zIndex: 1,
                            },

                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundImage: `
                linear-gradient(90deg, 
                  transparent 50%, 
                  rgba(var(--color-primary-light-rgb), 0.02) 50%
                ),
                linear-gradient(
                  transparent 50%, 
                  rgba(var(--color-primary-light-rgb), 0.02) 50%
                )
              `,
                                backgroundSize: '6px 6px',
                                opacity: 0.15,
                                pointerEvents: 'none',
                                zIndex: 0,
                            },
                        },
                    }
                ]
            },
            MuiCard: {
                ...deadSpaceTheme.components?.MuiCard,
                variants: [
                    ...(deadSpaceTheme.components?.MuiCard?.variants || []),
                    {
                        props: { variant: 'contrast' },
                        style: {
                            backgroundColor: 'rgba(var(--color-primary-light-rgb), 0.5)',
                            boxShadow: `0 4px 16px rgba(var(--color-primary-dark-rgb), 0.3),
                    inset 0 0 0 2px rgba(var(--color-primary-light-rgb), 0.1)
                `,
                            border: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',

                            '& .MuiTypography-root': {
                                color: 'var(--color-text-primary)',
                            },

                            '& .MuiTypography-h5': {
                                color: 'var(--color-primary-dark)',
                            },
                        },
                    },
                ]
            },
            MuiLink: {
                styleOverrides: {
                    root: {
                        color: 'var(--color-text-secondary)',
                        '&:hover': {
                            color: 'var(--color-primary-dark)',
                        },
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    head: {
                        color: 'var(--color-text-secondary)',
                        backgroundColor: 'var(--color-background-paper)',
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        '&.Mui-selected': {
                            color: 'var(--color-primary-dark)',
                        },
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    colorPrimary: {
                        backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.1)',
                        color: 'var(--color-primary-dark)',
                        border: '1px solid rgba(var(--color-primary-main-rgb), 0.3)',
                    },
                    colorSecondary: {
                        backgroundColor: 'rgba(var(--color-secondary-main-rgb), 0.1)',
                        color: 'var(--color-secondary-dark)',
                        border: '1px solid rgba(var(--color-secondary-main-rgb), 0.3)',
                    },
                },
            },
            MuiTabs: {
                styleOverrides: {
                    indicator: {
                        backgroundColor: 'var(--color-primary-main)',
                    },
                },
            },
            MuiInputBase: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.8)',
                        border: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',
                    },
                    input: {
                        color: 'var(--color-text-primary)',
                    },
                },
            },
        },
    })
);

export const darkTheme = deadSpaceTheme;
export const lightTheme = deadSpaceLightTheme;