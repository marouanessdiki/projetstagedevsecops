import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardContent, Typography, TextField, Button, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const EmployeForm = ({ selected, onSaved, onCancel }) => {
    const [employe, setEmploye] = useState({
        nom: '',
        prenom: '',
        cin: '',
        poste: '',
        service: '',
        dateEmbauche: '',
        cnssNumero: '',
        salaire: '',
        compteBancaireNumero: '',
        sexe: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (selected) {
            setEmploye(selected);
        } else {
            setEmploye({
                nom: '', prenom: '', cin: '', poste: '', service: '', dateEmbauche: '',
                cnssNumero: '', salaire: '', compteBancaireNumero: '', sexe: '',
            });
        }
    }, [selected]);

    const handleChange = e => {
        setEmploye({ ...employe, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let temp = {};
        temp.nom = employe.nom ? '' : 'Nom requis';
        temp.prenom = employe.prenom ? '' : 'Prénom requis';
        temp.cin = employe.cin ? '' : 'CIN requis';
        temp.poste = employe.poste ? '' : 'Poste requis';
        temp.service = employe.service ? '' : 'Service requis';
        temp.dateEmbauche = employe.dateEmbauche ? '' : 'Date requise';
        temp.cnssNumero = employe.cnssNumero ? '' : 'CNSS N° requis';
        temp.salaire = employe.salaire ? '' : 'Salaire requis';
        temp.compteBancaireNumero = employe.compteBancaireNumero ? '' : 'Compte bancaire n° requis';
        temp.sexe = employe.sexe ? '' : 'Sexe requis';
        setErrors(temp);
        return Object.values(temp).every(x => x === '');
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!validate()) return;
        if (employe.id) {
            api.put(`/employes/${employe.id}`, employe).then(() => onSaved());
        } else {
            api.post('/employes', employe).then(() => onSaved());
        }
    };

    return (
        <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4, boxShadow: 3, position: 'fixed', left: 0, right: 0, top: 80, zIndex: 10 }}>
            <CardContent sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <Typography variant="h6" color="primary" fontWeight={700} gutterBottom>{employe.id ? 'Modifier' : 'Ajouter'} Employé</Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <TextField label="Nom" name="nom" value={employe.nom} onChange={handleChange} error={!!errors.nom} helperText={errors.nom} fullWidth />
                        <TextField label="Prénom" name="prenom" value={employe.prenom} onChange={handleChange} error={!!errors.prenom} helperText={errors.prenom} fullWidth />
                        <TextField label="CIN" name="cin" value={employe.cin} onChange={handleChange} error={!!errors.cin} helperText={errors.cin} fullWidth />
                        <TextField label="Poste" name="poste" value={employe.poste} onChange={handleChange} error={!!errors.poste} helperText={errors.poste} fullWidth />
                        <TextField label="Service" name="service" value={employe.service} onChange={handleChange} error={!!errors.service} helperText={errors.service} fullWidth />
                        <TextField label="Date d'embauche" name="dateEmbauche" type="date" value={employe.dateEmbauche} onChange={handleChange} error={!!errors.dateEmbauche} helperText={errors.dateEmbauche} InputLabelProps={{ shrink: true }} fullWidth />
                        <FormControl fullWidth error={!!errors.sexe}>
                            <InputLabel>Sexe</InputLabel>
                            <Select name="sexe" value={employe.sexe} onChange={handleChange} label="Sexe">
                                <MenuItem value="M">Masculin</MenuItem>
                                <MenuItem value="F">Féminin</MenuItem>
                            </Select>
                            {errors.sexe && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>{errors.sexe}</Typography>}
                        </FormControl>
                        <TextField label="CNSS N°" name="cnssNumero" value={employe.cnssNumero} onChange={handleChange} error={!!errors.cnssNumero} helperText={errors.cnssNumero} fullWidth />
                        <TextField label="Salaire" name="salaire" type="number" value={employe.salaire} onChange={handleChange} error={!!errors.salaire} helperText={errors.salaire} fullWidth />
                        <TextField label="Compte bancaire n°" name="compteBancaireNumero" value={employe.compteBancaireNumero} onChange={handleChange} error={!!errors.compteBancaireNumero} helperText={errors.compteBancaireNumero} fullWidth />
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button onClick={onCancel} color="secondary" variant="outlined">Annuler</Button>
                            <Button type="submit" variant="contained" color="primary" size="large">Enregistrer</Button>
                        </Stack>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    );
};

export default EmployeForm;
