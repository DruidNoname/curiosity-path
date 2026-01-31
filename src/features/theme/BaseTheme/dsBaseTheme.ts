import {createTheme} from "@mui/material/styles";
import {colors as darkThemeColors} from "@/features/theme/DarkTheme/Colors";
export const deadSpaceBaseTheme = createTheme({
    typography: {
        fontFamily: 'var(--font-roboto-mono), "Courier New", monospace',
        h1: {
            fontSize: 'clamp(1.7rem, 5vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--color-primary-light)',
            letterSpacing: '0.5px',
        },
        h2: {
            fontSize: 'clamp(1.4rem, 4vw, 2rem)',
            fontWeight: 600,
            color: 'var(--color-primary-light)',
            letterSpacing: '0.25px',
        },
        h3: {
            fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)',
            fontWeight: 600,
            color: 'var(--color-primary-main)',
        },
        h4: {
            fontSize: 'clamp(1.15rem, 3vw, 1.5rem)',
            fontWeight: 500,
            color: 'var(--color-primary-main)',
        },
        h5: {
            fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            color: 'var(--color-primary-light)',
        },
        body1: {
            fontSize: 'clamp(0.9375rem, 2vw, 1rem)',
            lineHeight: 1.6,
            color: 'var(--color-text-primary)',
        },
        body2: {
            fontSize: '0.875rem',
            color: 'var(--color-primary-light)',
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
            color: 'var(--color-primary-main)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
        },
    },
    shape: {
        borderRadius: 4,
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: 'var(--color-background-default)',
                    backgroundImage: `radial-gradient(circle at 50% 0%, var(--color-background-paper) 0%, var(--color-background-default) 100%)`,
                    scrollbarColor: `rgba(var(--color-primary-main-rgb), 0.3) var(--color-background-default)`,
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
                '::selection': {
                    backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.3)',
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
            }
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
                        background: `linear-gradient(135deg, rgba(var(--color-primary-main-rgb), 0.9) 0%, rgba(var(--color-primary-dark-rgb), 0.9) 100%)`,
                        backdropFilter: 'blur(10px)',
                        border: `1px solid rgba(var(--color-primary-main-rgb), 0.3)`,
                        boxShadow: `0 4px 16px rgba(var(--color-primary-main-rgb), 0.25)`,
                        '&:hover': {
                            background: `linear-gradient(135deg, rgba(var(--color-primary-light-rgb), 0.9) 0%, rgba(var(--color-primary-main-rgb), 0.9) 100%)`,
                            boxShadow: `0 6px 20px rgba(var(--color-primary-main-rgb), 0.35)`,
                            border: `1px solid rgba(var(--color-primary-main-rgb), 0.5)`,
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        },
                    },
                },
                {
                    props: { variant: 'contained', color: 'secondary' },
                    style: {
                        background: `linear-gradient(135deg, rgba(var(--color-secondary-main-rgb), 0.9) 0%, rgba(var(--color-secondary-dark-rgb), 0.9) 100%)`,
                        backdropFilter: 'blur(10px)',
                        border: `1px solid rgba(var(--color-secondary-main-rgb), 0.3)`,
                        boxShadow: `0 4px 16px rgba(var(--color-secondary-main-rgb), 0.25)`,
                        '&:hover': {
                            background: `linear-gradient(135deg, rgba(var(--color-secondary-light-rgb), 0.9) 0%, rgba(var(--color-secondary-main-rgb), 0.9) 100%)`,
                            boxShadow: `0 6px 20px rgba(var(--color-secondary-main-rgb), 0.35)`,
                            border: `1px solid rgba(var(--color-secondary-main-rgb), 0.5)`,
                        },
                    },
                },
                {
                    props: { variant: 'outlined', color: 'primary' },
                    style: {
                        backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.5)',
                        border: `1px solid rgba(var(--color-primary-main-rgb), 0.3)`,
                        color: 'var(--color-primary-light)',
                        '&:hover': {
                            backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.1)',
                            border: `1px solid rgba(var(--color-primary-main-rgb), 0.5)`,
                        },
                    },
                },
                {
                    props: { variant: 'outlined', color: 'secondary' },
                    style: {
                        backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.5)',
                        border: `1px solid rgba(var(--color-secondary-main-rgb), 0.3)`,
                        color: 'var(--color-secondary-light)',
                        '&:hover': {
                            backgroundColor: 'rgba(var(--color-secondary-main-rgb), 0.1)',
                            border: `1px solid rgba(var(--color-secondary-main-rgb), 0.5)`,
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
            ],
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: 'var(--color-primary-light)',
                    '&:hover': {
                        backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.1)',
                        color: 'var(--color-primary-main)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',
                    borderRadius: 8,
                },
                elevation1: {
                    boxShadow: '0 2px 8px rgba(var(--color-primary-main-rgb), 0.15)',
                },
                elevation2: {
                    boxShadow: '0 4px 16px rgba(var(--color-primary-main-rgb), 0.2)',
                },
                elevation3: {
                    boxShadow: '0 8px 24px rgba(var(--color-primary-main-rgb), 0.25)',
                },
            },
        },
        MuiCard: {
            variants: [
                {
                    props: { variant: 'contrast' },
                    style: {
                        backgroundColor: 'var(--color-background-paper)',
                        backgroundImage: 'linear-gradient(rgba(255 255 255 / 0.07), rgba(255 255 255 / 0.07))',
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
                    },
                }
            ],
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
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
                input: {
                    color: 'var(--color-text-primary)',
                    '&::placeholder': {
                        color: 'rgba(var(--color-primary-light-rgb), 0.6)',
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(var(--color-primary-main-rgb), 0.3)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(var(--color-primary-main-rgb), 0.5)',
                        borderWidth: '2px',
                    },
                },
                notchedOutline: {
                    borderColor: 'rgba(var(--color-primary-main-rgb), 0.2)',
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
                    backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.2)',
                    color: 'var(--color-primary-light)',
                    border: '1px solid rgba(var(--color-primary-main-rgb), 0.3)',
                },
                colorSecondary: {
                    backgroundColor: 'rgba(var(--color-secondary-main-rgb), 0.2)',
                    color: 'var(--color-secondary-light)',
                    border: '1px solid rgba(var(--color-secondary-main-rgb), 0.3)',
                },
                colorInfo: {
                    backgroundColor: 'rgba(var(--color-info-main-rgb), 0.2)',
                    color: 'var(--color-info-light)',
                    border: '1px solid rgba(var(--color-info-main-rgb), 0.3)',
                },
                colorWarning: {
                    backgroundColor: 'rgba(var(--color-warning-main-rgb), 0.2)',
                    color: 'var(--color-warning-light)',
                    border: '1px solid rgba(var(--color-warning-main-rgb), 0.3)',
                },
                colorError: {
                    backgroundColor: 'rgba(var(--color-error-main-rgb), 0.2)',
                    color: 'var(--color-error-light)',
                    border: '1px solid rgba(var(--color-error-main-rgb), 0.3)',
                },
                colorSuccess: {
                    backgroundColor: 'rgba(var(--color-success-main-rgb), 0.2)',
                    color: 'var(--color-success-light)',
                    border: '1px solid rgba(var(--color-success-main-rgb), 0.3)',
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
                    backgroundColor: 'rgba(var(--color-info-main-rgb), 0.15)',
                    borderColor: 'rgba(var(--color-primary-main-rgb), 0.3)',
                    color: 'var(--color-primary-light)',
                },
                standardSuccess: {
                    backgroundColor: 'rgba(var(--color-success-main-rgb), 0.15)',
                    borderColor: 'rgba(var(--color-success-light-rgb), 0.3)',
                    color: 'var(--color-success-light)',
                },
                standardWarning: {
                    backgroundColor: 'rgba(var(--color-warning-main-rgb), 0.15)',
                    borderColor: 'rgba(var(--color-warning-light-rgb), 0.3)',
                    color: 'var(--color-warning-light)',
                },
                standardError: {
                    backgroundColor: 'rgba(var(--color-error-main-rgb), 0.15)',
                    borderColor: 'rgba(var(--color-error-light-rgb), 0.3)',
                    color: 'var(--color-error-light)',
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                root: {
                    padding: '8px',
                },
                switchBase: {
                    color: 'rgba(var(--color-text-disabled-rgb), 0.5)',
                    '&.Mui-checked': {
                        color: 'var(--color-primary-main)',
                    },
                    '&.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'var(--color-primary-main)',
                        opacity: 0.8,
                    },
                },
                track: {
                    backgroundColor: 'rgba(var(--color-text-disabled-rgb), 0.3)',
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
                    backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.5)',
                    borderRadius: 4,
                    height: '6px',
                    overflow: 'hidden',
                },
                bar: {
                    background: 'linear-gradient(90deg, var(--color-primary-main), var(--color-primary-dark))',
                    borderRadius: 4,
                },
            },
        },
        MuiCircularProgress: {
            styleOverrides: {
                root: {
                    color: 'var(--color-primary-main)',
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(var(--color-primary-main-rgb), 0.2)',
                    borderWidth: '1px',
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: 'rgba(var(--color-text-disabled-rgb), 0.7)',
                    '&.Mui-checked': {
                        color: 'var(--color-primary-main)',
                    },
                },
            },
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    color: 'rgba(var(--color-text-disabled-rgb), 0.7)',
                    '&.Mui-checked': {
                        color: 'var(--color-primary-main)',
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',
                    minHeight: '48px',
                },
                indicator: {
                    backgroundColor: 'var(--color-primary-main)',
                    height: '2px',
                },
                // list: {
                //     gap: '24px',
                // },
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
                        color: 'var(--color-primary-light)',
                    },
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: 'var(--color-primary-main)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    borderBottom: '1px solid transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        color: 'var(--color-primary-light)',
                        borderBottom: '1px solid rgba(var(--color-primary-main-rgb), 0.5)',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgba(var(--color-primary-main-rgb), 0.1)',
                    padding: '16px',
                },
                head: {
                    fontWeight: 600,
                    color: 'var(--color-primary-light)',
                    backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.5)',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.05)',
                    },
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(var(--color-primary-main-rgb), 0.1)',
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.9)',
                    backdropFilter: 'blur(20px)',
                    borderRight: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.75rem',
                    padding: '8px 12px',
                    maxWidth: '300px',
                },
                arrow: {
                    color: 'rgba(var(--color-background-paper-rgb), 0.9)',
                    '&:before': {
                        border: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',
                    },
                },
            },
        },
        MuiSlider: {
            styleOverrides: {
                root: {
                    color: 'var(--color-primary-main)',
                    height: '4px',
                },
                track: {
                    border: 'none',
                },
                rail: {
                    backgroundColor: 'rgba(var(--color-text-disabled-rgb), 0.3)',
                },
                thumb: {
                    backgroundColor: 'var(--color-primary-main)',
                    '&:hover': {
                        boxShadow: '0 0 0 8px rgba(var(--color-primary-main-rgb), 0.16)',
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.5)',
                    backdropFilter: 'blur(10px)',
                },
                icon: {
                    color: 'var(--color-primary-light)',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: 'rgba(var(--color-background-paper-rgb), 0.9)',
                    backdropFilter: 'blur(30px)',
                    border: '1px solid rgba(var(--color-primary-main-rgb), 0.2)',
                },
            },
        },
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(var(--color-background-default-rgb), 0.8)',
                    backdropFilter: 'blur(4px)',
                },
            },
        },
        MuiDayCalendar: {
            styleOverrides: {
                weekDayLabel: {
                    width: '28px',    // ⬇ Уменьшаем ширину
                    height: '28px',   // ⬇ Уменьшаем высоту
                    margin: '0 1px',  // ⬇ Уменьшаем отступы
                },
                weekContainer: {
                    margin: '2px 0', // Уменьшаем вертикальные отступы
                }
            }
        },
        MuiPickersDay: {
            styleOverrides: {
                root: {
                    width: '28px',
                    height: '28px',
                }
            }
        },
        MuiDateCalendar: {
            styleOverrides: {
                root: {
                    width: 'unset',
                    padding: '0',
                }
            }
        },
        MuiPickersCalendarHeader: {
            styleOverrides: {
                root: {
                    minHeight: '40px',
                    padding: '4px 8px',
                    marginBottom: '4px',
                },

                label: {
                    fontSize: '14px',
                    fontWeight: 600,
                    padding: '2px 4px',
                    lineHeight: 1.3,
                },

                switchViewButton: {
                    width: '28px',
                    height: '28px',
                    padding: '4px',
                    margin: '0 2px',
                }
            }
        },
        MuiPickersFadeTransitionGroup: {
            styleOverrides: {
                root: {
                    position: 'relative',
                    '&.MuiDateCalendar-viewTransitionContainer:has(.MuiYearCalendar-root), &.MuiDateCalendar-viewTransitionContainer:has(.MuiMonthCalendar-root)': {
                        overflowY: 'scroll',
                        transition: 'all 0.3s ease',
                        willChange: 'transform, opacity',
                        maxWidth: '100%',
                        borderRadius: '8px',
                        boxShadow: 'inset 0 1px 4px rgba(var(--color-primary-main-rgb), 0.3), inset 0 2px 8px rgba(var(--color-primary-main-rgb), 0.15), inset 0 4px 10px rgba(var(--color-primary-main-rgb), 0.05)',
                    },
                },
            },
        },
        MuiYearCalendar: {
            styleOverrides: {
                root: {
                    maxWidth: '100%',
                },
            },
        },
        MuiMonthCalendar: {
            styleOverrides: {
                root: {
                    maxWidth: '100%',
                },
            },
        },
    }
});