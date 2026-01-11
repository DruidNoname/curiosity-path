import { createContext, useContext} from 'react';
import {ThemeContextType} from "@/features/theme/types";

export const ThemeContext = createContext<ThemeContextType| undefined>(undefined);

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within ThemeProvider');
    }
    return context;
};