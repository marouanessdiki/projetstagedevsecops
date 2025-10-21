import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Alert, Box, Tabs, Tab, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Snackbar, Chip, Switch, FormControlLabel
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Code as CodeIcon } from '@mui/icons-material';
import { useThemeMode } from '../contexts/ThemeContext';

const AdminPanel = () => {
    const { darkMode, toggleDarkMode } = useThemeMode();
    const [pendingHrs, setPendingHrs] = useState([]);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState(0);

    // Template management state
    const [templates, setTemplates] = useState([]);
    const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [templateForm, setTemplateForm] = useState({ name: '', jrxml: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        loadPendingHrs();
        loadTemplates();
    }, []);

    const loadPendingHrs = async () => {
        try {
            const res = await api.get('/hr/pending');
            setPendingHrs(res.data);
        } catch (err) {
            setMessage('Erreur lors du chargement des HR en attente');
        }
    };

    const approveHr = async (id) => {
        try {
            const res = await api.post(`/hr/approve/${id}`);
            if (res.data.success) {
                setMessage('HR approuvé avec succès');
                loadPendingHrs(); // Reload the list
            }
        } catch (err) {
            setMessage('Erreur lors de l\'approbation');
        }
    };

    // Template management functions
    const loadTemplates = async () => {
        try {
            const res = await api.get('/parametres/parametrage/attestations/types');
            setTemplates(res.data);
        } catch (err) {
            console.error('Error loading templates:', err);
            showSnackbar('Erreur lors du chargement des templates', 'error');
        }
    };

    const openTemplateDialog = (template = null) => {
        if (template) {
            setEditingTemplate(template);
            setTemplateForm({ name: template.value || template.name || '', jrxml: template.jrxml || '' });
        } else {
            setEditingTemplate(null);
            setTemplateForm({ name: '', jrxml: '' });
        }
        setTemplateDialogOpen(true);
    };

    const closeTemplateDialog = () => {
        setTemplateDialogOpen(false);
        setEditingTemplate(null);
        setTemplateForm({ name: '', jrxml: '' });
    };

    const saveTemplate = async () => {
        try {
            // Convert name to uppercase and validate
            const name = templateForm.name.trim().toUpperCase();
            if (!name.match(/^[A-Z_]{2,40}$/)) {
                showSnackbar('Le nom doit contenir 2-40 caractères, uniquement des lettres majuscules et underscores', 'error');
                return;
            }

            const requestData = {
                name: name,
                jrxml: templateForm.jrxml.trim()
            };

            if (editingTemplate) {
                await api.put(`/parametres/parametrage/attestations/types/${editingTemplate.id}`, requestData);
                showSnackbar('Template modifié avec succès', 'success');
            } else {
                await api.post('/parametres/parametrage/attestations/types', requestData);
                showSnackbar('Template créé avec succès', 'success');
            }
            loadTemplates();
            closeTemplateDialog();
        } catch (err) {
            console.error('Error saving template:', err);
            showSnackbar('Erreur lors de la sauvegarde du template', 'error');
        }
    };

    const deleteTemplate = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
            try {
                await api.delete(`/parametres/parametrage/attestations/types/${id}`);
                showSnackbar('Template supprimé avec succès', 'success');
                loadTemplates();
            } catch (err) {
                console.error('Error deleting template:', err);
                showSnackbar('Erreur lors de la suppression du template', 'error');
            }
        }
    };

    const migrateTemplates = async () => {
        try {
            await api.post('/parametres/parametrage/attestations/migrate');
            showSnackbar('Migration des templates effectuée avec succès', 'success');
            loadTemplates();
        } catch (err) {
            console.error('Error migrating templates:', err);
            showSnackbar('Erreur lors de la migration des templates', 'error');
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const closeSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ maxWidth: 1200, margin: '40px auto', px: 2 }}>
            <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" color="primary" fontWeight={700}>
                            Panel Administrateur
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={darkMode}
                                    onChange={toggleDarkMode}
                                    color="primary"
                                />
                            }
                            label="Mode sombre"
                            labelPlacement="start"
                        />
                    </Box>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                            <Tab label="HR en attente" />
                            <Tab label="Gestion des Templates JRXML" />
                        </Tabs>
                    </Box>

                    {activeTab === 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                HR en attente d'approbation
                            </Typography>

                            {message && (
                                <Alert severity="info" sx={{ mb: 2 }} onClose={() => setMessage('')}>
                                    {message}
                                </Alert>
                            )}

                            {pendingHrs.length === 0 ? (
                                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                                    Aucun HR en attente d'approbation
                                </Typography>
                            ) : (
                                <TableContainer component={Paper} elevation={0}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Nom d'utilisateur</TableCell>
                                                <TableCell align="center">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {pendingHrs.map((hr) => (
                                                <TableRow key={hr.id} hover>
                                                    <TableCell>{hr.id}</TableCell>
                                                    <TableCell>{hr.username}</TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size="small"
                                                            onClick={() => approveHr(hr.id)}
                                                        >
                                                            Approuver
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Box>
                    )}

                    {activeTab === 1 && (
                        <Box sx={{ mt: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle1" color="text.secondary">
                                    Gestion des templates d'attestation JRXML
                                </Typography>
                                <Box>
                                    <Button
                                        variant="outlined"
                                        onClick={migrateTemplates}
                                        sx={{ mr: 1 }}
                                    >
                                        Migrer Templates
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => openTemplateDialog()}
                                    >
                                        Nouveau Template
                                    </Button>
                                </Box>
                            </Box>

                            {templates.length === 0 ? (
                                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                                    Aucun template disponible. Cliquez sur "Migrer Templates" pour importer les templates par défaut.
                                </Typography>
                            ) : (
                                <TableContainer component={Paper} elevation={0}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Nom</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell align="center">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {templates.map((template) => (
                                                <TableRow key={template.id} hover>
                                                    <TableCell>{template.id}</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <CodeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                            {template.value || template.name}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={template.type || 'N/A'}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<EditIcon />}
                                                            onClick={() => openTemplateDialog(template)}
                                                            sx={{ mr: 1 }}
                                                        >
                                                            Modifier
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            startIcon={<DeleteIcon />}
                                                            onClick={() => deleteTemplate(template.id)}
                                                        >
                                                            Supprimer
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Template Dialog */}
            <Dialog open={templateDialogOpen} onClose={closeTemplateDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingTemplate ? 'Modifier le Template' : 'Nouveau Template'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nom du Template"
                        placeholder="Ex: SALAIRE, TRAVAIL, TITULARISATION"
                        fullWidth
                        variant="outlined"
                        value={templateForm.name}
                        onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value.toUpperCase() })}
                        sx={{ mb: 2 }}
                        helperText="2-40 caractères, lettres majuscules et underscores uniquement"
                    />
                    <TextField
                        margin="dense"
                        label="Contenu JRXML"
                        multiline
                        rows={15}
                        fullWidth
                        variant="outlined"
                        value={templateForm.jrxml}
                        onChange={(e) => setTemplateForm({ ...templateForm, jrxml: e.target.value })}
                        placeholder="&lt;?xml version=&quot;1.0&quot;?&gt;&#10;&lt;jasperReport&gt;...&lt;/jasperReport&gt;"
                        helperText="Contenu XML du template JasperReports"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeTemplateDialog}>Annuler</Button>
                    <Button onClick={saveTemplate} variant="contained">
                        {editingTemplate ? 'Modifier' : 'Créer'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={closeSnackbar}
                message={snackbar.message}
            />
        </Box>
    );
};

export default AdminPanel; 