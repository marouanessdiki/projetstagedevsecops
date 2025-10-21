import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Card, CardContent, Typography, TextField, Button, Stack, Alert } from '@mui/material';

const HrSignup = ({ onSignupSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        try {
            const res = await api.post('/hr/signup', { username, password });
            if (res.data.success) {
                setSuccess(res.data.message);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        }
    };

    return (
        <Card sx={{ maxWidth: 400, margin: 'auto', mt: 8, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6" color="primary" fontWeight={700} gutterBottom>Inscription HR</Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <TextField
                            label="Nom d'utilisateur"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Mot de passe"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Confirmer le mot de passe"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            fullWidth
                            required
                        />
                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}
                        <Button type="submit" variant="contained" color="primary" size="large">
                            S'inscrire
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => navigate('/')}
                            size="small"
                        >
                            Déjà inscrit ? Se connecter
                        </Button>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    );
};

export default HrSignup; 