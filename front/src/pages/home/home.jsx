import { Button, Tab, ThemeProvider, createTheme } from '@mui/material'
import { TabPanel, TabContext, TabList, clockPickerClasses } from '@mui/lab'
import './home.css'
import { Box } from '@mui/system'
import { useState, useEffect, useContext, createContext } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Navbar from '../../elements/navbar/navbar';
import Accordion from '../../elements/accordions/accordions';
import { Link } from 'react-router-dom';

const theme = createTheme({
    palette: {
        primary: {
            main: '#ffffff',

        },
        secondary: {
            main: '#55D9C0',

        },
    },
});

const boxTheme = {
    fontSize: '1.5rem',
    width: '50%',
    color: "white"
}

function Home() {
   
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
 const [user, getUser] = useState([])
 const mail = 'framboise@.redos';
useEffect(() => {
  fetch(`http://localhost:3000/users/get_user_by_mail?mail=${mail}`, {
    method: 'GET'
  })
    .then(response => response.json())
    .then(data => {
      //console.log(data);
      getUser(data)
    })
    .catch((error) => {
      console.error(error);
    });
}, []);

    const depenses = 521
    const salaire = 1500

    return (
        <>
            <ThemeProvider theme={theme}>
                <Navbar />
                <main>
                    <div className='index'>
                        <div className='left'>
                            <h1>Mes depenses</h1>
                            <div className='leftcontent'>
                                <PieChart
                                    series={[
                                        {
                                            data: [
                                                { id: 0, value: 120, label: 'series A', color: '#B7E0FF' },
                                                { id: 1, value: 60, label: 'series B', color: '#FFF1A6' },
                                                { id: 2, value: 30, label: 'series C', color: '#FF9F9F' },
                                            ],
                                            innerRadius: 30,
                                            outerRadius: 160,
                                            paddingAngle: 1,
                                            cornerRadius: 5,
                                            cx: 175,
                                            cy: 175,

                                        },
                                    ]}
                                    width={350}
                                    height={350}

                                    slotProps={{ legend: { hidden: true } }}
                                />
                                
                                <p>Budget Restant : {salaire-depenses}€</p>
                            </div>
                        </div>
                        <div className='right'>
                            <Box sx={{ width: '100%' }}>
                                <TabContext value={value}>
                                    <Box sx={{ borderBottom: 1, borderColor: '#55D9C0' }}>
                                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                                            <Tab className='tabs' sx={boxTheme} label="Au mois" value="1" />
                                            <Tab className='tabs' sx={boxTheme} label="A l'année" value="2" />
                                        </TabList>
                                    </Box>
                                    <div className='rightcontent'>
                                        <TabPanel value="1">
                                            <h1>Total : {depenses} €</h1>
                                            <Accordion />
                                        </TabPanel>
                                        <TabPanel value="2">
                                            <h1>Total : {depenses * 12} €</h1>
                                            <Accordion />
                                        </TabPanel>
                                    </div>
                                </TabContext>
                            </Box>
                            <Link to="/subslist"><Button className='subsmanage' variant="contained" color='secondary' type="submit">Gérer mes abonnements</Button></Link>
                        </div>
                    </div>
                </main>
            </ThemeProvider>
        </>
    )
}
export default Home