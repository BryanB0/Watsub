import { Button, FormGroup, IconButton, Input, InputAdornment, InputLabel, ThemeProvider, createTheme } from '@mui/material'
import Presentation from '../../elements/presentation'
import './register.css'
import Titlebar from '../../elements/titleBar/Titlebar';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const theme = createTheme({
    palette: {
        primary: {
            main: '#55D9C0'
        }
    },
});

const inputTheme = {
    '&.MuiInput-underline:hover:before': { borderColor: 'white' },
    '&.MuiInput-underline:before': { borderColor: 'white' }
}

function Register() {

    const [formValues, setFormValues] = useState({
        nom: '', prenom: '', telephone: '', salaire: '', mail: '', motdepasse: '', ismailverif: false
    });
    
    const salaireInt = parseInt(formValues.salaire, 10);
    const updatedFormValues = { ...formValues, salaire: salaireInt };
    
    
    const handleChange = (e) => {
        setFormValues(prev => ({ ...prev, [e.target.name]: e.target.value }
        ));
        
    }
    const navigate = useNavigate();
    
    const [errorMessage, setErrorMessage] = useState();
    
    
    const handleFormSubmit = (e) => {
        console.log(formValues);
        console.log(updatedFormValues);
        e.preventDefault();
        fetch('http://localhost:3000/users/create_user', {
            method: 'POST', 
            body: JSON.stringify(updatedFormValues),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success === true) {
                navigate('/login')
                console.log("account created")
            } else {
                setErrorMessage(data.message)
            }
        })
        .catch((error) => {
            console.error(error);
            });
        }
        
        const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

    return (
        <>
            <Titlebar />
            <main>
                <div className='register'>
                    <div className='left'>
                        <Presentation />
                    </div>
                    <div className='right'>

                        <p className='welcome'>Bienvenue sur <span className='app-name'>Whatsub</span></p>
                        <p>Pour vous inscrire veuillez completer les champs suivants :</p>

                        <FormGroup className='form'>
                            <ThemeProvider theme={theme}>
                                <div className='form-elements'>
                                    <div className='form-element'>
                                        <InputLabel className='label' htmlFor="prenom">Prénom :</InputLabel>
                                        <Input value={formValues.prenom} onChange={handleChange} fullWidth type="text" name="prenom" id="prenom" placeholder='Johnny' disableUnderline={true} />
                                    </div>
                                    <hr />
                                    <div className='form-element'>
                                        <InputLabel className='label' htmlFor="nom">Nom :</InputLabel>
                                        <Input value={formValues.nom} onChange={handleChange} fullWidth type="text" name="nom" id="nom" placeholder='Martin' disableUnderline={true} />
                                    </div>
                                    <hr />
                                    <div className='form-element'>
                                        <InputLabel className='label' htmlFor="telephone">Téléphone : </InputLabel>
                                        <Input value={formValues.telephone} onChange={handleChange} fullWidth type="text" name="telephone" id="telephone" placeholder='0621153232' disableUnderline={true} />
                                    </div>
                                    <hr />
                                    <div className='form-element'>
                                        <InputLabel className='label' htmlFor="salaire">Salaire :</InputLabel>
                                        <Input value={formValues.salaire} onChange={handleChange} fullWidth type="number" name="salaire" id="salaire" placeholder='2000' disableUnderline={true} endAdornment={<InputAdornment position="end"><div className='euro-symb'>€</div></InputAdornment>} />
                                    </div>
                                    <hr />
                                    <div className='form-element'>
                                        <InputLabel className='label' htmlFor="mail">Email* :</InputLabel>
                                        <Input value={formValues.mail} onChange={handleChange} fullWidth type="mail" name="mail" id="mail" placeholder='johnnymartin@mail.com' disableUnderline={true} />
                                    </div>
                                    <hr />
                                    <div className='form-element'>
                                        <div><InputLabel className='label' htmlFor="motdepasse">Mot de passe* :</InputLabel></div>
                                        <Input fullWidth value={formValues.motdepasse} onChange={handleChange} name="motdepasse" id="motdepasse" disableUnderline={true} placeholder='Le mot de passe' 
                                        type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                              <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                              >
                                                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                              </IconButton>
                                            </InputAdornment>
                                          }
                                        />
                                    </div>
                                </div>
                                <div className='error'>{errorMessage}</div>
                                <Button variant="contained" color='primary' className='submit' type="submit" onClick={handleFormSubmit}>S'inscrire</Button>
                                <Link to='/login' ><Button variant="contained" color='error'>Annuler</Button></Link>
                            </ThemeProvider>
                        </FormGroup>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Register;
