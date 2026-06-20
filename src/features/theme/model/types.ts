import { ReactNode } from "react";

export type ThemeMode = 'dark' | 'light';

export interface ThemeProviderProps {
    children: ReactNode;
}
