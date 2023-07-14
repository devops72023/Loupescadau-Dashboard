import React, { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../../App';
import { AddUserIcon, ImageImportIcon, TrashIcon, UsersIcon } from '../global/Icons';
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';

import '../../assets/styles/fieldset.css';
import '../../assets/styles/AddUserPage.css';

const SpinningToast = () => {
    return (
      <div className="spinning-toast">
        <div className="spinner" />
      </div>
    );
  };

export default function AddUserPage(props){
    const { id } = useParams();
    const { setPageName, setActiveItem, navState } = useContext(AppContext)
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [role, setRole] = useState({value: 'Choisir un role', name: 'choisir un role'});
    const [filename, setFilename] = useState('Choisir une image');
    const [file, setFile] = useState(null);
    const InputFileRef = useRef(null)
    const image = useRef(null)
    const roles = [
        {
            _id: 0,
            name: 'User'
        },
        {
            _id: 1,
            name: 'Admin'
        }
    ]

    const handleFileButtonClick = () =>{
        InputFileRef.current.click();
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        let endpoint = `${ import.meta.env.VITE_API_URL }users/${ id != undefined ? id : ''}`;
        let toastId = toast.dark(<SpinningToast />, { autoClose: false, hideProgressBar: true, theme: 'light' });
        if ( id != undefined ) {
            const formData = new FormData();
            
            formData.append('nom', nom);
            formData.append('email', email);
            formData.append('description', description);
            formData.append('role', role.value);
            formData.append('image', file)
            
            fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                },
                body: formData
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
            const formData = new FormData();
            
            formData.append('nom', nom);
            formData.append('email', email);
            formData.append('description', description);
            formData.append('role', role.value);
            formData.append('image', file)
            
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' +localStorage.getItem('jwt')
                },
                body: formData,
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
    const handleChange = (e) => {
        const text = e.target.options[e.target.selectedIndex].text;
        const value = e.target.value;
        setRole({value: value, name: text})
    }
    const handleFileImport = e => {
        setFile(e.target.files[0])
        setFilename(e.target.files[0].name)
        const reader = new FileReader();
        reader.onload = () => image.current.src = reader.result
        reader.readAsDataURL(e.target.files[0])
    }

    useEffect(()=>{
        setPageName("Users")
        setActiveItem("users");

        if( id != undefined ) {
            fetch(`${ import.meta.env.VITE_API_URL }users/${ id }`,{
                methods: "GET",
                headers: {
                    Authorization: "Bareer " + localStorage.getItem("jwt"),
                }
            })
            .then(res=>res.json())
            .then(res=>{
                setNom(res.name)
                setFilename(`${ res.image }`)
                setEmail(res.email)
                setDescription("hello world")
                setRole({_id: res.role, name: res.role == 1 ? 'Admin' : 'User' })
                res.image ? setFilename(res.image) : setFilename('Choisir une image')
            })
        }

    }, [id]);

    return (
        <div className={`app-container${navState ? ' app-shrink' : ''}`}>
            <div className='app'>
                <div className="fieldset">
                    <div className="legends">
                        <Link to='/users' className="legend">
                            <UsersIcon />
                            <div className="label">
                                Listes des utilisateurs
                            </div>
                        </Link>
                        <Link to='/users/add-user' className="legend active-legend">
                            <AddUserIcon />
                            <div className="label">
                                Ajouter un utilisateur
                            </div>
                        </Link>
                    </div>
                    <div className="fieldset-main">
                        <div className="fieldset-main-header">
                            <h1 className='fieldset-title'>Ajouter un utilisateur</h1>
                        </div>
                        <form className="add-user-form flex" onSubmit={handleSubmit}>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="nom">Nom</label>
                                    <input 
                                        type="text" 
                                        value={nom}
                                        onChange={e=>{setNom(e.target.value)}}
                                        placeholder='Entrer le nom' 
                                        required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Adresse email</label>
                                    <input 
                                        type="text" 
                                        value={email}
                                        onChange={e=>{setEmail(e.target.value)}}
                                        placeholder="Entrer l'adresse email" 
                                        required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="apropos">A propos</label>
                                    <input 
                                        type="text" 
                                        value={description}
                                        onChange={e=>{setDescription(e.target.value)}}
                                        placeholder="A propos de l'utilisateur" 
                                        required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="role">Role</label>
                                    <select name="role" id="role" value={role._id} onChange={handleChange} required>
                                        <option value={ role._id }>{ role.name }</option>
                                        {
                                            roles.map(item => {
                                                console.log(item, role)
                                                return item._id != role._id ? <option key={item._id} value={item._id}>{item.name}</option> : ''
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="img">Image</label>
                                    <button 
                                        type='button'
                                        className='fileButton'
                                        onClick={handleFileButtonClick}
                                    >
                                        <span>{ filename } <ImageImportIcon /></span>
                                        <img ref={image} src={`${import.meta.env.VITE_ASSETS}Profile-pictures/${filename}`} alt="" />
                                    </button>
                                    
                                    <input 
                                        type="file"
                                        name='file'
                                        id='img'
                                        style={{ display: 'none' }} 
                                        ref={InputFileRef}
                                        onChange={handleFileImport}
                                        />
                                </div>
                                
                                <div className="form-group form-submit">
                                    {
                                        id!=undefined 
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