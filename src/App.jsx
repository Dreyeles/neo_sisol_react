import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Especialidades from './components/Especialidades';
import Servicios from './components/Servicios';
import AcercaDe from './components/AcercaDe';
import Contacto from './components/Contacto';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const [isServiciosOpen, setIsServiciosOpen] = useState(false);

  const isDemoModeActive = localStorage.getItem('demoMode') === 'true';

  const handleDisableDemo = () => {
    localStorage.removeItem('demoMode');
    localStorage.removeItem('demo_citas');
    localStorage.removeItem('demo_medicos');
    localStorage.removeItem('demo_servicios');
    localStorage.removeItem('demo_pacientes');
    localStorage.removeItem('demo_atenciones');
    localStorage.removeItem('demo_archivos');
    window.location.reload();
  };

  const renderDemoBanner = () => {
    if (!isDemoModeActive) return null;
    return (
      <div className="demo-banner">
        <span>Modo Demo Activo (Sin Servidor)</span>
        <button onClick={handleDisableDemo} className="demo-banner-btn">
          Desactivar Demo
        </button>
      </div>
    );
  };

  // Prevenir scroll del body cuando cualquier modal está abierto
  React.useEffect(() => {
    if (isLoginOpen || isRegisterOpen) {
      document.documentElement.classList.add('no-scroll');
      document.body.classList.add('no-scroll');
    } else {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
    };
  }, [isLoginOpen, isRegisterOpen]);

  const handleOpenLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleOpenRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleCloseRegister = () => {
    setIsRegisterOpen(false);
  };

  const handleServiciosClick = () => {
    setIsServiciosOpen(true);
  };

  // Si el usuario está autenticado, mostrar el Dashboard correspondiente
  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return (
        <div className="App">
          {renderDemoBanner()}
          <AdminDashboard user={user} onLogout={handleLogout} />
        </div>
      );
    }
    if (user?.role === 'doctor') {
      return (
        <div className="App">
          {renderDemoBanner()}
          <DoctorDashboard user={user} onLogout={handleLogout} />
        </div>
      );
    }
    return (
      <div className="App">
        {renderDemoBanner()}
        <Dashboard user={user} onLogout={handleLogout} />
      </div>
    );
  }

  // Si no está autenticado, mostrar la página principal
  return (
    <div className="App">
      {renderDemoBanner()}
      <Navbar
        onLoginClick={handleOpenLogin}
        onRegisterClick={handleOpenRegister}
        onServiciosClick={handleServiciosClick}
      />
      <Hero onAgendarCitaClick={handleOpenLogin} onRegisterClick={handleOpenRegister} />
      <Especialidades />
      <Servicios
        isOpen={isServiciosOpen}
        onToggle={() => setIsServiciosOpen(!isServiciosOpen)}
      />
      <AcercaDe />
      <Contacto />
      <Footer />
      <Login
        isOpen={isLoginOpen}
        onClose={handleCloseLogin}
        onSwitchToRegister={handleOpenRegister}
        onLoginSuccess={handleLoginSuccess}
      />
      <Register
        isOpen={isRegisterOpen}
        onClose={handleCloseRegister}
        onSwitchToLogin={handleOpenLogin}
      />
    </div>
  );
}

export default App;

