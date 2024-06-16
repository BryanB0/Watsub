import './navbar.css'

import { Divider, Drawer, List, ListItem, ListItemButton, ListItemText, ThemeProvider, createTheme } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import { BsPersonCircle } from "react-icons/bs";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate(); // Move useNavigate hook here

  const handleLogout = (e) => {

    e.preventDefault();
    fetch('http://localhost:3000/users/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .then(navigate('/login'))
    .catch((error) => {
        console.error(error);
    });
    
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: '#ffffff',
      },
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#383838',
            color: '#55D9C0',
            border: 'solid 3px #55D9C0'
          }
        }
      },
    }
  });

  const iconStyle = { backgroundColor:'#55D9C0', borderRadius:"50%" };

  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{width: 350 }} role="presentation" onClick={toggleDrawer(false)}>
      <List disablePadding>
        <ListItem disablePadding>
          <ListItemButton sx={{borderBottom: `3px solid #55D9C0`}} >
            <ListItemText primaryTypographyProps={{fontSize: '1.5em', color:'#C7F6EC', textAlign:'center'}} sx={{textDecoration: 'underline'}} display="inline" primary={"Menu Principal"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/" sx={{borderBottom: '3px solid #55D9C0'}}>
            <ListItemText primaryTypographyProps={{fontSize: '1.5em', color:'#C7F6EC'}} primary={"Mes Dépenses"} />
            <MdOutlineArrowForwardIos color='#C7F6EC' size={'2.7em'}/>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/subslist" sx={{borderBottom: '3px solid #55D9C0'}}>
            <ListItemText primaryTypographyProps={{fontSize: '1.5em', color:'#C7F6EC'}} primary={"Mes Abonnements"} />
            <MdOutlineArrowForwardIos color='#C7F6EC' size={'2.7em'}/>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/user" sx={{borderBottom: '3px solid #55D9C0'}}>
            <ListItemText primaryTypographyProps={{fontSize: '1.5em', color:'#C7F6EC'}} primary={"Mes informations"} />
            <MdOutlineArrowForwardIos color='#C7F6EC' size={'2.7em'}/>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{borderBottom: '3px solid #55D9C0'}}>
            <ListItemText primaryTypographyProps={{fontSize: '1.5em', color:'#C7F6EC'}} primary={"Se déconnecter"} />
            <MdOutlineArrowForwardIos color='#C7F6EC' size={'2.7em'}/>
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </Box>
  );

  return (
    <>
      <ThemeProvider theme={theme}>
        <nav className='navbar'>
          <div onClick={toggleDrawer(true)} className='drawer-img'><RxHamburgerMenu /></div>
          <div className='title'>Whatsub</div>
          <div className='profilePic'><BsPersonCircle style={iconStyle} /></div>
        </nav>

        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </ThemeProvider>
    </>
  )
}

export default Navbar;
