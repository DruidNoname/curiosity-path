import {ReactNode} from "react";

export type ThemeMode = 'dark' | 'light';

export interface ThemeContextType {
    mode: ThemeMode;
    toggleTheme: () => void;
    setMode: (mode: ThemeMode) => void;
}
export interface ThemeProviderProps {
    children: ReactNode;
}
