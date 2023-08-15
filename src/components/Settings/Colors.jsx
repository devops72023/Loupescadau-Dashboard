import React, { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../../App';
import { ColorsIcon, CouponIcon, GeneralInfosIcon, ImageImportIcon } from '../global/Icons';
import { Link } from 'react-router-dom'

import '../../assets/styles/fieldset.css';
import '../../assets/styles/AddUserPage.css';
import '../../assets/styles/colors.css';
import { toast } from 'react-toastify';
import SpinningToast from '../global/SpinningToast';
import { motion } from 'framer-motion';

export default function Colors(props){
    const { setPageName, setActiveItem, navState, setSettingChanged } = useContext(AppContext)
    const [ mainColor, setMainColor ] = useState('')
    const [ secondaryColor, setSecondaryColor ] = useState('')
    const [ textColor, setTextColor ] = useState('')

    const [logoName, setLogoName ] = useState('Choisir une image');
    const [logo, setLogo] = useState(null);
    const logoInput = useRef(null)
    const logoImage = useRef(null)

    const handleIconButtonClick = () =>{
        iconInput.current.click();
    }
    const handleLogoButtonClick = () =>{
        logoInput.current.click();
    }
    function importfile(e,type){
        if (type == 'icon') {
            setIconName(e.target.files[0].name)
            setIcon(e.target.files[0])
            const reader = new FileReader();
            reader.onload = () => iconImage.current.src = reader.result
            reader.readAsDataURL(e.target.files[0])
        }
        else if(type == 'logo'){
            setLogoName(e.target.files[0].name)
            setLogo(e.target.files[0])
            const reader = new FileReader();
            reader.onload = () => logoImage.current.src = reader.result
            reader.readAsDataURL(e.target.files[0])
        }
    }
    const handleIconImport = e => {
        importfile(e, 'icon')
    }
    const handleLogoImport = e => {
        importfile(e, 'logo')
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('maincolor', mainColor);
        formData.append('secondarycolor', secondaryColor);
        formData.append('textcolor', textColor)
        if ( logo != null ) formData.append( 'logo', logo );
        
        let toastId = toast.dark(<SpinningToast />, { autoClose: false, hideProgressBar: true, theme: 'light' });

        fetch(`${ import.meta.env.VITE_API_URL }settings/`, {
            method: "POST",
            headers: { Authorization: "Bareer " + localStorage.getItem('jwt') },
            body: formData
        })
        .then(async res => res.json())  
        .then( res => {
            
            toast.update(toastId, {
                render: 'Les informations ont été changées avec succès!',
                type: 'success',
                theme: 'light',
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000, // Close the alert after 3 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setMainColor(res.maincolor);
            setSecondaryColor(res.secondarycolor);
            setTextColor(res.textcolor)
            setSettingChanged(new Date());
        })
        .catch(err => {
            toast.update(toastId, {
                render: err.error,
                type: 'error',
                theme: 'light',
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000, // Close the alert after 3 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        });
    }

    useEffect(() => {
        setPageName("Parametre de couleur");
        setActiveItem("settings");
        fetch(`${ import.meta.env.VITE_API_URL }settings/`, {
            method: "GET",
            headers: { Authorization: "Bareer " + localStorage.getItem('jwt') }
        })
        .then( res => res.json())
        .then( res => {
            setMainColor(res.maincolor);
            setSecondaryColor(res.secondarycolor);
            setTextColor(res.textcolor)
            setLogoName(res.logo)
        })
        .catch(err => {
            let toastId = toast.dark(<SpinningToast />, { autoClose: false, hideProgressBar: true, theme: 'light' });
            toast.update(toastId, {
                render: err.message,
                type: 'error',
                theme: 'light',
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000, // Close the alert after 3 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        });
    }, []);

    return (
        <div 
            className={`app-container${navState ? ' app-shrink' : ''}`} >
            <div className='app'>
                <div className="fieldset">
                    <div className="legends">
                        <Link to='/settings' className="legend active-legend">
                            <ColorsIcon />
                            <div className="label">
                                Les Couleurs
                            </div>
                        </Link>
                        <Link to='/settings/general' className="legend">
                            <GeneralInfosIcon />
                            <div className="label">
                                Informations générale
                            </div>
                        </Link>
                        <Link to='/settings/coupons' className="legend">
                            <CouponIcon />
                            <div className="label">
                                Listes des coupons
                            </div>
                        </Link>
                    </div>
                    <div className="fieldset-main">
                        <div className="fieldset-main-header">
                            <h1 className='fieldset-title'>Choisir la couleur de votre tableau de bord</h1>
                        </div>
                        <form className="add-user-form flex" onSubmit={handleSubmit}>
                            <div className="col" style={{height: 'fit-content'}}>
                                <div className="form-group color-group" >
                                    <label htmlFor="bgColor">Choisir la couleur d'arriere plan</label>
                                    <div className="color-input">
                                        <span>Clickez ici</span>
                                        <input 
                                            type="color" 
                                            id='bgColor' 
                                            value={mainColor}
                                            onChange={e => setMainColor(e.target.value)} 
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group color-group" >
                                    <label htmlFor="bgColor">Choisir une couleur secondaire </label>
                                    <div className="color-input">
                                        <span>Clickez ici</span>
                                        <input 
                                            type="color" 
                                            id='bgColor' 
                                            value={secondaryColor}
                                            onChange={e => setSecondaryColor(e.target.value)} 
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group color-group">
                                    <label htmlFor="textColor">Choisir la couleur du text</label>
                                    <div className="color-input">
                                        <span>Clickez ici</span>
                                        <input 
                                            type="color" 
                                            id='textColor' 
                                            value={textColor}
                                            onChange={e => setTextColor(e.target.value)} 
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="img">Importer un logo</label>
                                    <button 
                                        type='button'
                                        className='fileButton'
                                        onClick={handleLogoButtonClick}
                                    >
                                        <span>{ logoName } <ImageImportIcon /></span>
                                        <img ref={logoImage} src={`${ import.meta.env.VITE_ASSETS }images/${logoName}`} alt="" />
                                    </button>
                                    <input 
                                        type="file"
                                        id='img'
                                        style={{ display: 'none' }} 
                                        ref={logoInput}
                                        onChange={handleLogoImport}/>
                                </div>
                                <div className="form-group form-submit">
                                    <input type="submit" value="Enregistrer" />
                                </div>
                            </div>
                        </form>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}