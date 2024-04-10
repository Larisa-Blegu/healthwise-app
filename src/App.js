import logo from './logo.svg';
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
import CityHospitals from './Components/CityHospitals/CityHospitals'
import DoctorsHospital from './Components/DoctorsHospital/DoctorsHospital';
import Appointment from './Components/Appointment/Appointment';
import YourAppointments from './Components/YourAppointments/YourAppointments';
import AppointmentForDoctor from './Components/AppointmentByDoctor/AppointmentForDoctor';
import Review from './Components/Review/Review'; // Să presupunem că ai o pagină de recenzii numită ReviewPage
import { PaymentSuccess } from './Components/PaymentSuccess/PaymentSuccess';
import ResponsiveAppBar from './Components/Navigation/ResponsiveAppBar';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
              <ResponsiveAppBar />

        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<LoginSignup/>}/>
          <Route path='/' element={<Main/>}/>
          <Route path='/doctor' element={<Doctor/>}/>
          <Route path='/doctor/:id' element={<DoctorPage/>}/>
          <Route path='/specialization/' element={<Specialization/>}/>
          <Route path='/DescriptionSpecialization/:id' element={<DescriptionSpecialization/>}/>
          <Route path='/medicalProcedure/:id' element={<MedicalProcedure/>}/>
          <Route path='/location' element={<Location/>}/>
          <Route path='/location/:city' element={<CityHospitals/>}/>
          <Route path='/doctors/:id' element={<DoctorsHospital/>}/>
          <Route path='/appointment/' element={<Appointment/>}/>
          <Route path='/yourAppointments/' element={<YourAppointments/>}/>
          <Route path='/appointmentByDoctor/' element={<AppointmentForDoctor/>}/>
          <Route path="/review/:appointmentId" element={<Review/>} />
          <Route path='/success' element={<PaymentSuccess/>}/>

        </Routes>
      </div>
      </Router>
  );
}

export default App;
