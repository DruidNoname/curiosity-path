import '@mui/material/Paper';
import '@mui/material/Card';

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
        accent?: true;     // если нужно
        glass?: true;      // если нужно
    }
}

declare module '@mui/material/Card' {
    interface CardPropsVariantOverrides {
        contrast: true;
        accent?: true;     // если нужно
        glass?: true;      // если нужно
    }
}
