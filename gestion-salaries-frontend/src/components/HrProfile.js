import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Button,
    TextField,
    Switch,
    FormControlLabel,
    Chip,
    IconButton,
    Container,
    Fade,
    Zoom,
    useTheme,
    alpha,
    Paper
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Work as WorkIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Business as BusinessIcon,
    Groups as GroupsIcon,
    Description as DescriptionIcon,
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon,
    CheckCircle as CheckCircleIcon,
    AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import api from '../services/api';
import { useThemeMode } from '../contexts/ThemeContext';

function HrProfile() {
    const theme = useTheme();
    const { darkMode, toggleDarkMode } = useThemeMode();
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: 'Manager RH',
        email: 'hr@netcon.ma',
        phone: '+212 6 12 34 56 78',
        position: 'Responsable RH',
        department: 'Ressources Humaines',
        darkTheme: false
    });

    const [stats, setStats] = useState({
        totalEmployees: 0,
        attestationsThisMonth: 0,
        totalAttestations: 0
    });

    useEffect(() => {
        fetchStats();
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await api.get('/hr/profile');
            setProfileData(response.data);
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const [employeesRes, attestationsRes] = await Promise.all([
                api.get('/employes'),
                api.get('/attestations')
            ]);

            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            const thisMonthAttestations = attestationsRes.data.filter(att => {
                const attDate = new Date(att.dateGeneration);
                return attDate.getMonth() === currentMonth && attDate.getFullYear() === currentYear;
            });

            setStats({
                totalEmployees: employeesRes.data.length,
                attestationsThisMonth: thisMonthAttestations.length,
                totalAttestations: attestationsRes.data.length
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSave = async () => {
        try {
            await api.post('/hr/profile', profileData);
            setEditMode(false);
            alert('Profil mis à jour avec succès!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Erreur lors de la sauvegarde du profil');
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        fetchProfileData(); // Reset to original data
    };

    // Modern stat card component
    const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
            <Card
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    border: `1px solid ${alpha(color, 0.1)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                        '& .stat-icon': {
                            transform: 'scale(1.1) rotate(5deg)'
                        }
                    }
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 80,
                        height: 80,
                        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
                        borderRadius: '0 0 0 40px'
                    }}
                />
                <CardContent sx={{ p: 3, position: 'relative' }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    color: color,
                                    mb: 0.5,
                                    fontFamily: 'Inter, sans-serif'
                                }}
                            >
                                {value}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.secondary',
                                    fontWeight: 500,
                                    fontSize: '0.95rem'
                                }}
                            >
                                {title}
                            </Typography>
                        </Box>
                        <Avatar
                            className="stat-icon"
                            sx={{
                                bgcolor: alpha(color, 0.1),
                                color: color,
                                width: 56,
                                height: 56,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Icon fontSize="large" />
                        </Avatar>
                    </Box>
                </CardContent>
            </Card>
        </Zoom>
    );

    return (
        <Container maxWidth="xl" sx={{
            py: 4,
            minHeight: '100vh',
            position: 'relative'
        }}>
            {/* Modern Header Section */}
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
                            fontFamily: 'Inter, sans-serif'
                        }}
                    >
                        Mon Profil RH
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
                        Gérez vos informations personnelles et préférences
                    </Typography>
                </Box>
            </Fade>

            {/* Enhanced Statistics Cards */}
            <Fade in={true} timeout={1000}>
                <Grid container spacing={4} sx={{ mb: 5 }}>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Employés Total"
                            value={stats.totalEmployees}
                            icon={GroupsIcon}
                            color="#1976d2"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Ce Mois"
                            value={stats.attestationsThisMonth}
                            icon={BusinessIcon}
                            color="#2e7d32"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Total Attestations"
                            value={stats.totalAttestations}
                            icon={DescriptionIcon}
                            color="#ed6c02"
                        />
                    </Grid>
                </Grid>
            </Fade>

            {/* Main Profile Section */}
            <Fade in={true} timeout={1200}>
                <Box sx={{
                    display: 'flex',
                    gap: 4,
                    flexWrap: { xs: 'wrap', lg: 'nowrap' },
                    minHeight: '600px',
                    alignItems: 'flex-start'
                }}>
                    {/* Profile Information Card */}
                    <Box sx={{
                        flex: { xs: '1 1 100%', lg: '1 1 0%' },
                        minWidth: 0,
                        maxWidth: { xs: '100%', lg: 'calc(100% - 400px - 32px)' }
                    }}>
                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow: darkMode
                                    ? '0 12px 40px rgba(0,0,0,0.3)'
                                    : '0 12px 40px rgba(0,0,0,0.08)',
                                border: darkMode
                                    ? '1px solid rgba(255, 255, 255, 0.1)'
                                    : '1px solid rgba(30, 58, 95, 0.08)',
                                overflow: 'hidden',
                                position: 'relative',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {/* Profile Header */}
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
                                        top: -50,
                                        right: -50,
                                        width: 200,
                                        height: 200,
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '50%'
                                    }}
                                />
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box display="flex" alignItems="center">
                                        <Avatar
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                mr: 3,
                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                                                backdropFilter: 'blur(10px)',
                                                border: '2px solid rgba(255,255,255,0.2)',
                                                fontSize: '2rem',
                                                fontWeight: 700,
                                                color: 'white'
                                            }}
                                        >
                                            {profileData.fullName.split(' ').map(n => n[0]).join('')}
                                        </Avatar>
                                        <Box>
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: 'white',
                                                    mb: 0.5,
                                                    textShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                                }}
                                            >
                                                {profileData.fullName}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: 'rgba(255,255,255,0.9)',
                                                    mb: 1,
                                                    fontWeight: 500
                                                }}
                                            >
                                                {profileData.position}
                                            </Typography>
                                            <Chip
                                                icon={<BusinessIcon />}
                                                label={profileData.department}
                                                sx={{
                                                    bgcolor: 'rgba(255,255,255,0.15)',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(255,255,255,0.2)'
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                    <Button
                                        variant={editMode ? "outlined" : "contained"}
                                        startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                                        onClick={() => editMode ? handleCancel() : setEditMode(true)}
                                        size="large"
                                        sx={{
                                            minWidth: 160,
                                            borderRadius: 3,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            py: 1.5,
                                            px: 3,
                                            ...(editMode ? {
                                                borderColor: 'rgba(255,255,255,0.5)',
                                                color: 'white',
                                                '&:hover': {
                                                    borderColor: 'white',
                                                    bgcolor: 'rgba(255,255,255,0.1)'
                                                }
                                            } : {
                                                bgcolor: 'rgba(255,255,255,0.15)',
                                                color: 'white',
                                                backdropFilter: 'blur(10px)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255,255,255,0.25)'
                                                }
                                            })
                                        }}
                                    >
                                        {editMode ? 'Annuler' : 'Modifier Profil'}
                                    </Button>
                                </Box>
                            </Box>

                            {/* Profile Form */}
                            <CardContent sx={{ p: 4 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 3,
                                        color: 'text.primary',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <AccountCircleIcon color="primary" />
                                    Informations Personnelles
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Nom Complet"
                                            value={profileData.fullName}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                                            disabled={!editMode}
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <PersonIcon
                                                        sx={{
                                                            mr: 2,
                                                            color: editMode ? 'primary.main' : 'action.disabled',
                                                            transition: 'color 0.3s ease'
                                                        }}
                                                    />
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    backgroundColor: editMode
                                                        ? 'background.paper'
                                                        : darkMode
                                                            ? alpha(theme.palette.grey[800], 0.3)
                                                            : alpha(theme.palette.grey[100], 0.5),
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        '& fieldset': {
                                                            borderColor: editMode ? 'primary.main' : 'grey.300'
                                                        }
                                                    },
                                                    '&.Mui-focused': {
                                                        '& fieldset': {
                                                            borderWidth: 2
                                                        }
                                                    }
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontWeight: 500
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Poste"
                                            value={profileData.position}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, position: e.target.value }))}
                                            disabled={!editMode}
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <WorkIcon
                                                        sx={{
                                                            mr: 2,
                                                            color: editMode ? 'primary.main' : 'action.disabled',
                                                            transition: 'color 0.3s ease'
                                                        }}
                                                    />
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    backgroundColor: editMode
                                                        ? 'background.paper'
                                                        : darkMode
                                                            ? alpha(theme.palette.grey[800], 0.3)
                                                            : alpha(theme.palette.grey[100], 0.5),
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        '& fieldset': {
                                                            borderColor: editMode ? 'primary.main' : 'grey.300'
                                                        }
                                                    },
                                                    '&.Mui-focused': {
                                                        '& fieldset': {
                                                            borderWidth: 2
                                                        }
                                                    }
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontWeight: 500
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                            disabled={!editMode}
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <EmailIcon
                                                        sx={{
                                                            mr: 2,
                                                            color: editMode ? 'primary.main' : 'action.disabled',
                                                            transition: 'color 0.3s ease'
                                                        }}
                                                    />
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    backgroundColor: editMode
                                                        ? 'background.paper'
                                                        : darkMode
                                                            ? alpha(theme.palette.grey[800], 0.3)
                                                            : alpha(theme.palette.grey[100], 0.5),
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        '& fieldset': {
                                                            borderColor: editMode ? 'primary.main' : 'grey.300'
                                                        }
                                                    },
                                                    '&.Mui-focused': {
                                                        '& fieldset': {
                                                            borderWidth: 2
                                                        }
                                                    }
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontWeight: 500
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Téléphone"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                            disabled={!editMode}
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <PhoneIcon
                                                        sx={{
                                                            mr: 2,
                                                            color: editMode ? 'primary.main' : 'action.disabled',
                                                            transition: 'color 0.3s ease'
                                                        }}
                                                    />
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 3,
                                                    backgroundColor: editMode
                                                        ? 'background.paper'
                                                        : darkMode
                                                            ? alpha(theme.palette.grey[800], 0.3)
                                                            : alpha(theme.palette.grey[100], 0.5),
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        '& fieldset': {
                                                            borderColor: editMode ? 'primary.main' : 'grey.300'
                                                        }
                                                    },
                                                    '&.Mui-focused': {
                                                        '& fieldset': {
                                                            borderWidth: 2
                                                        }
                                                    }
                                                },
                                                '& .MuiInputLabel-root': {
                                                    fontWeight: 500
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                {editMode && (
                                    <Fade in={editMode} timeout={300}>
                                        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                                            <Button
                                                variant="contained"
                                                startIcon={<SaveIcon />}
                                                onClick={handleSave}
                                                size="large"
                                                sx={{
                                                    minWidth: 160,
                                                    borderRadius: 3,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    py: 1.5,
                                                    px: 4,
                                                    boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
                                                    '&:hover': {
                                                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                                                        transform: 'translateY(-2px)'
                                                    }
                                                }}
                                            >
                                                Sauvegarder
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<CancelIcon />}
                                                onClick={handleCancel}
                                                size="large"
                                                sx={{
                                                    minWidth: 120,
                                                    borderRadius: 3,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    py: 1.5,
                                                    px: 3,
                                                    borderWidth: 2,
                                                    '&:hover': {
                                                        borderWidth: 2,
                                                        transform: 'translateY(-2px)'
                                                    }
                                                }}
                                            >
                                                Annuler
                                            </Button>
                                        </Box>
                                    </Fade>
                                )}
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Theme Settings Card */}
                    <Box sx={{
                        flex: { xs: '1 1 100%', lg: '0 0 400px' },
                        minWidth: 0,
                        height: 'fit-content',
                        position: { xs: 'static', lg: 'sticky' },
                        top: { lg: '24px' },
                        alignSelf: 'flex-start',
                        width: { xs: '100%', lg: '400px' },
                        maxWidth: { xs: '100%', lg: '400px' }
                    }}>
                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow: darkMode
                                    ? '0 12px 40px rgba(0,0,0,0.3)'
                                    : '0 12px 40px rgba(0,0,0,0.08)',
                                border: darkMode
                                    ? '1px solid rgba(255, 255, 255, 0.1)'
                                    : '1px solid rgba(30, 58, 95, 0.08)',
                                height: 'fit-content',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 3,
                                        color: 'text.primary',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    {darkMode ? <DarkModeIcon color="primary" /> : <LightModeIcon color="primary" />}
                                    Préférences d'Affichage
                                </Typography>

                                <Paper
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        background: darkMode
                                            ? 'linear-gradient(135deg, rgba(66, 66, 66, 0.05) 0%, rgba(33, 33, 33, 0.05) 100%)'
                                            : 'linear-gradient(135deg, rgba(255, 193, 7, 0.05) 0%, rgba(255, 152, 0, 0.05) 100%)',
                                        border: darkMode
                                            ? '1px solid rgba(66, 66, 66, 0.1)'
                                            : '1px solid rgba(255, 193, 7, 0.1)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={darkMode}
                                                onChange={toggleDarkMode}
                                                sx={{
                                                    '& .MuiSwitch-switchBase': {
                                                        '&.Mui-checked': {
                                                            color: '#424242',
                                                            '& + .MuiSwitch-track': {
                                                                backgroundColor: '#424242'
                                                            }
                                                        }
                                                    },
                                                    '& .MuiSwitch-track': {
                                                        backgroundColor: '#ffc107'
                                                    }
                                                }}
                                            />
                                        }
                                        label={
                                            <Box>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: 'text.primary'
                                                    }}
                                                >
                                                    Mode Sombre
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        mt: 0.5
                                                    }}
                                                >
                                                    {darkMode
                                                        ? 'Interface sombre activée'
                                                        : 'Interface claire activée'
                                                    }
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{ m: 0, width: '100%' }}
                                    />
                                </Paper>

                                {/* Status Indicator */}
                                <Box
                                    sx={{
                                        mt: 3,
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: alpha('#4caf50', 0.1),
                                        border: '1px solid',
                                        borderColor: alpha('#4caf50', 0.2),
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <CheckCircleIcon sx={{ color: '#4caf50' }} />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#2e7d32',
                                            fontWeight: 500
                                        }}
                                    >
                                        Profil actif et synchronisé
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Fade>
        </Container>
    );
}

export default HrProfile;