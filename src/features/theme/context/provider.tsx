'use client'

import React, { useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeContext } from './context';
import { darkTheme, lightTheme } from '../index';
import { ThemeProviderProps, ThemeMode } from "@/features/theme/model/types";

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>('light'); // Всегда light по умолчанию
    const [mounted, setMounted] = useState(false); // Флаг монтирования

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
        if (savedTheme) {
            setMode(savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setMode('dark');
        }
    }, []);

    // Переключение темы
    const toggleTheme = () => {
        const newMode = mode === 'dark' ? 'light' : 'dark';
        setMode(newMode);
        localStorage.setItem('theme-mode', newMode);
    };

    // Изменение темы
    const handleSetMode = (newMode: ThemeMode) => {
        setMode(newMode);
        localStorage.setItem('theme-mode', newMode);
    };

    // Синхронизация с системными настройками
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('theme-mode')) {
                setMode(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const theme = mounted ? (mode === 'dark' ? darkTheme : lightTheme) : lightTheme;

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme, setMode: handleSetMode }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {/* Скрываем контент до гидратации */}
                <div style={{
                    visibility: mounted ? 'visible' : 'hidden',
                    opacity: mounted ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                }}>
                    {children}
                </div>
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
