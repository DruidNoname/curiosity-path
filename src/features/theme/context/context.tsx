import {createContext, ReactNode, useContext} from 'react';
import {ThemeContextType} from "@/features/theme/model/types";

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};