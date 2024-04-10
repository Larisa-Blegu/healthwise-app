import React, { useState, useEffect } from 'react';
import person_icon from '../Assets/person.png';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/CheckCircle';
import './Review.css';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { Link, useNavigate } from 'react-router-dom'; // importă useNavigate

function Review() {
    const { appointmentId } = useParams();
    const [doctorName, setDoctorName] = useState('');
    const [doctor, setDoctor] = useState();
    const [showRatingField, setShowRatingField] = useState(false);
    const [showCommentField, setShowCommentField] = useState(false);
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const navigate = useNavigate();
    const labels = {
        0.5: 'Useless',
        1: 'Useless+',
        1.5: 'Poor',
        2: 'Poor+',
        2.5: 'Ok',
        3: 'Ok+',
        3.5: 'Good',
        4: 'Good+',
        4.5: 'Excellent',
        5: 'Excellent+',
    };


    useEffect(() => {
        const fetchDoctorName = async () => {
            try {
                const appointmentResponse = await axios.get(`http://localhost:8081/appointment/${appointmentId}`);
                const appointment = appointmentResponse.data;

                const doctorId = appointment.doctor.id;
                const doctorResponse = await axios.get(`http://localhost:8081/doctor/${doctorId}`);
                const doctor = doctorResponse.data;
                setDoctor(doctor);
                setDoctorName(doctor.fullName);
            } catch (error) {
                console.error('Error fetching doctor name:', error);
            }
        };

        fetchDoctorName();
    }, [appointmentId]);

    const handleAddRatingClick = () => {
        setShowRatingField(true);
        setShowCommentField(false); // Inchide celalalt textfield
    };

    const handleAddCommentClick = () => {
        setShowCommentField(true);
        setShowRatingField(false); // Inchide celalalt textfield
    };

    function getLabelText(value) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    }
    async function save() {
        if (value) {
            try {
                const response = await axios.post("http://localhost:8081/review", {
                    grade: value,
                    text: comment,
                    doctor: doctor
                });
                if (response.status === 200) {
                    console.log('Cererea de programare a fost trimisă cu succes!');
                    const reviewStatus = await axios.post(`http://localhost:8081/appointment/reviewStatus/${appointmentId}/TRUE`);
                    navigate('/yourAppointments');
                    // Aici puteți adăuga orice alte acțiuni necesare după ce cererea a fost trimisă cu succes
                } else {
                    console.error('Eroare la trimiterea cererii de programare:', response.statusText);
                }
            } catch (error) {
                console.error('Eroare la trimiterea cererii de programare:', error);
            }

        } else {
            alert("Selecteaza rating");
        }
    };
    const handleNextClick = () => {
        if (value) {
            setShowCommentField(true);
            setShowRatingField(false);
        } else {
            alert("Selecteaza rating");
        }
    };

    const [value, setValue] = React.useState(0); // Setarea valorii implicite la 0
    const [hover, setHover] = React.useState(-1);

    return (
        <div>
            <nav>
                <ul>
                    <li><a href="/">Pagina principală</a></li>
                    <li><a href="/doctor">Medici</a></li>
                    <li><a href="/specialization">Specializări</a></li>
                    <li><a href="/location">Locații</a></li>
                    <li><a href="/appointment">Programări</a></li>
                    <div className="right-container">
                        <li><a href="/login">Login</a></li>
                        <li><img src={person_icon} alt="User" className="user-icon" /></li>
                    </div>
                </ul>
            </nav>
            <div className='title'>Review pentru {doctorName}</div>
            <p className='SpecializationDescription'>Împărtășiți-vă recenziile și părerea cu privire la consultațiile medicale pentru a ajuta alții să ia decizii informate și să găsească sprijin și inspirație în comunitatea noastră dedicată sănătății. Prin contribuția ta, poți aduce claritate, creând un mediu în care fiecare voce contează și fiecare poveste poate inspira și ajuta pe alții să se îngrijească mai bine de sănătatea lor.</p>
            <div className='box'>


                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                    <Fab color="primary" aria-label="add" onClick={handleAddRatingClick}>
                        <AddIcon />
                    </Fab>
                    <Fab color="secondary" aria-label="edit" onClick={handleAddCommentClick}>
                        <EditIcon />
                    </Fab>
                </Box>
                {/* Textbox pentru rating */}
                {showRatingField && (
                    <Box
                        className='review-input'
                    >
                        <div className='stars'>
                            <Rating
                                name="hover-feedback"
                                size="large"
                                value={value}
                                precision={0.5}
                                getLabelText={getLabelText}
                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                }}
                                onChangeActive={(event, newHover) => {
                                    setHover(newHover);
                                }}
                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                            />
                            {value !== null && (
                                <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
                            )}
                            <div className='save-button'>
                                <Fab color="success" aria-label="save" onClick={handleNextClick}>
                                    <SaveIcon />
                                </Fab>
                            </div>
                        </div>

                    </Box>
                )}


                {showCommentField && (
                    <div>
                        <textarea
                            cols='30'
                            rows='5'
                            className="review-input"
                            type="text"
                            placeholder="Lasa un comentariu"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className='save-button2'>
                            <Fab color="success" aria-label="save" onClick={save}>
                                <SaveIcon />
                            </Fab>
                        </div>
                    </div>
                )}

                {/* Iconițe pentru adăugare rating și comentariu */}

            </div>
        </div>
    );
}

export default Review;
