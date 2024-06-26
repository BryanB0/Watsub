import { Button, Checkbox, Dialog, DialogTitle, FormGroup, InputLabel, List, ListItem, TextField, ThemeProvider, createTheme } from '@mui/material';
import './addsub.css';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../../elements/navbar/navbar';
import { Link } from 'react-router-dom';

const theme = createTheme({
    palette: {
        primary: {
            main: '#55D9C0',
        },
        secondary: {
            main: '#fff',
        },
    },
});

const textFieldStyle = {
    width: '50%',
    '& .MuiSvgIcon-root': {
        color: 'white',
    },
    '& .MuiInputBase-input': {
        backgroundColor: '#ffffff80',
    },
    "& fieldset": { border: 'none' },
};

const textFieldCate = {
    width: '50%',
    '& .MuiSvgIcon-root': {
        color: 'white',
    },
    "& fieldset": { border: 'none' },
};

function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;
    const [color, setColor] = useState('');

    const handleClose = () => {
        onClose(selectedValue);
    };

    const [colorFormValues, colorSetFormValues] = useState({
        nom_sous_categorie: '', couleur_sous_categorie: color
    });

    const handleListItemClick = (e) => {
        e.preventDefault();
        fetch('http://localhost:3000/sous_categorie/create_sous_categorie', {
            method: 'POST', 
            body: JSON.stringify(colorFormValues),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch((error) => {
            console.error(error);
        });
        onClose(colorFormValues);
        window.location.reload(); 
    };

    const handleChangeColor = (e) => {
        const { name, value } = e.target;
        setColor(value);
        colorSetFormValues(prev => ({ ...prev, [name]: value }));
    };

    return (
        <FormGroup>
            <ThemeProvider theme={theme}>
                <Dialog className='addsubdialog' fullWidth={true} maxWidth="xs" PaperProps={{
                    style: {
                        backgroundColor: '#929292',
                        color: "white",
                        borderRadius: "25px",
                        border: '2px solid white',
                    },
                }} onClose={handleClose} open={open}>
                    <DialogTitle sx={{ textAlign: 'center' }}>Nouvelle sous catégorie</DialogTitle>
                    <List>
                        <ListItem>
                            <TextField value={colorFormValues.nom_sous_categorie} onChange={handleChangeColor} name='nom_sous_categorie' fullWidth sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                        borderRadius: '25px'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'white',
                                    },
                                },
                            }} size='small' variant="outlined" placeholder='Nom'></TextField>
                        </ListItem>
                        <ListItem>
                            <input value={colorFormValues.couleur_sous_categorie} onChange={handleChangeColor} name='couleur_sous_categorie' type="color" className="colorPicker" />
                        </ListItem>
                    </List>
                    <div className='dialogButton'>
                        <Button size='small' variant="contained" color='error' onClick={handleClose}>Annuler</Button>
                        <Button size='small' variant="contained" color='primary' onClick={handleListItemClick}>Sauvegarder</Button>
                    </div>
                </Dialog>
            </ThemeProvider>
        </FormGroup>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

