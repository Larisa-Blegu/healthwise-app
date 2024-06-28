import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom"; 
import "./MedicalProcedure.css"; 
import person_icon from "../Assets/person.png";

function MedicalProcedure() {
  const [procedures, setProcedures] = useState([]);
  const [specialization, setSpecialization] = useState(null); 
  const { id } = useParams(); 
  const [doctors, setDoctors] = useState([]);
  const [prices, setPrice] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/medicalProcedure/specialization/${id}`)
      .then((response) => {
        setProcedures(response.data);
      })
      .catch((error) => {
        console.error("Error fetching medical procedures:", error);
      });

    axios
      .get(`http://localhost:8081/specialization/${id}`)
      .then((response) => {
        setSpecialization(response.data);
        const tempSpecialization = response.data;
        setDoctors(tempSpecialization.doctors);
        console.log(tempSpecialization.doctors);
      })
      .catch((error) => {
        console.error("Error fetching specialization:", error);
      });
  }, [id]);

  const fetchPrices = async (doctors, procedureId) => {
    const prices2 = [];
    for (const doctor of doctors) {
      try {
        const response = await axios.get(
          `http://localhost:8081/price/doctorAndProcedure/${doctor.id}/${procedureId}`
        );
        prices2.push(...response.data);
      } catch (error) {
        console.error("Eroare la încărcarea procedurilor medicale:", error);
      }
    }
    setPrice(prices2);
  };

  const handleProcedureClick = (procedureId) => {
    setPrice([]); 
    fetchPrices(doctors, procedureId); 
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleAppointmentRequest = (doctor, procedure) => {
    localStorage.setItem("selectedDoctor", JSON.stringify(doctor));
    localStorage.setItem("selectedProcedure", JSON.stringify(procedure));
  };

  return (
    <div>
      <div className="mainTitle">
        Investigatii pentru {specialization ? specialization.name : ""}
      </div>
      <div className="accordeonSpecialization">
        {procedures.map((procedure, index) => (
          <div className="specializationDetails" key={index}>
            <Accordion
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              onClick={() => handleProcedureClick(procedure.id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className="AccordionSummaryContent"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography variant="span" className="AccordionName">
                    {procedure.name}
                  </Typography>
                  <Typography variant="span" className="SeePricesText">
                    Vezi prețuri
                  </Typography>
                </div>
              </AccordionSummary>

              <AccordionDetails className="AccordionDetails">
                <div>
                  {doctors.map((doctor, doctorIndex) => {
                    const doctorPrices = prices.filter(
                      (price) => price.doctor.id === doctor.id
                    );
                    if (doctorPrices.length > 0) {
                      return (
                        <div key={doctorIndex}>
                          <h3>
                            {doctor.medicineDegree} {doctor.fullName}
                          </h3>
                          {doctorPrices.map((price, priceIndex) => (
                            <div key={priceIndex} className="innerAccordion">
                              <p className="price">
                                Pret procedura: <strong>{price.price}</strong>{" "}
                                ron
                              </p>
                              <Link
                                to="/appointmentByDoctor"
                                className="AppointmentButton"
                                onClick={() =>
                                  handleAppointmentRequest(doctor, procedure)
                                }
                              >
                                Solicită programare
                              </Link>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                <Typography>{procedure.description}</Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MedicalProcedure;
