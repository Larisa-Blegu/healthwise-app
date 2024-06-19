import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Login from './Components/Login/Login';
import Main from './Components/Main/Main';
import Doctor from './Components/Doctor/Doctor';
import DoctorPage from './Components/DoctorPage/DoctorPage';
import Specialization from './Components/Specialization/Specialization';
import DescriptionSpecialization from './Components/DescriptionSpecialization/DescriptionSpecialization';
import MedicalProcedure from './Components/MedicalProcedure/MedicalProcedure';
import Location from './Components/Location/Location';
import CityHospitals from './Components/CityHospitals/CityHospitals';
import DoctorsHospital from './Components/DoctorsHospital/DoctorsHospital';
import Appointment from './Components/Appointment/Appointment';
import YourAppointments from './Components/YourAppointments/YourAppointments';
import AppointmentForDoctor from './Components/AppointmentByDoctor/AppointmentForDoctor';
import Review from './Components/Review/Review';
import { PaymentSuccess } from './Components/PaymentSuccess/PaymentSuccess';
import ResponsiveAppBar from './Components/Navigation/ResponsiveAppBar';
import Bill from './Components/Bill/Bill';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './Components/Dashboard/Dashboard';
import Invoice from './Components/Bill/Invoice';
import AdminResponsiveAppBar from './Components/Navigation/AdminResponsiveAppBar';
import DoctorResponsiveAppBar from './Components/Navigation/DoctorResponsiveAppBar';
import React, { useState, useEffect } from 'react';
import ManageUser from './Components/Management/User/ManageUser';
import ManageDoctor from './Components/Management/Doctor/ManageDoctor';
import ManageSpecialization from './Components/Management/Specialization/ManageSpecialization';
import ManageReview from './Components/Management/Review/ManageReview';
import ManageContact from './Components/Management/Contact/ManageContact';
import ManageProcedure from './Components/Management/Procedure/ManageProcedure';
import ManageLocation from './Components/Management/Location/ManageLocation';
import ManagePrice from './Components/Management/Price/ManagePrice';
import ManageAppointment from './Components/Management/Appointment/ManageAppointment';
import Profile from './Components/Profile/Profile';
import DoctorDashboard from './Components/ManagementDoctor/DoctorDashboard';
import TodayAppointments from './Components/ManagementDoctor/TodayAppointments';
import Footer from './Components/Footer/Footer'; // Importă componenta Footer

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleLogin = (roleFromBackend) => {
    setRole(roleFromBackend);
  }

  const isClient = () => {
    return role === 'CLIENT' || role === null;
  };
  const isAdmin = () => {
    return role === 'ADMIN';
  };
  const isMedic = () => {
    return role === 'MEDIC';
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path='/login' element={<Login onLogin={handleLogin} />} />
        </Routes>
      </div>
      <div>
        <ResponsiveAppBar show={isClient()} />
        <AdminResponsiveAppBar showAdmin={isAdmin()} />
        <DoctorResponsiveAppBar showMedic={isMedic()} />


        <Routes>
          <Route path='/profile' element={<ClientAdminElement role={role}><Profile /></ClientAdminElement>} />
          <Route path='/register' element={<ClientElement role={role}><LoginSignup /></ClientElement>} />
          <Route path='/' element={<ClientElement role={role}><Main /></ClientElement>} />
          <Route path='/doctor' element={<ClientElement role={role}><Doctor /></ClientElement>} />
          <Route path='/doctor/:id' element={<ClientElement role={role}><DoctorPage /></ClientElement>} />
          <Route path='/specialization/' element={<ClientElement role={role}><Specialization /></ClientElement>} />
          <Route path='/DescriptionSpecialization/:id' element={<ClientElement role={role}><DescriptionSpecialization /></ClientElement>} />
          <Route path='/medicalProcedure/:id' element={<ClientElement role={role}><MedicalProcedure /></ClientElement>} />
          <Route path='/location' element={<ClientElement role={role}><Location /></ClientElement>} />
          <Route path='/location/:city' element={<ClientElement role={role}><CityHospitals /></ClientElement>} />
          <Route path='/doctors/:id' element={<ClientElement role={role}><DoctorsHospital /></ClientElement>} />
          <Route path='/appointment/' element={<ClientElement role={role}><Appointment /></ClientElement>} />
          <Route path='/yourAppointments/' element={<ClientElement role={role}><YourAppointments /></ClientElement>} />
          <Route path='/appointmentByDoctor/' element={<ClientElement role={role}><AppointmentForDoctor /></ClientElement>} />
          <Route path="/review/:appointmentId" element={<ClientElement role={role}><Review /></ClientElement>} />
          <Route path='/success/:id' element={<ClientElement role={role}><PaymentSuccess /></ClientElement>} />
          <Route path='/bill' element={<ClientElement role={role}><Bill /></ClientElement>} />
          <Route path='/invoice' element={<ClientElement role={role}><Invoice /></ClientElement>} />
        </Routes>
      </div>

      <div>
        <Routes>
          <Route path='/dashboard' element={<AdminElement role={role}> <Dashboard /></AdminElement>} />
          <Route path='/manageUser' element={<AdminElement role={role}><ManageUser /></AdminElement>} />
          <Route path='/manageDoctor' element={<AdminElement role={role}><ManageDoctor /></AdminElement>} />
          <Route path='/manageSpecialization' element={<AdminElement role={role}><ManageSpecialization /></AdminElement>} />
          <Route path='/manageProcedure' element={<AdminElement role={role}><ManageProcedure /></AdminElement>} />
          <Route path='/manageLocation' element={<AdminElement role={role}><ManageLocation /></AdminElement>} />
          <Route path='/manageAppointment' element={<AdminElement role={role}><ManageAppointment /></AdminElement>} />
          <Route path='/managePrice' element={<AdminElement role={role}><ManagePrice /></AdminElement>} />
          <Route path='/manageReview' element={<AdminElement role={role}><ManageReview /></AdminElement>} />
          <Route path='/manageContact' element={<AdminElement role={role}><ManageContact /></AdminElement>} />
          <Route path='/doctorDashboard' element={<MedicElement role={role}><DoctorDashboard /></MedicElement>} />
          <Route path='/todayAppointments' element={<MedicElement role={role}><TodayAppointments /></MedicElement>} />
        </Routes>
      </div>
    </Router>
  );
}

function AdminElement({ role, children }) {
  if (role === 'ADMIN') {
    return <>{children}</>
  } else {
    return <div>You do not have access to this page</div>
  }
}

function ClientElement({ role, children }) {
  const location = useLocation(); // Folosește useLocation pentru a obține calea curentă

  const showFooterPaths = ['/', '/doctor', '/specialization', '/location']; // Paginile pe care vrem să afișăm footer-ul

  if (role === 'CLIENT' || role === null) {
    return (
      <>
        {children}
        {showFooterPaths.includes(location.pathname) && <Footer />} {/* Afișează footer-ul doar pentru paginile specificate */}
      </>
    );
  } else {
    return <div>You do not have access to this page</div>;
  }
}

function ClientAdminElement({ role, children }) {
  if (role === 'CLIENT' || role === 'ADMIN') {
    return <>{children}</>;
  } else {
    return <div>You do not have access to this page</div>;
  }
}

function MedicElement({ role, children }) {
  if (role === 'MEDIC' || role === 'ADMIN') {
    return <>{children}</>;
  } else {
    return <div>You do not have access to this page</div>;
  }
}

export default App;
