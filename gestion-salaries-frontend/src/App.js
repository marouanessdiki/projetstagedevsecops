import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeList from "./components/EmployeList";
import EmployeForm from "./components/EmployeForm";
import AttestationPage from "./components/AttestationPage";
import Menu from "./components/Menu";
import { ThemeContextProvider } from './contexts/ThemeContext';
import api from './services/api';
import { Fab, Container } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AuthLogin from './components/AuthLogin';
import HrSignup from './components/HrSignup';
import AdminPanel from './components/AdminPanel';
import EmployeProfile from './components/EmployeProfile';
import HrProfile from './components/HrProfile';


function App() {
    const [employes, setEmployes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));
    const [error, setError] = useState(null);

    const handleLogin = (role) => {
        setIsLoggedIn(true);
        setUserRole(role);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', role);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        setUserRole(null);
    };

    const fetchEmployes = () => {
        console.log('Fetching employees...');
        api.get('/employes')
            .then(res => {
                console.log('Employees response:', res.data);
                if (Array.isArray(res.data)) {
                    setEmployes(res.data);
                } else {
                    console.error('Expected array but got:', typeof res.data, res.data);
                    setEmployes([]);
                }
            })
            .catch(err => {
                console.error('Error fetching employees:', err);
                console.error('Error response:', err.response);
                setError(`Failed to fetch employees: ${err.message}`);
                setEmployes([]);
            });
    };

    useEffect(() => {
        fetchEmployes();
    }, []);

    const handleAdd = () => {
        setSelected(null);
        setShowForm(true);
    };

    const handleEdit = (emp) => {
        setSelected(emp);
        setShowForm(true);
    };

    const handleSaved = () => {
        setShowForm(false);
        setSelected(null);
        fetchEmployes();
    };

    // If there's an error, show it
    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Error: {error}</h2>
                <button onClick={() => setError(null)}>Try Again</button>
            </div>
        );
    }

    // Show loading state while checking authentication
    if (isLoggedIn === undefined) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <ThemeContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/signup" element={<HrSignup />} />
                    <Route path="/" element={
                        !isLoggedIn ? (
                            <AuthLogin onLogin={handleLogin} />
                        ) : userRole === 'ADMIN' ? (
                            <>
                                <Menu onLogout={handleLogout} userRole={userRole} />
                                <AdminPanel />
                            </>
                        ) : (
                            <>
                                <Menu onLogout={handleLogout} userRole={userRole} />
                                <Container>
                                    <EmployeList employes={employes} onEdit={handleEdit} onDelete={fetchEmployes} />
                                    <Fab color="primary" aria-label="add" onClick={handleAdd} sx={{ position: 'fixed', bottom: 32, right: 32 }}>
                                        <AddIcon />
                                    </Fab>
                                    {showForm && <EmployeForm selected={selected} onSaved={handleSaved} onCancel={() => setShowForm(false)} />}
                                </Container>
                            </>
                        )
                    } />
                    <Route path="/attestations" element={
                        !isLoggedIn ? (
                            <AuthLogin onLogin={handleLogin} />
                        ) : (
                            <>
                                <Menu onLogout={handleLogout} userRole={userRole} />
                                <AttestationPage />
                            </>
                        )
                    } />
                    <Route path="/profile" element={
                        !isLoggedIn ? (
                            <AuthLogin onLogin={handleLogin} />
                        ) : userRole === 'HR' ? (
                            <>
                                <Menu onLogout={handleLogout} userRole={userRole} />
                                <HrProfile />
                            </>
                        ) : (
                            <AuthLogin onLogin={handleLogin} />
                        )
                    } />
                    <Route path="/employes/:id" element={
                        !isLoggedIn ? (
                            <AuthLogin onLogin={handleLogin} />
                        ) : (
                            <>
                                <Menu onLogout={handleLogout} userRole={userRole} />
                                <EmployeProfile />
                            </>
                        )
                    } />
                </Routes>
            </BrowserRouter>
        </ThemeContextProvider>
    );
}

export default App;
