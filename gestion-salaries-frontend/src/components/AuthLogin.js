import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Card, CardContent, Typography, TextField, Button, Stack, Alert, Container, Box } from '@mui/material';

const AuthLogin = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', { username, password });
            if (res.data.success) {
                const userRole = res.data.role || 'HR'; // Default to HR if no role specified
                onLogin(userRole); // Pass the role to the parent component
                navigate('/');
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Identifiants invalides');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card sx={{
                width: '100%',
                maxWidth: 450,
                boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                border: '1px solid #e2e8f0',
                borderRadius: 4
            }}>
                <CardContent sx={{ p: 4 }}>
                    {/* NETCON Branding */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{
                                background: 'linear-gradient(135deg, #1e3a5f 0%, #ff9800 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                mb: 1
                            }}
                        >
                            NETCON Services
                        </Typography>
                        <Typography variant="h6" color="text.secondary" fontWeight={500}>
                            Gestion des Salariés
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Connectez-vous pour accéder au système
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit} noValidate>
                        <Stack spacing={3}>
                            <TextField
                                label="Nom d'utilisateur"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&:hover fieldset': {
                                            borderColor: '#1e3a5f',
                                        },
                                    }
                                }}
                            />
                            <TextField
                                label="Mot de passe"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&:hover fieldset': {
                                            borderColor: '#1e3a5f',
                                        },
                                    }
                                }}
                            />
                            {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{
                                    py: 1.5,
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    '&:hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 10px 25px -5px rgba(30, 58, 95, 0.3)'
                                    }
                                }}
                            >
                                Se connecter
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/signup')}
                                sx={{
                                    borderRadius: 3,
                                    borderColor: '#e2e8f0',
                                    color: '#4a5568',
                                    '&:hover': {
                                        borderColor: '#1e3a5f',
                                        background: '#f8fafc'
                                    }
                                }}
                            >
                                Pas encore inscrit ? S'inscrire comme HR
                            </Button>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default AuthLogin;
