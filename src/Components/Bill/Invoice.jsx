import React from 'react'
import logo from '../Assets/mail.png';
import {useState} from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Invoice.css';

function Invoice() {
    const [loader, setLoader] = useState(false);

    const downloadPDF = () =>{
      const capture = document.querySelector('.actual-receipt');
      setLoader(true);
      html2canvas(capture).then((canvas)=>{
        const imgData = canvas.toDataURL('img/png');
        const doc = new jsPDF('p', 'mm', 'a4');
        const componentWidth = doc.internal.pageSize.getWidth();
        const componentHeight = doc.internal.pageSize.getHeight();
        doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
        setLoader(false);
        doc.save('receipt.pdf');
      })
    }
  
    return (
        <div className="wrapper">

        <div className="receipt-box">
  
            {/* actual receipt */}
            <div className="actual-receipt">
  
              {/* organization logo */}
              <div className="receipt-organization-logo">
                <img alt="logo" src={logo} />
              </div>
  
              {/* organization name */}
              <h5>FACTURA</h5>
  
              {/* street address and unit number */}
              <h6>
              Healthwise 
              </h6>
  
              {/* city province postal code */}
              <h6>
                Sediu Cluj-Napoza
              </h6>
              <h6>
                Sediu Cluj-Napoza
              </h6>
              <h6>
              Strada George Barițiu 24
              </h6>
  
              {/* email-phone-and-website */}
              <div className="phone-and-website">
                <p>
                  healthwisecluj@gmail.com
                </p>
                <p> +0789457891 </p>
                    
              </div>
  
              <div>Data facturii:</div>
              <table>
                    <thead>
                        <tr>
                            <th>Nume</th>
                            <th>Doctor</th>
                            <th>Preț</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Produs 1</td>
                            <td>100 RON</td>
                        </tr>
                    </tbody>
                </table>
              <div className="colored-row">
                <span>Thank You For Your Generous Donation</span>
                <span />
              </div>
  
            </div>
            {/* end of actual receipt */}
  
            {/* receipt action */}
            <div className="receipt-actions-div">
              <div className="actions-right">
                <button
                  className="receipt-modal-download-button"
                  onClick={downloadPDF}
                  disabled={!(loader===false)}
                >
                  {loader?(
                    <span>Downloading</span>
                  ):(
                    <span>Download</span>
                  )}
  
                </button> 
              </div>
            </div>
  
        </div>
        
      </div>
    );
  }

export default Invoice