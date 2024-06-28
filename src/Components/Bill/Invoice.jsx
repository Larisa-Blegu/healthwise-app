import React, { useState, useEffect } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Invoice.css';
import axios from 'axios';

function Invoice() {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [priceDetails, setPriceDetails] = useState(null);
  const [loader, setLoader] = useState(false);
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const appointmentResponse = await axios.get(`http://localhost:8081/appointment/${appointmentId}`, {
            headers: {
              Authorization: `Bearer ${token}` 
            }
          });
        const appointment = appointmentResponse.data;
        setAppointment(appointment);
        fetchPriceDetails(appointment.doctor.id, appointment.medicalProcedure.id);
    } catch (error) {
        console.error('Error fetching doctor name:', error);
    }     
    };

    const fetchPriceDetails = async (doctorId, procedureId) => {
      try {
        const priceResponse = await axios.get(`http://localhost:8081/price/doctorAndProcedure/${doctorId}/${procedureId}`, {
            headers: {
              Authorization: `Bearer ${token}` 
            }
          });
        const priceData = priceResponse.data;
        console.log(priceData);
        setPriceDetails(priceData);
    } catch (error) {
        console.error('Error fetching doctor name:', error);
    }     
    };

    fetchAppointment();
  }, [appointmentId]);

  const downloadPDF = () => {
    const capture = document.querySelector('.actual-receipt');
    setLoader(true);
    html2canvas(capture).then((canvas) => {
      const imgData = canvas.toDataURL('img/png');
      const doc = new jsPDF('p', 'mm', 'a5');
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
      setLoader(false);
      doc.save('receipt.pdf');
    });
  };

  if (!appointment || !priceDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wrapper">
      <div className="receipt-box">
        <div className="actual-receipt">
        <div className="receipt-organization-logo">
            <EmailIcon fontSize="large" />
          </div>
          <h5>FACTURA</h5>
          <h6>Healthwise</h6>
          <h6>Sediu Cluj-Napoca</h6>
          <h6>Adresa: Strada Eroilor, Nr. 121, Cluj, România</h6>

          <div className="phone-and-website">
            <p>healthwisecluj@gmail.com</p>
            <p>+40 744 455 5666</p>
          </div>
          <div>Data facturii: {new Date().toLocaleDateString()}</div>
          <table className="table">
  <thead className="table-header">
    <tr>
      <th>Nume Procedură</th>
      <th>Doctor</th>
      <th>Preț</th>
    </tr>
  </thead>
  <tbody>
    <tr className="table-row">
      <td>{appointment.medicalProcedure.name}</td>
      <td>{appointment.doctor.fullName}</td>
      <td>{priceDetails[0].price} RON</td>
    </tr>
  </tbody>
</table>

          <div className="colored-row">
            <span>Thank You!</span>
            <span />
          </div>
        </div>

        <div className="receipt-actions-div">
          <button
            className="receipt-modal-download-button"
            onClick={downloadPDF}
            disabled={loader}
          >
            {loader ? 'Downloading...' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
