import React, { useState, useMemo } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Stack,
    Container,
    Box,
    Chip,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    TableSortLabel,
    Avatar,
    useTheme,
    alpha,
    Fade,
    Tooltip,
    Badge
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';

const EmployeList = ({ employes, onEdit, onDelete }) => {
    const theme = useTheme();
    const { darkMode } = useThemeMode();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('nom');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterBy, setFilterBy] = useState('all');

    const handleDelete = id => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
            api.delete(`/employes/${id}`).then(() => onDelete());
        }
    };

    const handleSort = (field) => {
        const isAsc = sortBy === field && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortBy(field);
    };

    // Get unique services for filter dropdown
    const uniqueServices = useMemo(() => {
        if (!Array.isArray(employes)) return [];
        const services = [...new Set(employes.map(emp => emp.service))];
        return services.filter(service => service && service.trim() !== '');
    }, [employes]);

    // Filter and sort employees
    const filteredAndSortedEmployes = useMemo(() => {
        if (!Array.isArray(employes)) return [];

        let filtered = employes.filter(employe => {
            const matchesSearch = searchTerm === '' ||
                employe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employe.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employe.cin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employe.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employe.service.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter = filterBy === 'all' || employe.service === filterBy;

            return matchesSearch && matchesFilter;
        });

        // Sort the filtered results
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            // Handle date sorting
            if (sortBy === 'dateEmbauche') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            } else {
                aValue = aValue?.toString().toLowerCase() || '';
                bValue = bValue?.toString().toLowerCase() || '';
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [employes, searchTerm, sortBy, sortOrder, filterBy]);

    // Get service color
    const getServiceColor = (service) => {
        const colors = {
            'Informatique': 'primary',
            'Ressources Humaines': 'secondary',
            'Finance': 'success',
            'Marketing': 'warning',
            'Qualité': 'info',
            'default': 'default'
        };
        return colors[service] || colors.default;
    };

    // KPICard component removed since dashboard was removed

    // Safety check to ensure employes is an array
    if (!Array.isArray(employes)) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                    <CardContent sx={{ textAlign: 'center', py: 8 }}>
                        <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                            <PeopleIcon fontSize="large" color="primary" />
                        </Avatar>
                        <Typography variant="h5" gutterBottom fontWeight={700} color="primary">
                            Chargement des employés...
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {employes === null || employes === undefined ? 'Veuillez patienter' : 'Aucun employé trouvé'}
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    if (employes.length === 0) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                    <CardContent sx={{ textAlign: 'center', py: 8 }}>
                        <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                            <PeopleIcon fontSize="large" color="secondary" />
                        </Avatar>
                        <Typography variant="h5" gutterBottom fontWeight={700} color="secondary">
                            Aucun employé trouvé
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Commencez par ajouter votre premier employé
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    // No statistics needed since dashboard was removed

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Simple Header */}
            <Fade in={true} timeout={800}>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            color: 'primary.main',
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2
                        }}
                    >
                        <PeopleIcon sx={{ fontSize: 'inherit' }} />
                        Gestion des Employés
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: 'text.secondary',
                            fontWeight: 400
                        }}
                    >
                        Gérez efficacement vos ressources humaines
                    </Typography>
                </Box>
            </Fade>

            {/* Modern Search and Filter Controls */}
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    placeholder="Rechercher par nom, prénom, CIN, poste, service..."
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
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{ fontWeight: 500 }}>Filtrer par Service</InputLabel>
                                    <Select
                                        value={filterBy}
                                        label="Filtrer par Service"
                                        onChange={(e) => setFilterBy(e.target.value)}
                                        sx={{
                                            borderRadius: 3,
                                            '& .MuiSelect-select': {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }
                                        }}
                                    >
                                        <MenuItem value="all">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FilterListIcon fontSize="small" />
                                                Tous les services
                                            </Box>
                                        </MenuItem>
                                        {uniqueServices.map(service => (
                                            <MenuItem key={service} value={service}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <BusinessCenterIcon fontSize="small" color="primary" />
                                                    {service}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Badge
                                        badgeContent={filteredAndSortedEmployes.length}
                                        color="primary"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                fontSize: '0.9rem',
                                                fontWeight: 600,
                                                padding: '4px 8px',
                                                borderRadius: 2
                                            }
                                        }}
                                    >
                                        <Chip
                                            icon={<PeopleIcon />}
                                            label="Trouvés"
                                            variant="outlined"
                                            color="primary"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Badge>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Fade>

            {/* Modern Employee Table */}
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
                                <PeopleIcon />
                            </Avatar>
                            Liste des Employés
                        </Typography>
                    </Box>

                    <TableContainer component={Paper} elevation={0}>
                        <Table sx={{ minWidth: 650 }}>
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
                                            active={sortBy === 'nom'}
                                            direction={sortBy === 'nom' ? sortOrder : 'asc'}
                                            onClick={() => handleSort('nom')}
                                            sx={{
                                                color: 'white !important',
                                                '& .MuiTableSortLabel-icon': { color: 'white !important' }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PersonIcon fontSize="small" />
                                                Nom
                                            </Box>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', py: 2 }}>
                                        <TableSortLabel
                                            active={sortBy === 'prenom'}
                                            direction={sortBy === 'prenom' ? sortOrder : 'asc'}
                                            onClick={() => handleSort('prenom')}
                                            sx={{
                                                color: 'white !important',
                                                '& .MuiTableSortLabel-icon': { color: 'white !important' }
                                            }}
                                        >
                                            Prénom
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', py: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PersonIcon fontSize="small" />
                                            Sexe
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', py: 2 }}>
                                        <TableSortLabel
                                            active={sortBy === 'poste'}
                                            direction={sortBy === 'poste' ? sortOrder : 'asc'}
                                            onClick={() => handleSort('poste')}
                                            sx={{
                                                color: 'white !important',
                                                '& .MuiTableSortLabel-icon': { color: 'white !important' }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <WorkIcon fontSize="small" />
                                                Poste
                                            </Box>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', py: 2 }}>
                                        <TableSortLabel
                                            active={sortBy === 'service'}
                                            direction={sortBy === 'service' ? sortOrder : 'asc'}
                                            onClick={() => handleSort('service')}
                                            sx={{
                                                color: 'white !important',
                                                '& .MuiTableSortLabel-icon': { color: 'white !important' }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <BusinessCenterIcon fontSize="small" />
                                                Service
                                            </Box>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', py: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AttachMoneyIcon fontSize="small" />
                                            Salaire
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', py: 2 }}>
                                        <TableSortLabel
                                            active={sortBy === 'dateEmbauche'}
                                            direction={sortBy === 'dateEmbauche' ? sortOrder : 'asc'}
                                            onClick={() => handleSort('dateEmbauche')}
                                            sx={{
                                                color: 'white !important',
                                                '& .MuiTableSortLabel-icon': { color: 'white !important' }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CalendarTodayIcon fontSize="small" />
                                                Date d'embauche
                                            </Box>
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: '1rem', py: 2 }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAndSortedEmployes.map((emp, index) => (
                                    <TableRow
                                        key={emp.id}
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
                                                    {emp.nom[0]}{emp.prenom[0]}
                                                </Avatar>
                                                <Box>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: 'primary.main',
                                                            textDecoration: 'none',
                                                            '&:hover': {
                                                                textDecoration: 'underline'
                                                            }
                                                        }}
                                                        component={Link}
                                                        to={`/employes/${emp.id}`}
                                                    >
                                                        {emp.nom}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        CIN: {emp.cin}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                                {emp.prenom}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            <Chip
                                                label={emp.sexe === 'M' ? 'Masculin' : emp.sexe === 'F' ? 'Féminin' : 'Non renseigné'}
                                                color={emp.sexe === 'M' ? 'primary' : emp.sexe === 'F' ? 'secondary' : 'default'}
                                                size="small"
                                                sx={{
                                                    fontWeight: 600,
                                                    borderRadius: 2
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                                                {emp.poste}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            <Chip
                                                label={emp.service}
                                                color={getServiceColor(emp.service)}
                                                size="small"
                                                sx={{
                                                    fontWeight: 600,
                                                    borderRadius: 2
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            {emp.salaire ? (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AttachMoneyIcon fontSize="small" color="success" />
                                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                                                        {emp.salaire.toLocaleString()} DH
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                    Non renseigné
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ py: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(emp.dateEmbauche).toLocaleDateString('fr-FR')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center" sx={{ py: 2 }}>
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Tooltip title="Modifier l'employé" arrow>
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => onEdit(emp)}
                                                        sx={{
                                                            borderRadius: 2,
                                                            '&:hover': {
                                                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                                transform: 'scale(1.1)'
                                                            }
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Supprimer l'employé" arrow>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleDelete(emp.id)}
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
                                ))}
                                {filteredAndSortedEmployes.length === 0 && searchTerm && (
                                    <TableRow>
                                        <TableCell colSpan={8} sx={{ textAlign: 'center', py: 6 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        bgcolor: alpha(theme.palette.action.disabled, 0.1),
                                                        color: 'text.secondary'
                                                    }}
                                                >
                                                    <SearchIcon fontSize="large" />
                                                </Avatar>
                                                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    Aucun employé trouvé
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Essayez de modifier vos critères de recherche
                                                </Typography>
                                                <Chip
                                                    label={`Recherche: "${searchTerm}"`}
                                                    onDelete={() => setSearchTerm('')}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Fade>
        </Container>
    );
};

export default EmployeList;