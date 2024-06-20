import * as React from 'react';
import './subslist.css'
import { Accordion, AccordionDetails, AccordionSummary, Button, ThemeProvider, createTheme } from '@mui/material'
import { MdOutlineExpandMore } from "react-icons/md";
import { AiFillCar, AiOutlineHome } from "react-icons/ai";
import { SlEnergy } from "react-icons/sl";
import { IoIosAddCircle } from "react-icons/io";
import Navbar from '../../elements/navbar/navbar';
import { Link } from 'react-router-dom';

function Subslist() {

    const theme = createTheme({
        palette: {
            primary: {
                main: '#55D9C0',
            },
        },
    });

    return (
        <>
            <ThemeProvider theme={theme}>
                <Navbar />
                <main>
                    <div className='subslist'>
                        <h1>Gérer mes abonnements</h1>
                        <div className='substitle'>
                            <h2>Ajouter un abonnement</h2>
                            <Link to="/addsub"><IoIosAddCircle size={75} color='#55D9C0' /></Link>
                        </div>
                        <div className='AccordionsList'>
                            <div >
                                <Accordion sx={{
                                    backgroundColor: "#B7E0FF",
                                }}>
                                    <AccordionSummary
                                        expandIcon={<MdOutlineExpandMore />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <AiOutlineHome /> Habitation <div>&nbsp;date</div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        fournisseur :
                                    </AccordionDetails>
                                    <AccordionDetails>
                                        fréquence de prélevement :
                                    </AccordionDetails>
                                    <AccordionDetails>
                                        echéance :
                                    </AccordionDetails>
                                    <AccordionDetails>
                                        engagement :
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                            <div>
                                <Accordion sx={{
                                    backgroundColor: "#FFF1A6",
                                }}>
                                    <AccordionSummary
                                        expandIcon={<MdOutlineExpandMore />}
                                        aria-controls="panel2-content"
                                        id="panel2-header"
                                    >
                                        <SlEnergy /> Energie<div>&nbsp;date</div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        fournisseur :
                                    </AccordionDetails>
                                    <AccordionDetails>
                                        fréquence de prélevement :
                                    </AccordionDetails>
                                    <AccordionDetails>
                                        echéance :
                                    </AccordionDetails>
                                    <AccordionDetails>
                                        engagement :
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                            <div>
                                <Accordion sx={{
                                    backgroundColor: "#FF9F9F",
                                }}>
                                    <AccordionSummary
                                        expandIcon={<MdOutlineExpandMore />}
                                        aria-controls="panel2-content"
                                        id="panel2-header"
                                    >
                                        <AiFillCar /> Transport<div>&nbsp;date</div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        fournisseur :
                                    </AccordionDetails>
                                    <AccordionDetails>
                                        fréquence de prélevement :
                                    </AccordionDetails>
                                    <AccordionDetails>
                                        echéance :
                                    </AccordionDetails>
                                    <AccordionDetails>
                                        engagement :
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        </div>
                        <Link to="/"><Button className='subsmanage' variant="contained" color='primary' type="submit">Revenir a la page d'accueil</Button></Link>
                    </div>
                </main>
            </ThemeProvider>
        </>
    );
}

export default Subslist
