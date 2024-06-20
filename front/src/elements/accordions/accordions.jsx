import * as React from 'react';
import './accordion.css'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { MdOutlineExpandMore } from "react-icons/md";
import { AiFillCar, AiOutlineHome } from "react-icons/ai";
import { SlEnergy } from "react-icons/sl";

function Accordions() {
  return (
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
            <AiOutlineHome /> Habitation
          </AccordionSummary>
          
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
            <SlEnergy /> Energie
          </AccordionSummary>
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
            <AiFillCar /> Transport
          </AccordionSummary>
        </Accordion>
      </div>
    </div>
    
  );
}

export default Accordions
