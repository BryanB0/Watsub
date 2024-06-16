import * as React from 'react';
import './user.css'
import Navbar from '../../elements/navbar/navbar';
import { Button, Dialog, DialogTitle, FormGroup, Input, InputAdornment, InputLabel, List, ListItem, TextField, ThemeProvider, createTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#55D9C0'
    },
    warning: {
      main: '#ffc93e'
    }
  },
});

function User() {

  const [formValues, setFormValues] = useState({
    first_name: '', last_name: '', phone: '', email: '', salary: ''
  })
  const [passFormValues, setPassFormValues] = useState({
    currentpass: '', newpass: '', confirmpass: ''
  })


  const handleChange = (e) => {
    setFormValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handleChangePass = (e) => {
    setPassFormValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  const handlePassSubmit = () => {
    console.log(passFormValues);
    if (passFormValues.newpass === passFormValues.confirmpass) {
      console.log('correct');

    } else console.log("incorrect");
  }
  const handleFormSubmit = () => {
    console.log(formValues);

  }

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Navbar />
      <main>
        <div className='user'>
          <h1>Gérer Mes informations</h1>

          <FormGroup className='form'>
            <ThemeProvider theme={theme}>
              <div className='form-elements'>
                <div className='form-element'>
                  <InputLabel className='label' htmlFor="first_name">Prénom :</InputLabel>
                  <Input value={formValues.first_name} onChange={handleChange} fullWidth type="text" name="first_name" id="first_name" placeholder='Johnny' disableUnderline={true} />
                </div>
                <hr />
                <div className='form-element'>
                  <InputLabel className='label' htmlFor="last_name">Nom :</InputLabel>
                  <Input value={formValues.last_name} onChange={handleChange} fullWidth type="text" name="last_name" id="last_name" placeholder='Sins' disableUnderline={true} />
                </div>
                <hr />
                <div className='form-element'>
                  <InputLabel className='label' htmlFor="phone">Téléphone :</InputLabel>
                  <Input fullWidth value={formValues.phone} onChange={handleChange} type="text" name="phone" id="phone" placeholder='0626554822' disableUnderline={true} />

                </div>
                <hr />
                <div className='form-element'>
                  <InputLabel className='label' htmlFor="email">Email :</InputLabel>
                  <Input value={formValues.email} onChange={handleChange} fullWidth type="email" name="email" id="email" placeholder='johnnysisns@john.com' disableUnderline={true} />
                </div>
                <hr />
                <div className='form-element'>
                  <InputLabel className='label' htmlFor="salary">Salaire Mensuel :</InputLabel>
                  <Input value={formValues.salary} onChange={handleChange} fullWidth type="number" name="salary" id="salary" placeholder='2000' disableUnderline={true} endAdornment={<InputAdornment position="end"><div className='euro-symb'>€</div></InputAdornment>} />

                </div>
                <hr />
                <div className='form-element'>
                  <InputLabel className='label' htmlFor="password">Mot de passe :</InputLabel>
                  <Button className='passButton' variant='contained' color='warning' onClick={handleClickOpen}>Changer</Button>
                  <Dialog className='userdialog' fullWidth={true} maxWidth="xs" PaperProps={{
                    style: {
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      color: "white",
                    },
                  }} onClose={handleClose} open={open}>
                    <DialogTitle sx={{ textAlign: 'center', backgroundColor: '#02231C', borderRadius: "25px 25px 0 0", border: '2px solid #55D9C0' }} >Modification du mot de passe</DialogTitle>
                    <FormGroup>
                      <List disablePadding>
                        <ListItem className='useritems' sx={{ backgroundColor: '#02231C', borderRadius: "0 0 25px 25px", border: '2px solid #55D9C0' }}>
                          <div className='useritem'>
                            <label htmlFor="currentpass">Votre mot de passe</label>
                            <TextField type='password' value={passFormValues.currentpass} onChange={handleChangePass} name='currentpass' id='currentpass' sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: 'white',
                                  borderRadius: '25px'
                                },
                                '&:hover fieldset': {
                                  borderColor: 'white',
                                },
                              },

                            }} size='small' variant="outlined"
                            ></TextField>
                          </div>
                          <div className='useritem'>
                            <label htmlFor="newpass">Votre nouveau mot de passe</label>
                            <TextField type='password' value={passFormValues.newpass} onChange={handleChangePass} name='newpass' id='newpass' sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: 'white',
                                  borderRadius: '25px'
                                },
                                '&:hover fieldset': {
                                  borderColor: 'white',
                                },
                              },

                            }} size='small' variant="outlined"
                            ></TextField>
                          </div>
                          <div className='useritem'>
                            <label htmlFor="confirmpass">Confirmer votre mot de passe</label>
                            <TextField type='password' value={passFormValues.confirmpass} onChange={handleChangePass} name='confirmpass' id='confirmpass' sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: 'white',
                                  borderRadius: '25px'
                                },
                                '&:hover fieldset': {
                                  borderColor: 'white',
                                },
                              },

                            }} size='small' variant="outlined"
                            ></TextField>
                          </div>
                        </ListItem>
                      </List>
                      <List className='dialogButton'>
                        <Button size='small' variant="contained" color='error' onClick={handleClose}>Annuler</Button>
                        <Button size='small' variant="contained" color='primary' onClick={handlePassSubmit}>Sauvegarder</Button>
                      </List>
                    </FormGroup>
                  </Dialog>
                </div>
              </div>
              <div className='buttons'>
                <Link to="/"><Button variant="contained" color='error'>Annuler</Button></Link>
                <Button variant="contained" color='primary' className='submit' type="submit " onClick={handleFormSubmit}>sauvegarder</Button>
              </div>
            </ThemeProvider>
          </FormGroup>

        </div>
      </main>
    </>
  );
}

export default User
