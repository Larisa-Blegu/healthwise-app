import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import person_icon from "../Assets/person.png";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import { saveAs } from "file-saver";
import { Construction } from "@mui/icons-material";
import "./Doctor.css";

function Doctor() {
  // Starea pentru termenul de căutare introdus de utilizator pentru fiecare câmp
  const [doctorName, setDoctorName] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [locations, setLocation] = useState([]);
  const [specializations, setSpecialization] = useState([]);
  const uniqueCities = [...new Set(locations.map((location) => location.city))];
  const uniqueSpecializations = [
    ...new Set(specializations.map((specialization) => specialization.name)),
  ];
  const [reviews, setReview] = useState({});
  const [reviewsCounter, setReviewCounter] = useState({});

  useEffect(() => {
    // Încărcați medicii din baza de date sau de la un API
    axios
      .get("http://localhost:8081/doctor/allDoctors")
      .then((response) => {
        //setDoctors(response.data);
        //  calculateAverageRating(); // Calcularea mediei notelor pentru fiecare medic
        const doctors2 = response.data;

        // Parcurgem fiecare doctor și afișăm informații despre fiecare în consolă
        doctors2.forEach((doctor) => {
          doctor.image = "data:image/png;base64," + doctor.image;
          // Poți adăuga alte informații despre doctori pe care dorești să le afișezi
        });
        setDoctors(doctors2);
        console.log(doctors2);
      })
      .catch((error) => {
        console.error("Eroare la încărcarea datelor:", error);
      });

    axios
      .get("http://localhost:8081/location/allLocations")
      .then((response) => {
        setLocation(response.data);
      })
      .catch((error) => {
        console.error("Eroare la încărcarea datelor:", error);
      });

    axios
      .get("http://localhost:8081/specialization/allSpecializations")
      .then((response) => {
        setSpecialization(response.data);
      })
      .catch((error) => {
        console.error("Eroare la încărcarea datelor:", error);
      });
  }, []);

  useEffect(() => {
    // Actualizează recenziile pentru fiecare medic atunci când lista de medici este modificată
    doctors.forEach((doctor) => {
      handleReview(doctor.id).then((average) => {
        setReview((prevState) => ({
          ...prevState,
          [doctor.id]: average,
        }));
      });
      console.log(reviews);
      handleReviewCounter(doctor.id).then((counter) => {
        setReviewCounter((prevState) => ({
          ...prevState,
          [doctor.id]: counter,
        }));
      });
    });
  }, [doctors]);
  // Funcția de căutare pentru doctor
  const handleDoctorSearch = (event) => {
    const name = event.target.value;
    setDoctorName(name);

    if (name !== null && name.trim() !== "") {
      axios
        .get(`http://localhost:8081/doctor/getDoctor/${name}`)
        .then((response) => {
          setDoctors(response.data);
          const newSpecializations = response.data.reduce((acc, doctor) => {
            doctor.specializations.forEach((specialization) => {
              if (!acc.some((spec) => spec.name === specialization.name)) {
                acc.push(specialization);
              }
            });
            return acc;
          }, []);

          setSpecialization(newSpecializations);

          const newLocations = response.data.reduce((acc, doctor) => {
            doctor.locations.forEach((location) => {
              if (!acc.some((loc) => loc.city === location.city)) {
                acc.push(location);
              }
            });
            return acc;
          }, []);

          setLocation(newLocations);
        })
        .catch((error) => {
          console.error("Eroare la încărcarea datelor:", error);
        });
    } else {
      // Dacă doctorName este null sau gol, faci o cerere GET către toți doctorii
      axios
        .get("http://localhost:8081/doctor/allDoctors")
        .then((response) => {
          setDoctors(response.data);
          const newSpecializations = response.data.reduce((acc, doctor) => {
            doctor.specializations.forEach((specialization) => {
              if (!acc.some((spec) => spec.name === specialization.name)) {
                acc.push(specialization);
              }
            });
            return acc;
          }, []);

          setSpecialization(newSpecializations);

          const newLocations = response.data.reduce((acc, doctor) => {
            doctor.locations.forEach((location) => {
              if (!acc.some((loc) => loc.city === location.city)) {
                acc.push(location);
              }
            });
            return acc;
          }, []);

          setLocation(newLocations);
        })
        .catch((error) => {
          console.error("Eroare la încărcarea datelor:", error);
        });
    }
  };

  // Funcția pentru selectarea orașului
  const handleCitySelect = (event) => {
    const city = event.target.value;
    setSelectedCity(city);

    if (city === "") {
      // Dacă nu este selectată nicio specializare, afișează toți doctorii
      axios
        .get("http://localhost:8081/doctor/allDoctors")
        .then((response) => {
          setDoctors(response.data);
        })
        .catch((error) => {
          console.error("Eroare la încărcarea datelor:", error);
        });
    } else {
      const filteredDoctors = doctors.filter((doctor) => {
        return doctor.locations.some((location) => location.city === city);
      });

      setDoctors(filteredDoctors);
    }
  };

  // Funcția pentru selectarea specializării
  const handleSpecializationSelect = (event) => {
    const name = event.target.value;
    setSelectedSpecialization(name);

    if (name === "") {
      // Dacă nu este selectată nicio specializare, afișează toți doctorii
      axios
        .get("http://localhost:8081/doctor/allDoctors")
        .then((response) => {
          setDoctors(response.data);
        })
        .catch((error) => {
          console.error("Eroare la încărcarea datelor:", error);
        });
    } else {
      const filteredDoctors = doctors.filter((doctor) => {
        return doctor.specializations.some(
          (specialization) => specialization.name === name
        );
      });

      setDoctors(filteredDoctors);
    }
  };

  // Funcția de căutare pentru oraș și specializare
  const handleCitySpecializationSearch = () => {
    // Implementează funcționalitatea de căutare pentru oraș și specializare aici
    console.log("Oraș selectat:", selectedCity);
    console.log("Specializare selectată:", selectedSpecialization);
  };

  const handleReview = async (doctorId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/review/avg/${doctorId}`
      );
      return response.data;
    } catch (error) {
      console.error("Eroare la încărcarea datelor:", error);
      return { average: null }; // Întoarceți null sau o altă valoare semnificativă în caz de eroare
    }
  };

  const handleReviewCounter = async (doctorId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/review/counter/${doctorId}`
      );
      return response.data;
    } catch (error) {
      console.error("Eroare la încărcarea datelor:", error);
      return { counter: null }; // Întoarceți null sau o altă valoare semnificativă în caz de eroare
    }
  };

  return (
    <div>
      {/* Titlu și descriere */}
      <div className="doctor-header">
        <h3>Medici</h3>
        <p>
          Căutare simplă, soluții sigure: Explorează o gamă variată de medici și
          specialiști, având astfel informațiile și resursele necesare pentru a
          lua cea mai bună decizie pentru sănătatea ta
        </p>
      </div>

      {/* Căutare după numele doctorului */}
      <div className="search-box">
        <div className="search-name">
          <input
            type="text"
            value={doctorName}
            onChange={handleDoctorSearch}
            placeholder="Numele doctorului..."
          />
          <div className="icon">
            <SearchIcon />
          </div>
        </div>

        {/* Listele derulante pentru oraș și specializare */}
        <div>
          <select value={selectedCity} onChange={handleCitySelect}>
            <option value="">Selectează orașul</option>
            {uniqueCities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
          <select
            value={selectedSpecialization}
            onChange={handleSpecializationSelect}
          >
            <option value="">Selectează specializarea</option>
            {uniqueSpecializations.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Butonul de căutare 
      <div className='button-search'>
        <button onClick={handleCitySpecializationSearch}>Caută</button>
          </div> */}
      </div>

      {/* Lista de medici */}
      <div className="doctor-list">
        {doctors.map((doctor, index) => (
          <Link
            key={index}
            to={`/doctor/${doctor.id}`}
            className="doctor-card-link"
          >
            <div key={index} className="doctor-card">
              <div className="avatar-container">
                <Avatar
                  alt={doctor.fullName}
                  src={doctor.image}
                  sx={{ width: 100, height: 100 }}
                />
              </div>
              <div></div>
              <div className="nameSpecialization">
                <h2>Dr. {doctor.fullName}</h2>
                <p>Specializare: {doctor.specializations[0].name}</p>
              </div>
              {reviews[doctor.id] && (
                <div className="rating-container">
                  <p className="rating-value">
                    {reviews[doctor.id] !== undefined
                      ? reviews[doctor.id].toFixed(2)
                      : "N/A"}
                  </p>
                  <p>Recenzii: {reviewsCounter[doctor.id]}</p>
                  <Rating
                    name={`rating-${doctor.id}`}
                    value={reviews[doctor.id]}
                    precision={0.1}
                    readOnly
                  />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Doctor;
