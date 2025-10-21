import React, { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import {
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    IconButton,
    TextField,
    InputAdornment,
    Grid,
    Box,
    Chip,
    TableSortLabel,
    Container,
    ToggleButton,
    ToggleButtonGroup,
    Divider,
    Avatar,
    useTheme,
    alpha,
    Fade,
    Zoom,
    Tooltip,
    Autocomplete,
    Alert,
    Snackbar
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DescriptionIcon from '@mui/icons-material/Description';
import SortIcon from '@mui/icons-material/Sort';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useThemeMode } from '../contexts/ThemeContext';

const AttestationPage = () => {
    const theme = useTheme();
    const { darkMode } = useThemeMode();
    const [employes, setEmployes] = useState([]);
    const [attestations, setAttestations] = useState([]);
    const [selected, setSelected] = useState("");
    const [type, setType] = useState("");
    const [generating, setGenerating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('dateGeneration');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterByType, setFilterByType] = useState('all');
    const [dateOrder, setDateOrder] = useState('new-to-old');
    const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [attestationTypes, setAttestationTypes] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(false);

    // Notification functions
    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
    };

    const closeNotification = () => {
        setNotification({ ...notification, open: false });
    };

    // Load attestation types from admin-created templates
    const loadAttestationTypes = async () => {
        setLoadingTypes(true);
        try {
            const res = await api.get('/parametres/parametrage/attestations/types');
            setAttestationTypes(res.data);

            // Set the first available type as default if none selected
            if (res.data.length > 0 && (!type || type === "")) {
                setType(res.data[0].value);
            }
        } catch (err) {
            console.error('Error loading attestation types:', err);
            showNotification('Erreur lors du chargement des types d\'attestation', 'error');
        } finally {
            setLoadingTypes(false);
        }
    };

    // Helper to render employee label using name when available
    const getEmployeLabel = (employeId) => {
        const emp = Array.isArray(employes) ? employes.find(e => e.id === employeId) : undefined;
        return emp ? `${emp.nom} ${emp.prenom}` : `ID: ${employeId}`;
    };

    // Get selected employee object
    const getSelectedEmployee = () => {
        return Array.isArray(employes) ? employes.find(e => e.id === selected) : null;
    };

    // Filter employees for autocomplete
    const filteredEmployees = useMemo(() => {
        if (!Array.isArray(employes)) return [];
        if (!employeeSearchTerm) return employes;

        return employes.filter(emp =>
            `${emp.nom} ${emp.prenom}`.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
            emp.cin.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
            emp.poste.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
            emp.service.toLowerCase().includes(employeeSearchTerm.toLowerCase())
        );
    }, [employes, employeeSearchTerm]);

    const handleSort = (field) => {
        const isAsc = sortBy === field && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortBy(field);
    };

    // Get unique attestation types for filter dropdown (from generated attestations)
    const uniqueTypes = useMemo(() => {
        if (!Array.isArray(attestations)) return [];
        const types = [...new Set(attestations.map(att => att.typeAttestation))];
        return types.filter(type => type && type.trim() !== '');
    }, [attestations]);

    // Filter and sort attestations
    const filteredAndSortedAttestations = useMemo(() => {
        if (!Array.isArray(attestations)) return [];

        let filtered = attestations.filter(attestation => {
            const employeeName = getEmployeLabel(attestation.employeId).toLowerCase();
            const matchesSearch = searchTerm === '' ||
                employeeName.includes(searchTerm.toLowerCase()) ||
                attestation.typeAttestation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                attestation.id.toString().includes(searchTerm);

            const matchesFilter = filterByType === 'all' || attestation.typeAttestation === filterByType;

            return matchesSearch && matchesFilter;
        });

        // Sort the filtered results
        filtered.sort((a, b) => {
            // Primary sort by date order (always by date first)
            const aDate = new Date(a.dateGeneration);
            const bDate = new Date(b.dateGeneration);

            if (dateOrder === 'new-to-old') {
                // Newest first
                if (aDate > bDate) return -1;
                if (aDate < bDate) return 1;
            } else {
                // Oldest first
                if (aDate < bDate) return -1;
                if (aDate > bDate) return 1;
            }

            // Secondary sort by other fields if dates are equal
            if (sortBy !== 'dateGeneration') {
                let aValue = a[sortBy];
                let bValue = b[sortBy];

                if (sortBy === 'employeId') {
                    aValue = getEmployeLabel(aValue).toLowerCase();
                    bValue = getEmployeLabel(bValue).toLowerCase();
                } else {
                    aValue = aValue?.toString().toLowerCase() || '';
                    bValue = bValue?.toString().toLowerCase() || '';
                }

                if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            }

            return 0;
        });

        return filtered;
    }, [attestations, searchTerm, sortBy, sortOrder, filterByType, employes, dateOrder]);

    useEffect(() => {
        api.get("/employes").then((res) => setEmployes(res.data));
        loadAttestations();
        loadAttestationTypes();
    }, []);

    const loadAttestations = () => {
        api.get("/attestations")
            .then((res) => setAttestations(res.data))
            .catch((err) => console.error(err));
    };

    const generateAttestation = () => {
        if (!selected) {
            showNotification("Veuillez sélectionner un employé", 'warning');
            return;
        }

        const selectedEmployee = getSelectedEmployee();
        const employeeName = selectedEmployee ? `${selectedEmployee.nom} ${selectedEmployee.prenom}` : 'Employé';

        // Get the display name for the notification
        const selectedType = attestationTypes.find(t => t.value === type);
        const typeDisplayName = selectedType ? selectedType.label : type;

        setGenerating(true);
        api.post("/attestations", {
            employeId: selected,
            typeAttestation: type,
        })
            .then(() => {
                loadAttestations();
                showNotification(`Attestation ${typeDisplayName} générée avec succès pour ${employeeName}`, 'success');
            })
            .catch((err) => {
                console.error(err);
                showNotification("Erreur lors de la génération de l'attestation", 'error');
            })
            .finally(() => {
                setGenerating(false);
            });
    };

    const handleClearSelection = () => {
        setSelected("");
        setEmployeeSearchTerm("");
    };

    const deleteAttestation = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette attestation ?")) {
            api.delete(`/attestations/${id}`)
                .then(() => {
                    loadAttestations();
                    showNotification("Attestation supprimée avec succès", 'success');
                })
                .catch((err) => {
                    console.error(err);
                    showNotification("Erreur lors de la suppression", 'error');
                });
        }
    };

    // Get attestation type color - ensure each type gets a unique color
    const getTypeColor = (typeLabel, typeValue) => {
        if (!typeLabel) return 'default';

        // Define a palette of distinct colors
        const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'info'];

        // Use content-based assignment for consistent colors
        const typeLower = typeLabel.toLowerCase();
        const valueLower = typeValue ? typeValue.toLowerCase() : '';

        if (typeLower.includes('salaire') || valueLower.includes('salaire')) return 'primary';
        if (typeLower.includes('travail') || valueLower.includes('travail')) return 'success';
        if (typeLower.includes('titularisation') || valueLower.includes('titularisation')) return 'info';
        if (typeLower.includes('avenant') || typeLower.includes('augmentation') ||
            valueLower.includes('avenant') || valueLower.includes('augmentation')) return 'warning';
        if (typeLower.includes('engagement') || typeLower.includes('versement') ||
            valueLower.includes('engagement') || valueLower.includes('versement')) return 'error';

        // Fallback: use hash of the label to ensure consistent colors
        let hash = 0;
        for (let i = 0; i < typeLabel.length; i++) {
            const char = typeLabel.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Modern Header */}
            <Fade in={true} timeout={800}>
                <Box sx={{ mb: 5, textAlign: 'center' }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            background: 'linear-gradient(135deg, #1e3a5f 0%, #42a5f5 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            mb: 2,
                            fontFamily: 'Inter, sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2
                        }}
                    >
                        <AssignmentIcon sx={{ fontSize: 'inherit', color: '#1e3a5f' }} />
                        Gestion des Attestations
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'text.secondary',
                            fontWeight: 400,
                            maxWidth: 600,
                            mx: 'auto',
                            lineHeight: 1.6
                        }}
                    >
                        Générez et gérez les attestations des employés en toute simplicité
                    </Typography>
                </Box>
            </Fade>

            {/* Modern Generation Form */}
            <Fade in={true} timeout={1000}>
                <Card
                    sx={{
                        mb: 4,
                        borderRadius: 4,
                        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.08),
                        background: darkMode
                            ? 'linear-gradient(135deg, #2a2a3e 0%, #1e1e2f 100%)'
                            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Decorative background element */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: -50,
                            right: -50,
                            width: 200,
                            height: 200,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                            borderRadius: '50%'
                        }}
                    />
                    <CardContent sx={{ p: 4, position: 'relative' }}>
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                                mb: 3,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                                <DescriptionIcon />
                            </Avatar>
                            Génération d'Attestations
                        </Typography>

                        <Grid container spacing={3} alignItems="end">
                            <Grid item xs={12} md={7}>
                                <Autocomplete
                                    fullWidth
                                    options={filteredEmployees}
                                    getOptionLabel={(option) => `${option.nom} ${option.prenom}`}
                                    value={getSelectedEmployee()}
                                    onChange={(event, newValue) => {
                                        setSelected(newValue ? newValue.id : '');
                                    }}
                                    onInputChange={(event, newInputValue) => {
                                        setEmployeeSearchTerm(newInputValue);
                                    }}
                                    inputValue={employeeSearchTerm}
                                    ListboxProps={{
                                        style: {
                                            maxHeight: '300px',
                                            minWidth: '300px'
                                        }
                                    }}
                                    PaperComponent={({ children, ...other }) => (
                                        <Paper
                                            {...other}
                                            sx={{
                                                minWidth: '300px',
                                                maxWidth: '500px',
                                                borderRadius: 3,
                                                boxShadow: darkMode
                                                    ? '0 8px 32px rgba(0,0,0,0.4)'
                                                    : '0 8px 32px rgba(0,0,0,0.12)',
                                                border: darkMode
                                                    ? '1px solid rgba(255, 255, 255, 0.1)'
                                                    : '1px solid rgba(0, 0, 0, 0.08)',
                                                backgroundColor: darkMode ? '#2a2a3e' : '#ffffff',
                                                '& .MuiAutocomplete-listbox': {
                                                    padding: '8px 0',
                                                    '& .MuiAutocomplete-option': {
                                                        padding: '12px 16px',
                                                        minHeight: 'auto',
                                                        '&:hover': {
                                                            backgroundColor: darkMode
                                                                ? 'rgba(66, 165, 245, 0.08)'
                                                                : 'rgba(0, 0, 0, 0.04)'
                                                        },
                                                        '&.Mui-focused': {
                                                            backgroundColor: darkMode
                                                                ? 'rgba(66, 165, 245, 0.12)'
                                                                : 'rgba(0, 0, 0, 0.08)'
                                                        }
                                                    }
                                                }
                                            }}
                                        >
                                            {children}
                                        </Paper>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Sélectionner un employé"
                                            placeholder="Rechercher par nom, CIN, poste, service..."
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: selected ? (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleClearSelection}
                                                            sx={{
                                                                color: 'text.secondary',
                                                                '&:hover': { color: 'error.main' }
                                                            }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ) : null
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    backgroundColor: darkMode
                                                        ? alpha(theme.palette.grey[800], 0.3)
                                                        : alpha(theme.palette.primary.main, 0.02),
                                                    minHeight: '64px',
                                                    fontSize: '1.1rem',
                                                    '&:hover fieldset': {
                                                        borderColor: 'primary.main',
                                                        borderWidth: 2
                                                    },
                                                    '&.Mui-focused': {
                                                        '& fieldset': {
                                                            borderWidth: 2
                                                        }
                                                    }
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontWeight: 600,
                                                    fontSize: '1.1rem',
                                                    color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                                                    transform: 'translate(14px, 20px) scale(1)',
                                                    '&.Mui-focused': {
                                                        transform: 'translate(14px, -9px) scale(0.75)'
                                                    }
                                                },
                                                '& .MuiInputBase-input': {
                                                    fontSize: '1.1rem',
                                                    padding: '20px 16px',
                                                    color: darkMode ? '#ffffff' : '#000000',
                                                    fontWeight: 500
                                                }
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props} sx={{
                                            py: 1.5,
                                            px: 2,
                                            minHeight: 'auto',
                                            '&:hover': {
                                                backgroundColor: darkMode
                                                    ? 'rgba(66, 165, 245, 0.08)'
                                                    : 'rgba(0, 0, 0, 0.04)'
                                            }
                                        }}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                width: '100%',
                                                minWidth: '280px'
                                            }}>
                                                <Avatar
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                        color: 'primary.main',
                                                        fontSize: '1rem',
                                                        fontWeight: 600,
                                                        flexShrink: 0
                                                    }}
                                                >
                                                    {option.nom[0]}{option.prenom[0]}
                                                </Avatar>
                                                <Box sx={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                    overflow: 'hidden'
                                                }}>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: 'text.primary',
                                                            fontSize: '1rem',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '200px'
                                                        }}
                                                    >
                                                        {option.nom} {option.prenom}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            fontSize: '0.9rem',
                                                            mt: 0.5,
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '200px'
                                                        }}
                                                    >
                                                        {option.poste} • {option.service}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            fontSize: '0.8rem',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: '200px'
                                                        }}
                                                    >
                                                        CIN: {option.cin}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )}
                                    noOptionsText="Aucun employé trouvé"
                                    loadingText="Chargement des employés..."
                                    clearOnEscape
                                    selectOnFocus
                                    handleHomeEndKeys
                                    sx={{
                                        '& .MuiAutocomplete-popper': {
                                            '& .MuiPaper-root': {
                                                minWidth: '300px',
                                                maxWidth: '500px'
                                            }
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{
                                        fontWeight: 600,
                                        fontSize: '1.1rem',
                                        color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'
                                    }}>Type d'attestation</InputLabel>
                                    <Select
                                        value={type}
                                        label="Type d'attestation"
                                        onChange={(e) => setType(e.target.value)}
                                        sx={{
                                            borderRadius: 3,
                                            minHeight: '64px',
                                            '& .MuiSelect-select': {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                fontSize: '1.1rem',
                                                fontWeight: 500,
                                                padding: '20px 16px'
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderWidth: 2
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main'
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                                borderWidth: 2
                                            }
                                        }}
                                    >
                                        {loadingTypes ? (
                                            <MenuItem disabled>
                                                <Typography>Chargement des types...</Typography>
                                            </MenuItem>
                                        ) : attestationTypes.length === 0 ? (
                                            <MenuItem disabled>
                                                <Typography color="text.secondary">
                                                    Aucun type d'attestation disponible
                                                </Typography>
                                            </MenuItem>
                                        ) : (
                                            attestationTypes.map((attestationType, index) => (
                                                <MenuItem key={attestationType.id} value={attestationType.value}>
                                                    <Chip
                                                        label={attestationType.label}
                                                        color={getTypeColor(attestationType.label, attestationType.value)}
                                                        size="small"
                                                    />
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button
                                    variant="contained"
                                    onClick={generateAttestation}
                                    disabled={!selected || generating}
                                    size="large"
                                    fullWidth
                                    sx={{
                                        py: 2,
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                        boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                                            boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                                            transform: 'translateY(-2px)'
                                        },
                                        '&:disabled': {
                                            background: alpha(theme.palette.action.disabled, 0.1),
                                            color: theme.palette.action.disabled
                                        }
                                    }}
                                >
                                    {generating ? 'Génération en cours...' : 'Générer Attestation'}
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Fade>

            {/* Enhanced Search and Filter Controls */}
            <Fade in={true} timeout={1200}>
                <Card
                    sx={{
                        mb: 4,
                        borderRadius: 4,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.1)
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                                mb: 3,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <SearchIcon color="primary" />
                            Recherche et Filtres
                        </Typography>

                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={5}>
                                <TextField
                                    fullWidth
                                    placeholder="Rechercher par employé, type d'attestation..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 3,
                                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                            '&:hover fieldset': {
                                                borderColor: 'primary.main',
                                            },
                                            '&.Mui-focused': {
                                                '& fieldset': {
                                                    borderWidth: 2
                                                }
                                            }
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ fontWeight: 500 }}>Type d'Attestation</InputLabel>
                                    <Select
                                        value={filterByType}
                                        label="Type d'Attestation"
                                        onChange={(e) => setFilterByType(e.target.value)}
                                        sx={{ borderRadius: 3 }}
                                    >
                                        <MenuItem value="all">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FilterListIcon fontSize="small" />
                                                Tous les types
                                            </Box>
                                        </MenuItem>
                                        {uniqueTypes.map(type => (
                                            <MenuItem key={type} value={type}>
                                                <Chip
                                                    label={type}
                                                    color={getTypeColor(type)}
                                                    size="small"
                                                    sx={{ fontWeight: 500 }}
                                                />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 1.5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            color: 'text.primary'
                                        }}
                                    >
                                        <SortIcon color="primary" /> Trier par Ordre
                                    </Typography>
                                    <ToggleButtonGroup
                                        value={dateOrder}
                                        exclusive
                                        onChange={(e, newOrder) => newOrder && setDateOrder(newOrder)}
                                        size="small"
                                        fullWidth
                                        sx={{
                                            '& .MuiToggleButton-root': {
                                                borderRadius: 3,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                border: '2px solid',
                                                borderColor: alpha(theme.palette.primary.main, 0.2),
                                                color: 'text.secondary',
                                                py: 1,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&.Mui-selected': {
                                                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                                    color: 'white',
                                                    borderColor: 'transparent',
                                                    boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)'
                                                    }
                                                },
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.04)
                                                }
                                            }
                                        }}
                                    >
                                        <ToggleButton value="new-to-old" sx={{ gap: 1, flex: 1 }}>
                                            <NewReleasesIcon fontSize="small" />
                                            <Box sx={{ textAlign: 'left' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    Nouveau → Ancien
                                                </Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                    Plus récent d'abord
                                                </Typography>
                                            </Box>
                                        </ToggleButton>
                                        <ToggleButton value="old-to-new" sx={{ gap: 1, flex: 1 }}>
                                            <HistoryIcon fontSize="small" />
                                            <Box sx={{ textAlign: 'left' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    Ancien → Nouveau
                                                </Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                    Plus ancien d'abord
                                                </Typography>
                                            </Box>
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <Chip
                                    icon={<TrendingUpIcon />}
                                    label={`${filteredAndSortedAttestations.length} attestation${filteredAndSortedAttestations.length > 1 ? 's' : ''} trouvée${filteredAndSortedAttestations.length > 1 ? 's' : ''}`}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                                {searchTerm && (
                                    <Chip
                                        label={`Recherche: "${searchTerm}"`}
                                        size="small"
                                        onDelete={() => setSearchTerm('')}
                                        color="secondary"
                                        sx={{ fontWeight: 500 }}
                                    />
                                )}
                                {filterByType !== 'all' && (
                                    <Chip
                                        label={`Type: ${filterByType}`}
                                        size="small"
                                        onDelete={() => setFilterByType('all')}
                                        color="info"
                                        sx={{ fontWeight: 500 }}
                                    />
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{
                                    bgcolor: dateOrder === 'new-to-old' ? 'primary.main' : 'success.main',
                                    width: 32,
                                    height: 32
                                }}>
                                    {dateOrder === 'new-to-old' ? <TrendingDownIcon fontSize="small" /> : <TrendingUpIcon fontSize="small" />}
                                </Avatar>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    {dateOrder === 'new-to-old' ? 'Plus récentes en premier' : 'Plus anciennes en premier'}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Fade>

            {/* Modern Attestations Table */}
            <Fade in={true} timeout={1400}>
                <Card
                    sx={{
                        borderRadius: 4,
                        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.1),
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #42a5f5 100%)',
                            p: 4,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -30,
                                right: -30,
                                width: 120,
                                height: 120,
                                background: 'rgba(255,255,255,0.08)',
                                borderRadius: '50%'
                            }}
                        />
                        <Typography
                            variant="h4"
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }}>
                                <DescriptionIcon />
                            </Avatar>
                            Liste des Attestations
                        </Typography>
                    </Box>

                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead
                                sx={{
                                    background: darkMode
                                        ? 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)'
                                        : 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)'
                                }}
                            >
                                <TableRow>
                                    <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', py: 2 }}>
                                        <TableSortLabel
                                            active={sortBy === 'employeId'}
                                            direction={sortBy === 'employeId' ? sortOrder : 'asc'}
                                            onClick={() => handleSort('employeId')}
                                            sx={{
                                                color: 'white !important',
                                                '& .MuiTableSortLabel-icon': { color: 'white !important' }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PersonIcon fontSize="small" />
                                                Employé
                                            </Box>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', py: 2 }}>
                                        <TableSortLabel
                                            active={sortBy === 'typeAttestation'}
                                            direction={sortBy === 'typeAttestation' ? sortOrder : 'asc'}
                                            onClick={() => handleSort('typeAttestation')}
                                            sx={{
                                                color: 'white !important',
                                                '& .MuiTableSortLabel-icon': { color: 'white !important' }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <WorkIcon fontSize="small" />
                                                Type d'Attestation
                                            </Box>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', py: 2 }}>
                                        <TableSortLabel
                                            active={sortBy === 'dateGeneration'}
                                            direction={sortBy === 'dateGeneration' ? sortOrder : 'asc'}
                                            onClick={() => handleSort('dateGeneration')}
                                            sx={{
                                                color: 'white !important',
                                                '& .MuiTableSortLabel-icon': { color: 'white !important' }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <AccessTimeIcon fontSize="small" />
                                                Date de génération
                                            </Box>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', py: 2 }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAndSortedAttestations.map((att, index) => (
                                    <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }} key={att.id}>
                                        <TableRow
                                            hover
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                                    transform: 'scale(1.002)',
                                                    cursor: 'pointer'
                                                },
                                                '&:nth-of-type(even)': {
                                                    backgroundColor: alpha(theme.palette.action.hover, 0.02)
                                                },
                                                transition: 'all 0.2s ease-in-out',
                                                borderLeft: `4px solid ${alpha(theme.palette.primary.main, 0.1)}`
                                            }}
                                        >
                                            <TableCell sx={{ py: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                            color: 'primary.main',
                                                            fontSize: '0.9rem',
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        {getEmployeLabel(att.employeId).split(' ').map(n => n[0]).join('')}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                            {getEmployeLabel(att.employeId)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            ID: {att.employeId}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ py: 2 }}>
                                                <Chip
                                                    label={att.typeAttestation}
                                                    color={getTypeColor(att.typeAttestation)}
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: '0.8rem',
                                                        borderRadius: 2
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ py: 2 }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                        {new Date(att.dateGeneration).toLocaleDateString('fr-FR', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <AccessTimeIcon fontSize="small" color="action" />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(att.dateGeneration).toLocaleTimeString('fr-FR', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center" sx={{ py: 2 }}>
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Tooltip title="Télécharger le PDF" arrow>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => window.open(`http://localhost:8080/api/attestations/download/${att.id}`, '_blank')}
                                                            sx={{
                                                                borderRadius: 2,
                                                                '&:hover': {
                                                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                                    transform: 'scale(1.1)'
                                                                }
                                                            }}
                                                        >
                                                            <DownloadIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Supprimer l'attestation" arrow>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => deleteAttestation(att.id)}
                                                            sx={{
                                                                borderRadius: 2,
                                                                '&:hover': {
                                                                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                                                                    transform: 'scale(1.1)'
                                                                }
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    </Zoom>
                                ))}
                                {filteredAndSortedAttestations.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} sx={{ textAlign: 'center', py: 6 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        bgcolor: alpha(theme.palette.action.disabled, 0.1),
                                                        color: 'text.secondary'
                                                    }}
                                                >
                                                    <DescriptionIcon fontSize="large" />
                                                </Avatar>
                                                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    Aucune attestation trouvée
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {searchTerm || filterByType !== 'all'
                                                        ? 'Essayez de modifier vos critères de recherche'
                                                        : 'Commencez par générer votre première attestation'
                                                    }
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Fade>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={closeNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={closeNotification}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AttestationPage;