function Addsub() {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryColor, setSelectedCategoryColor] = useState('#ffffff80');
    const [subcategories, setsubCategories] = useState([]);
    const [selectedSubcategoryColor, setSelectedSubcategoryColor] = useState('#ffffff80');
    const [formValues, setFormValues] = useState({
        id_categorie: '',
        id_sous_categorie:'',
        nom_fournisseur: '',
        montant: '',
        frequence_prelevement: '',
        date_echeance: '',
        IsEngagement: false,
        date_fin_engagement: ''
    });
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState();

    useEffect(() => {
        fetch('http://localhost:3000/categorie/get_all_categorie')
            .then(response => response.json())
            .then(data => {
                setCategories(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        fetch('http://localhost:3000/sous_categorie/get_all_sous_categorie')
            .then(response => response.json())
            .then(data => {
                setsubCategories(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const montantInt = parseInt(formValues.montant, 10);
    const id_categorieInt = parseInt(formValues.id_categorie, 10);
    const id_sous_categorieInt = parseInt(formValues.id_sous_categorie, 10);
    const updatedFormValues = { ...formValues, montant: montantInt, id_categorie: id_categorieInt, id_sous_categorie : id_sous_categorieInt ?  id_sous_categorieInt : null};

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (name === 'id_categorie') {
            const selectedCategory = categories.find(option => option.id_category === parseInt(value));
            setSelectedCategoryColor(selectedCategory ? selectedCategory.couleur_category : '#ffffff80');
        }

        if (name === 'id_sous_categorie') {
            const selectedSubcategory = subcategories.find(option => option.id_sous_categorie === parseInt(value));
            setSelectedSubcategoryColor(selectedSubcategory ? selectedSubcategory.couleur_sous_categorie : '#ffffff80');
        }
    };

    const handleFormSubmit = (e) => {
        console.log(updatedFormValues);
        e.preventDefault();
        fetch('http://localhost:3000/abonnement/create_abonnement', {
            method: 'POST', 
            body: JSON.stringify(updatedFormValues),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch((error) => {
            console.error(error);
        });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        if (value && value.nom_sous_categorie) {
            setFormValues(prev => ({
                ...prev,
                subcategory: value
            }));
        }
        setSelectedValue(value);
    };

    return (
        <>
            <Navbar />
            <main>
                <div className='addsub'>
                    <h1>Nouvel Abonnement</h1>
                    <FormGroup className='form'>
                        <ThemeProvider theme={theme}>
                            <div className='form-elements'>
                                <div className='form-element'>
                                    <InputLabel className='label' htmlFor="id_categorie">Catégorie :</InputLabel>
                                    <TextField value={formValues.id_categorie} onChange={handleChange}
                                        color="secondary" focused
                                        id="id_categorie"
                                        name='id_categorie'
                                        select
                                        sx={[textFieldCate, { backgroundColor: selectedCategoryColor }]}
                                        SelectProps={{
                                            native: true,
                                        }}
                                    >
                                        <option value=""></option>
                                        {categories.map((option, key) => (
                                            <option style={{ backgroundColor: option.couleur_category }} key={key} value={option.id_category}>
                                                {option.nom_category}
                                            </option>
                                        ))}
                                    </TextField>
                                </div>
                                <hr />

                                <div className='form-element'>
                                    <InputLabel className='label' htmlFor="id_sous_categorie">Sous Catégorie :</InputLabel>
                                    <TextField
                                        color="secondary" focused
                                        id="id_sous_categorie"
                                        className='id_sous_categorie'
                                        select
                                        value={formValues.id_sous_categorie}
                                        sx={[textFieldCate, { backgroundColor: selectedSubcategoryColor }]}
                                        SelectProps={{
                                            native: true,
                                            onChange: (event) => {
                                                if (event.target.value === "newcategory") {
                                                    handleClickOpen();
                                                } else {
                                                    const selectedSubcategory = subcategories.find(option => option.id_sous_categorie === parseInt(event.target.value));
                                                    setFormValues(prev => ({
                                                        ...prev,
                                                        id_sous_categorie: event.target.value,
                                                        colorFormValues: selectedSubcategory
                                                    }));
                                                }
                                            }
                                        }}
                                    >
                                        <option value="" />
                                        {subcategories.map((option, key) => (
                                            <option style={{ backgroundColor: option.couleur_sous_categorie }} key={key} value={option.id_sous_categorie}>
                                            {option.nom_sous_categorie}
                                        </option>
                                    ))}
                                    <option value="newcategory">Ajouter une sous catégorie ...</option>
                                </TextField>
                            </div>
                            <hr />
                            <div className='form-element'>
                                <InputLabel className='label' htmlFor="nom_fournisseur">Fournisseur :</InputLabel>
                                <TextField value={formValues.nom_fournisseur} onChange={handleChange} sx={textFieldStyle} name="nom_fournisseur" id="nom_fournisseur" ></TextField>
                            </div>
                            <hr />
                            <div className='form-element'>
                                <InputLabel className='label' htmlFor="montant">Prix :</InputLabel>
                                <TextField value={formValues.montant} onChange={handleChange} type='number' sx={textFieldStyle} name="montant" id="montant" ></TextField>
                            </div>
                            <hr />
                            <div className='form-element'>
                                <InputLabel className='label' htmlFor="frequence_prelevement">Fréquence :</InputLabel>
                                <TextField value={formValues.frequence_prelevement} onChange={handleChange}
                                    color="secondary" focused
                                    id="frequence_prelevement"
                                    name='frequence_prelevement'
                                    select
                                    sx={textFieldStyle}
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    <option value=""></option>
                                    <option value="Hebdomadaire">Hebdomadaire</option>
                                    <option value="Bimensuel">Bimensuel</option>
                                    <option value="Mensuel">Mensuel</option>
                                    <option value="Trimestriel">Trimestriel</option>
                                    <option value="Annuel">Annuel</option>
                                </TextField>
                            </div>
                            <hr />
                            <div className='form-element'>
                                <InputLabel className='label' htmlFor="date_echeance">Échéance :</InputLabel>
                                <TextField type='date' value={formValues.date_echeance} onChange={handleChange} sx={textFieldStyle} name="date_echeance" id="date_echeance" ></TextField>
                            </div>
                            <hr />
                            <div className='form-element'>
                                <InputLabel className='label' htmlFor="IsEngagement">Engagement :</InputLabel>
                                <Checkbox checked={formValues.IsEngagement} onChange={handleChange} name="IsEngagement" id="IsEngagement" />
                                <TextField type='date' value={formValues.date_fin_engagement} disabled={!formValues.IsEngagement} onChange={handleChange} sx={textFieldStyle} name="date_fin_engagement" id="date_fin_engagement" ></TextField>
                            </div>
                            <hr />
                            <div className='buttons'>
                                <Button variant="contained" color='primary' onClick={handleFormSubmit}>Sauvegarder</Button>
                                <Link to='/subslist'><Button variant="contained" color='error'>Annuler</Button></Link>
                            </div>
                        </div>
                    </ThemeProvider>
                </FormGroup>
            </div>
        </main>
        <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
    </>
);
}

export default Addsub;
