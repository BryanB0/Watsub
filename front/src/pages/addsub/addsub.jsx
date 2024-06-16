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

const subcategories = [
    { id: 1, name: "Elec", color: "#FFF1A6" },
    { id: 2, name: "Gaz", color: "#FFF1A6" },
];

const textFieldStyle = {
    width: '50%',
    '& .MuiSvgIcon-root': {
        color: 'white',
    },
    '& .MuiInputBase-input': {
        backgroundColor: '#ffffff80',
    },
    "& fieldset": { border: 'none' },
}
const textFieldCate = {
    width: '50%',
    '& .MuiSvgIcon-root': {
        color: 'white',
    },
    "& fieldset": { border: 'none' },
}

function SimpleDialog(props) {
    const { onClose, selectedValue, open } = props;
    const [color, setColor] = useState('');

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = () => {
        onClose(colorFormValues);
    };

    const handleChangeColor = (e) => {
        const { name, value } = e.target;
        setColor(value);
        colorSetFormValues(prev => ({ ...prev, [name]: value }));
    };

    const [colorFormValues, colorSetFormValues] = useState({
        subname: '', subhex: color
    });

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
                            <TextField value={colorFormValues.subname} onChange={handleChangeColor} name='subname' fullWidth sx={{
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
                            <input value={colorFormValues.subhex} onChange={handleChangeColor} name='subhex' type="color" className="colorPicker" />
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

    useEffect(() => {
        fetch('http://localhost:3000/categorie/get_all_categorie')
            .then(response => response.json())
            .then(data => {
                setCategories(data);
                //console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const [formValues, setFormValues] = useState({
        id_categorie: '',
        subcategory: { subname: '', subhex: '' },
        nom_fournisseur: '',
        montant: '',
        frequence_prelevement: '',
        echeance: '',
        IsEngagement: false,
        date_fin_engagement: ''
    });


    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState();

    const montantInt = parseInt(formValues.montant, 10);
    const id_categorieInt = parseInt(formValues.id_categorie, 10);
    const updatedFormValues = { ...formValues, montant: montantInt, id_categorie: id_categorieInt };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFormSubmit = () => {
        console.log(updatedFormValues);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        if (value && value.subname) {
            setFormValues(prev => ({
                ...prev,
                subcategory: value
            }));
        }
        setSelectedValue(value);
    };

    const selectedCategoryOption = categories.find(option => option.id_category === (updatedFormValues.id_categorie));
    const selectedCategoryColor = selectedCategoryOption ? selectedCategoryOption.couleur_category : '#ffffff80';

    const selectedSubcategoryOption = subcategories.find(option => option.name === formValues.subcategory.subname);
    const selectedSubcategoryColor = selectedSubcategoryOption ? selectedSubcategoryOption.color : (formValues.subcategory.subhex || '#ffffff80');

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
                                    <InputLabel className='label' htmlFor="subcategory">Sous Catégorie :</InputLabel>
                                    <TextField
                                        color="secondary" focused
                                        id="subcategory"
                                        className='subcategory'
                                        select
                                        value={formValues.subcategory.subname}
                                        sx={[textFieldCate, { backgroundColor: selectedSubcategoryColor }]}
                                        SelectProps={{
                                            native: true,
                                            onChange: (event) => {
                                                if (event.target.value === "newcategory") {
                                                    handleClickOpen();
                                                } else {
                                                    const selectedSubcategory = subcategories.find(option => option.name === event.target.value);
                                                    setFormValues(prev => ({
                                                        ...prev,
                                                        subcategory: selectedSubcategory
                                                    }));
                                                }
                                            }
                                        }}
                                    >
                                        <option value="" />
                                        {subcategories.map((option) => (

                                            <option style={{ backgroundColor: option.color }} key={option.id} value={option.name}>
                                                {option.name}
                                            </option>
                                        ))}
                                        <option value="newcategory">Ajouter une sous catégorie ...</option>

                                        {formValues.subcategory.subname && (
                                            <option style={{ backgroundColor: formValues.subcategory.subhex }} value={formValues.subcategory.subname}>
                                                {formValues.subcategory.subname}
                                            </option>
                                        )}
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
