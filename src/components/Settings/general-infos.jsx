import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../App';
import { ColorsIcon, CouponIcon, GeneralInfosIcon } from '../global/Icons';
import { Link } from 'react-router-dom'

import '../../assets/styles/fieldset.css';
import '../../assets/styles/general-infos.css';
import PositionPicker from './PositionPicker';
import { toast } from 'react-toastify';
import SpinningToast from '../global/SpinningToast';
import { motion } from 'framer-motion';


export default function GeneralInfos(props){
    const { setPageName, setActiveItem, navState } = useContext(AppContext)
    const [ phone , setPhone ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ adresse, setAdresse ] = useState('')
    const [ position, setPosition ] = useState({lat: 0, lng: 0})
    var lat = undefined
    var lng = undefined

    function handlePositionSelected(position) {
        // console.log('Selected position:', position.lat(), position.lng());
        lat = position.lat();
        lng = position.lng();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        console.log(phone, email, adresse);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('adresse', adresse)
        formData.append('latitude', lat)
        formData.append('longitude', lng)
        
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
            setPhone(res.phone);
            setEmail(res.email);
            setAdresse(res.adresse);
            setPosition({lat : res.latitude, lng : res.longitude});
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
        setPageName("informations générale");
        setActiveItem("settings");

        fetch(`${ import.meta.env.VITE_API_URL }settings/`, {
            method: "GET",
            headers: { Authorization: "Bareer " + localStorage.getItem('jwt') }
        })
        .then( res => res.json())
        .then( res => {
            setPhone(res.phone);
            setEmail(res.email);
            setAdresse(res.adresse);
            setPosition({lat : res.latitude, lng : res.longitude});
        })
        .catch(err => {
            console.log(err)
            let toastId = toast.dark(<SpinningToast />, { autoClose: false, hideProgressBar: true, theme: 'light' });
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
    }, []);

    return (
        <div 
            className={`app-container${navState ? ' app-shrink' : ''}`} >
            <div className='app'>
                <div className="fieldset">
                    <div className="legends">
                        <Link to='/settings' className="legend">
                            <ColorsIcon />
                            <div className="label">
                                Les Couleurs
                            </div>
                        </Link>
                        <Link to='/settings/general' className="legend active-legend">
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
                            <h1 className='fieldset-title'>Les informations générale de LouPescadau</h1>
                        </div>
                        <form className="general-infos-form" onSubmit={handleSubmit}>
                            <div className="col-container">
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="phone-number">Numéro du téléphone:</label>
                                        <input 
                                            type="text" id='phone-number'
                                            placeholder="Entre le numéro du téléphone" 
                                            value={phone}
                                            minLength={10}
                                            onChange={e => setPhone(e.target.value)}
                                            required/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Adresse email:</label>
                                        <input 
                                            type="email" id='email' 
                                            placeholder="Entrer l'adresse email" 
                                            value={email}
                                            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" 
                                            title="Veuillez entrer une adresse email valide"
                                            onChange={e => setEmail(e.target.value)}
                                            required/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="adresse">Adresse:</label>
                                        <input 
                                            type="text" id='adresse' 
                                            placeholder="Entrer l'adresse" 
                                            value={adresse}
                                            pattern=".{5,100}" 
                                            minLength="5" 
                                            maxLength="100" 
                                            title="Veuillez entrer une adresse valide (5-100 caractères)"
                                            onChange={e => setAdresse(e.target.value)}
                                            required/>
                                    </div>
                                </div><div className="col">
                                    <div className="form-group">
                                        <label htmlFor="phone-number">Localisation:</label>
                                        <PositionPicker onPositionSelected={handlePositionSelected} />
                                    </div>
                                </div>
                            </div>
                            <div className="col full-width">
                                <div className="form-group form-submit">
                                    <input type="submit" id='adresse' value="Enregistrer" required/>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}