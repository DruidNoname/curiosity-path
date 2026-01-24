export interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export interface ThemeVariables {
    hex: {
        primary: {
            main: string;
            light: string;
            dark: string;
            contrast: string;
        };
        secondary: {
            main: string;
            light: string;
            dark: string;
            contrast: string;
        };
        background: {
            default: string;
            paper: string;
        };
        text: {
            primary: string;
            secondary: string;
            disabled: string;
        };
        action: {
            active: string;
            disabled: string;
        };
    };
    rgb: {
        primary: {
            main: string;
            light: string;
            dark: string;
        };
        secondary: {
            main: string;
            light: string;
            dark: string;
        };
        background: {
            default: string;
            paper: string;
        };
        text: {
            primary: string;
            secondary: string;
            disabled: string;
        };
    };
}