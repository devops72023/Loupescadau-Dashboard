import React, { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../../App';
import { ColorsIcon , PlusIcon, GeneralInfosIcon, CouponIcon } from '../global/Icons';
import { Link, useParams } from 'react-router-dom'


import '../../assets/styles/fieldset.css';
import '../../assets/styles/AddUserPage.css';
import { toast } from 'react-toastify';
import SpinningToast from '../global/SpinningToast';


export default function AddCoupon(props){
    const { setPageName, setActiveItem, navState } = useContext(AppContext)
    const { id } = useParams()
    const [label, setLabel] = useState('');
    const [code, setCode] = useState('');
    const [remise, setRemise] = useState('');
    
    
    const handleSubmit = (e) => {
        e.preventDefault();
        let endpoint = `${ import.meta.env.VITE_API_URL }coupons/${ id != undefined ? id : ''}`;
        let toastId = toast.dark(<SpinningToast />, { autoClose: false, hideProgressBar: true, theme: 'light' });
        if ( id != undefined ) {
            
            fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                },
                body: JSON.stringify({
                    code: code,
                    label: label,
                    discount: remise
                })
            })
            .then(res => res.json())
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
        }else{
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                },
                body: JSON.stringify({
                    code: code,
                    label: label,
                    discount: remise
                })
            })
            .then(res => res.json())
            .then( res => {
                
                console.log(res)
                if ( res.error ) {
                    toast.update(toastId, {
                        render: "Une erreur s'est produite",
                        type: 'error',
                        theme: 'light',
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000, // Close the alert after 3 seconds
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    return;
                }
                toast.update(toastId, {
                    render: 'Nouveau utilisateur été ajouté avec succès!',
                    type: 'success',
                    theme: 'light',
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000, // Close the alert after 3 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            })
            .catch(err => {
                console.error(err);
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
    }
    useEffect(() => {
        setPageName('Creation du coupon');
        setActiveItem('settings');

        if( id != undefined ) {
            fetch(`${ import.meta.env.VITE_API_URL }coupons/${ id }`,{
                methods: "GET",
                headers: {
                    Authorization: "Bareer " + localStorage.getItem("jwt"),
                }
            })
            .then(res=>res.json())
            .then(res=>{
                setLabel(res.label)
                setCode(res.code)
                setRemise(res.discount)
            })
            
        }
    },[]);


    return (
        <div className={`app-container${navState ? ' app-shrink' : ''}`}>
            <div className='app'>
                <div className="fieldset">
                    <div className="legends">
                        <Link to='/settings' className="legend">
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
                        <Link to='/settings/coupons' className="legend active-legend">
                            <CouponIcon />
                            <div className="label">
                                Listes des coupons
                            </div>
                        </Link>
                    </div>
                    <div className="fieldset-main">
                        <div className="fieldset-main-header">
                            <h1 className='fieldset-title'>
                                { id!=undefined ? 'Modifier un coupon' : 'Ajouter un coupon' }
                            </h1>
                        </div>
                        <form className="add-user-form flex" onSubmit={handleSubmit}>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="label">Label</label>
                                    <input 
                                        type="text" 
                                        value={label}
                                        onChange={e=>{setLabel(e.target.value)}}
                                        placeholder='Entrer une label' 
                                        minLength={3}
                                        maxLength={30}
                                        pattern="[A-Za-z\s]+" title="Seules les lettres et les espaces sont autorisés" 
                                        required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="code">Code du coupon</label>
                                    <input 
                                        type="text" 
                                        value={code}
                                        onChange={e=>{setCode(e.target.value)}}
                                        id='code' 
                                        placeholder="Entrer un code"/>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="remise">Remise</label>
                                    <input 
                                        type="number" 
                                        value={remise}
                                        onChange={e=>{setRemise(e.target.value)}}
                                        id='remise' 
                                        placeholder="Entre le remise" 
                                        min={0}
                                        max={100}
                                        title='Seuls valeurs entre 0 et 100 sont autorisés'
                                        required/>
                                </div>
                                <div className="form-group form-submit">
                                    {
                                        id!==undefined
                                        ? <input type="submit" value="Modifier" />
                                        : <input type="submit" value="Ajouter" />
                                    }
                                </div>
                            </div>
                        </form>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}