import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Card, CardContent, Typography, CircularProgress, Stack } from '@mui/material';

const EmployeProfile = () => {
    const { id } = useParams();
    const [employe, setEmploye] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/employes/${id}`)
            .then(res => {
                setEmploye(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Employé introuvable');
                setLoading(false);
            });
    }, [id]);

    if (loading) return <CircularProgress sx={{ display: 'block', margin: '40px auto' }} />;
    if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;
    if (!employe) return null;

    return (
        <Card sx={{ maxWidth: 500, margin: '40px auto', boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h5" color="primary" fontWeight={700} gutterBottom>Profil de l'employé</Typography>
                <Stack spacing={1}>
                    <Typography><b>Nom:</b> {employe.nom}</Typography>
                    <Typography><b>Prénom:</b> {employe.prenom}</Typography>
                    <Typography><b>CIN:</b> {employe.cin}</Typography>
                    <Typography><b>Poste:</b> {employe.poste}</Typography>
                    <Typography><b>Service:</b> {employe.service}</Typography>
                    <Typography><b>Date d'embauche:</b> {employe.dateEmbauche}</Typography>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default EmployeProfile; 