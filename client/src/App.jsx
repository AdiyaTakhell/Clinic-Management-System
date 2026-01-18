import { Toaster } from 'react-hot-toast'; // <--- Import this
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import ReceptionistDashboard from './pages/ReceptionistDashboard.jsx';
import DoctorDashboard from "./pages/DoctorDashboard.jsx";

// Role-based Dashboard Switcher
const DashboardSwitcher = () => {
    const { user } = useAuth();

    if (user?.role === 'Receptionist') {
        return <ReceptionistDashboard />;
    }

    if (user?.role === 'Doctor') {
        return <DoctorDashboard />;
    }

    return <Navigate to="/login" />;
};

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Layout>
                                        <DashboardSwitcher />
                                    </Layout>
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </AuthProvider>
            </Router>
        </>
    );
}

export default App;