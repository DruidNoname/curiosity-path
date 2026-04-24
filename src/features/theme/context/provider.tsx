'use client'

import React, { useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeContext } from './context';
import { darkTheme, lightTheme } from '../index';
import { ThemeProviderProps, ThemeMode } from "@/features/theme/model/types";

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>('light');

    const applyMode = (newMode: ThemeMode) => {
        setMode(newMode);
        localStorage.setItem('theme-mode', newMode);
        document.documentElement.setAttribute('data-theme', newMode);
    };

    const toggleTheme = () => applyMode(mode === 'dark' ? 'light' : 'dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
        if (savedTheme === 'dark' || savedTheme === 'light') {
            setMode(savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setMode('dark');
        }
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('theme-mode')) {
                applyMode(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const theme = mode === 'dark' ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme, setMode: applyMode }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
