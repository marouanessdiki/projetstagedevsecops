import React from "react";
import { Link, useLocation } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useTheme, alpha } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useThemeMode } from '../contexts/ThemeContext';

const Menu = ({ onLogout, userRole }) => {
    const location = useLocation();
    const theme = useTheme();
    const { darkMode } = useThemeMode();

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                background: darkMode
                    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                    : 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
                borderBottom: `1px solid ${alpha('#ffffff', 0.1)}`,
                mb: 0,
                transition: 'all 0.3s ease'
            }}
        >
            <Container maxWidth="xl">
                <Toolbar sx={{ py: 1 }}>
                    <BusinessIcon sx={{ mr: 2, fontSize: '2rem', color: '#ff9800' }} />
                    <Typography
                        variant="h5"
                        component={Link}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                            color: 'inherit',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #ffffff 0%, #ff9800 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}
                    >
                        NETCON Services - {userRole === 'ADMIN' ? 'Panel Admin' : 'Gestion Salariés'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {userRole === 'ADMIN' ? (
                            // Admin navigation
                            <Button
                                color="inherit"
                                startIcon={<BusinessIcon />}
                                sx={{
                                    fontWeight: 600,
                                    px: 3,
                                    py: 1,
                                    borderRadius: 3,
                                    '&:hover': {
                                        background: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                Gestion Admin
                            </Button>
                        ) : (
                            // HR navigation
                            <>
                                <Button
                                    color={location.pathname === '/' ? 'secondary' : 'inherit'}
                                    component={Link}
                                    to="/"
                                    startIcon={<PeopleIcon />}
                                    sx={{
                                        fontWeight: 600,
                                        px: 3,
                                        py: 1,
                                        borderRadius: 3,
                                        '&:hover': {
                                            background: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    Employés
                                </Button>
                                <Button
                                    color={location.pathname === '/attestations' ? 'secondary' : 'inherit'}
                                    component={Link}
                                    to="/attestations"
                                    startIcon={<DescriptionIcon />}
                                    sx={{
                                        fontWeight: 600,
                                        px: 3,
                                        py: 1,
                                        borderRadius: 3,
                                        '&:hover': {
                                            background: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    Attestations
                                </Button>
                                <Button
                                    color={location.pathname === '/profile' ? 'secondary' : 'inherit'}
                                    component={Link}
                                    to="/profile"
                                    startIcon={<AccountCircleIcon />}
                                    sx={{
                                        fontWeight: 600,
                                        px: 3,
                                        py: 1,
                                        borderRadius: 3,
                                        '&:hover': {
                                            background: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    Mon Profil
                                </Button>
                            </>
                        )}
                        <Button
                            color="inherit"
                            onClick={onLogout}
                            startIcon={<LogoutIcon />}
                            sx={{
                                fontWeight: 600,
                                px: 3,
                                py: 1,
                                ml: 2,
                                borderRadius: 3,
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderColor: 'rgba(255, 255, 255, 0.3)'
                                }
                            }}
                        >
                            Déconnexion
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Menu;
