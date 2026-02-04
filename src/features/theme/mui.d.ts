import React from "react";
import '@mui/material/styles';
import '@mui/material/Paper';
import '@mui/material/Card';
import '@mui/material/Link';


declare module '@mui/material/styles' {
    interface Palette {
        custom?: {
            customColor?: string;
        };
    }

    interface PaletteOptions {
        custom?: {
            customColor?: string;
        };
    }

    interface Components {
        MuiDateCalendar?: {
            styleOverrides?: {
                root?: React.CSSProperties;
            };
        };
        MuiDayCalendar?: {
            styleOverrides?: {
                root?: React.CSSProperties;
                weekDayLabel?: React.CSSProperties;
                weekContainer?: React.CSSProperties;
            };
        };
        MuiPickersDay?: {
            styleOverrides?: {
                root?: React.CSSProperties;
                selected?: React.CSSProperties;
                disabled?: React.CSSProperties;
            };
        };
        MuiPickersCalendarHeader?: {
            styleOverrides?: {
                root?: React.CSSProperties;
                label?: React.CSSProperties;
                switchViewButton?: React.CSSProperties;
            };
        };

        MuiPickersFadeTransitionGroup?: {
            styleOverrides?: {
                root?: {
                    '&.MuiDateCalendar-viewTransitionContainer'?: CSSObject;
                } | CSSObject;
            };
        };

        MuiMonthCalendar?: {
            styleOverrides?: {
                root?: React.CSSProperties;
            };
        };

        MuiYearCalendar?: {
            styleOverrides?: {
                root?: React.CSSProperties;
            };
        };
    }
}
// Добавляем компоненты MUI X, которые хотим стилизовать
// MuiDateCalendar: 'root';
// MuiDatePicker: 'root';
// MuiPickersDay: 'root' | 'selected' | 'disabled';
// MuiPickersCalendarHeader: 'root' | 'label' | 'switchViewButton';
// MuiDayCalendar: 'root' | 'weekContainer' | 'weekDayLabel';
// MuiMonthCalendar: 'root';
// MuiYearCalendar: 'root';

declare module '@mui/material/Paper' {
    interface PaperPropsVariantOverrides {
        contrast: true;
        iced: true;     // если нужно
        glass?: true;      // если нужно
    }
}

declare module '@mui/material/Card' {
    interface CardPropsVariantOverrides {
        contrast: true;
        iced: true;     // если нужно
        glass?: true;      // если нужно
    }
}


declare module '@mui/material/Link' {
    interface LinkPropsVariantOverrides {
        textSimilar: true;
        accent?: true;     // если нужно
        glass?: true;      // если нужно
    }
}
