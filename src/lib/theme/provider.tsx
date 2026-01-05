'use client'

import React, { useState, useCallback, useMemo, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeContext } from './context';
import { darkTheme, lightTheme } from './index'; // Импортируем ваши темы
import { ThemeContextType } from "@/lib/theme/types";

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    const toggleTheme = useCallback(() => {
        setIsDarkMode(prev => !prev);
    }, []);

    // Выбираем текущую тему
    const currentTheme = isDarkMode ? darkTheme : lightTheme;

    const value = useMemo<ThemeContextType>(() => ({
        isDarkMode,
        toggleTheme,
    }), [isDarkMode, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {/* Оборачиваем в MUI ThemeProvider с выбранной темой */}
            <MuiThemeProvider theme={currentTheme}>
                <CssBaseline /> {/* Добавляем базовые стили MUI */}
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};