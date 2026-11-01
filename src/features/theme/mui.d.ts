import '@mui/material/styles';
import '@mui/material/Paper';
import '@mui/material/Card';
import '@mui/material/Link';
// Ключи пикеров в теме (MuiPickerDay, MuiDateCalendar…) типизирует сам MUI X. Раньше они
// были описаны здесь вручную и устарели: в MUI X 9 MuiPickersDay стал MuiPickerDay, а
// ручной тип продолжал пропускать старое имя, и стиль молча перестал бы применяться.
import '@mui/x-date-pickers/themeAugmentation';


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
}

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
