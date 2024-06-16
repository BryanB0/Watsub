import { Button, FormGroup, IconButton, Input, InputAdornment, OutlinedInput, ThemeProvider, createTheme } from '@mui/material';
import Presentation from '../../elements/presentation';
import './login.css';
import Titlebar from '../../elements/titleBar/Titlebar';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const theme = createTheme({
    palette: {
        primary: {
            main: '#55D9C0',
        },
    },
});

function Login() {

    const [formValues, setFormValues] = useState({
        mail: '', motdepasse: ''
    })
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleFormSubmit = (e) => {

        e.preventDefault();
        fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formValues),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .then(navigate('/'))
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
                <div className='login'>
                    <div className='left'>
                        <Presentation />
                    </div>
                    <div className='right'>
                        <div className='form'>
                            <ThemeProvider theme={theme}>
                                <FormGroup>
                                    <OutlinedInput
                                        type="email"
                                        name="mail"
                                        id="mail"
                                        size="small"
                                        placeholder='Entrez votre email'
                                        value={formValues.mail}
                                        onChange={handleChange}
                                        sx={{ bgcolor: 'white', borderRadius: '10px', marginBottom: '1rem' }}
                                    />
                                    <OutlinedInput
                                        type={showPassword ? 'text' : 'password'}
                                        variant="outlined"
                                        name="motdepasse"
                                        id="motdepasse"
                                        size="small"
                                        value={formValues.motdepasse}
                                        onChange={handleChange}
                                        placeholder='Entrez votre mot de passe'
                                        sx={{ bgcolor: 'white', borderRadius: '10px', marginBottom: '1rem' }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    style={{ color: 'black', fontSize: 30 }}
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    <Button variant="contained" color='primary' type="submit" onClick={handleFormSubmit}>Se connecter</Button>
                                </FormGroup>
                                <Link to='/register'><Button variant="contained" color='primary'>S'inscrire</Button></Link>
                            </ThemeProvider>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Login;
