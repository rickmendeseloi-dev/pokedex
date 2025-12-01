import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    if (saved) {
        return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
    
    if (isDark) {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
    }
    }, [isDark]);

    const toggleTheme = () => {
    setIsDark(prev => !prev);
    };

    return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
        {children}
    </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
    }
    return context;
}
