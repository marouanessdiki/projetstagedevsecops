import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const useThemeMode = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeMode must be used within a ThemeContextProvider');
    }
    return context;
};

export const ThemeContextProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    const lightTheme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: '#1e3a5f',
                light: '#42a5f5',
                dark: '#1565c0',
            },
            secondary: {
                main: '#ff9800',
                light: '#ffb74d',
                dark: '#f57c00',
            },
            background: {
                default: '#f9f9f9',
                paper: '#ffffff',
            },
            text: {
                primary: '#2d3748',
                secondary: '#4a5568',
            },
            success: {
                main: '#4caf50',
                light: '#81c784',
                dark: '#388e3c',
            },
            warning: {
                main: '#ff9800',
                light: '#ffb74d',
                dark: '#f57c00',
            },
            error: {
                main: '#f44336',
                light: '#ef5350',
                dark: '#d32f2f',
            },
        },
        shape: {
            borderRadius: 16,
        },
        typography: {
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            h1: {
                fontWeight: 800,
                fontSize: '3.5rem',
                lineHeight: 1.2,
            },
            h2: {
                fontWeight: 700,
                fontSize: '2.5rem',
                lineHeight: 1.3,
            },
            h3: {
                fontWeight: 700,
                fontSize: '2rem',
                lineHeight: 1.4,
            },
            h4: {
                fontWeight: 600,
                fontSize: '1.5rem',
                lineHeight: 1.4,
            },
            h5: {
                fontWeight: 600,
                fontSize: '1.25rem',
                lineHeight: 1.5,
            },
            h6: {
                fontWeight: 600,
                fontSize: '1.1rem',
                lineHeight: 1.5,
            },
            body1: {
                fontSize: '1rem',
                lineHeight: 1.6,
                fontWeight: 400,
            },
            body2: {
                fontSize: '0.875rem',
                lineHeight: 1.6,
                fontWeight: 400,
            },
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                        border: '1px solid rgba(0, 0, 0, 0.04)',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 12,
                        padding: '12px 24px',
                        fontSize: '1rem',
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 12,
                        },
                    },
                },
            },
        },
    });

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#42a5f5',
                light: '#64b5f6',
                dark: '#1976d2',
            },
            secondary: {
                main: '#ffb74d',
                light: '#ffc947',
                dark: '#ff9800',
            },
            background: {
                default: '#1e1e2f',
                paper: '#2a2a3e',
            },
            text: {
                primary: '#ffffff',
                secondary: '#b0b0b0',
            },
            success: {
                main: '#66bb6a',
                light: '#81c784',
                dark: '#4caf50',
            },
            warning: {
                main: '#ffb74d',
                light: '#ffc947',
                dark: '#ff9800',
            },
            error: {
                main: '#ef5350',
                light: '#f44336',
                dark: '#d32f2f',
            },
        },
        shape: {
            borderRadius: 16,
        },
        typography: lightTheme.typography,
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        backgroundColor: '#2a2a3e',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 12,
                        padding: '12px 24px',
                        fontSize: '1rem',
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 12,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        },
                    },
                },
            },
            MuiTableHead: {
                styleOverrides: {
                    root: {
                        '& .MuiTableCell-head': {
                            backgroundColor: '#1e3a5f',
                            color: '#ffffff',
                        },
                    },
                },
            },
            MuiTableBody: {
                styleOverrides: {
                    root: {
                        '& .MuiTableRow-root:nth-of-type(even)': {
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        },
                        '& .MuiTableRow-root:hover': {
                            backgroundColor: 'rgba(66, 165, 245, 0.08)',
                        },
                    },
                },
            },
        },
    });

    const currentTheme = darkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <ThemeProvider theme={currentTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
