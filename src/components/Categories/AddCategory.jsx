import React, { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../../App';
import { PlusIcon, CategoryIcon, ImageImportIcon } from '../global/Icons';
import { Link, useParams } from 'react-router-dom'


import '../../assets/styles/fieldset.css';
import '../../assets/styles/AddUserPage.css';
import { toast } from 'react-toastify';


const SpinningToast = () => {
    return (
      <div className="spinning-toast">
        <div className="spinner" />
      </div>
    );
  };

export default function AddProduct(props){
    const { setPageName, setActiveItem, navState } = useContext(AppContext)
    const [name, setName] = useState('');
    const [descTitle, setDescTitle] = useState('');
    const [description, setDescription] = useState('');
    const [filename, setFilename] = useState('Choisir une image');
    const [file, setFile] = useState(null);
    const InputFileRef = useRef(null)
    const image = useRef(null);
    const {id} = useParams()

    const handleSubmit = (e) => {
        e.preventDefault();
        let endpoint = `${ import.meta.env.VITE_API_URL }categories/${ id != undefined ? id : ''}`;
        let toastId = toast.dark(<SpinningToast />, { autoClose: false, hideProgressBar: true, theme: 'light' });
        if ( id != undefined ) {
            const formData = new FormData();
            
            formData.append('name', name);
            formData.append('descTitle', descTitle);
            formData.append('description', description);
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
                if(res.type === 'error'){
                    toast.update(toastId, {
                        render: res.message,
                        type: 'warn',
                        theme: 'light',
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000, // Close the alert after 3 seconds
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
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
            
            formData.append('name', name);
            formData.append('descTitle', descTitle);
            formData.append('description', description);
            formData.append('image', file)
            
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                },
                body: formData,
            })
            .then(res => res.json())
            .then( res => {

                if(res.type == 'error'){
                    toast.update(toastId, {
                        render: res.message,
                        type: 'warning',
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
    const handleFileImport = e => {
        setFilename(e.target.files[0].name)
        setFile(e.target.files[0])
        const reader = new FileReader();
        reader.onload = () => image.current.src = reader.result
        reader.readAsDataURL(e.target.files[0])
    }
    useEffect(() => {
        setPageName("Ajouter une categorie");
        setActiveItem("category");
        if( id != undefined ) {
            fetch(`${ import.meta.env.VITE_API_URL }categories/${ id }`,{
                methods: "GET",
                headers: {
                    Authorization: "Bareer " + localStorage.getItem("jwt"),
                }
            })
            .then(res=>res.json())
            .then(res=>{
                const category = res.category
                
                setName(category.name)
                setDescTitle(category.title)
                setDescription(category.description)
                setFilename(category.image)
            })
            
        }

    }, []);

    return (
        <div className={`app-container${navState ? ' app-shrink' : ''}`}>
            <div className='app'>
                <div className="fieldset">
                    <div className="legends">
                        <Link to='/categories' className="legend">
                            <CategoryIcon />
                            <div className="label">
                                Listes des categories
                            </div>
                        </Link>
                        <Link to='' className="legend active-legend">
                            <PlusIcon />
                            <div className="label">
                                { id != undefined ? 'Modifier une categorie' : 'Ajouter une categorie'}
                            </div>
                        </Link>
                    </div>
                    <div className="fieldset-main">
                        <div className="fieldset-main-header">
                            <h1 className='fieldset-title'>
                                { id != undefined ? 'Modifier une categorie' : 'Ajouter une categorie'}
                            </h1>
                        </div>
                        <form className="add-user-form flex" onSubmit={handleSubmit}>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="nom">Nom du catégorie</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={e=>setName(e.target.value)}
                                        id='nom' 
                                        placeholder="Entrer nom du catégorie" 
                                        required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nom">Titre du description</label>
                                    <input 
                                        type='text'
                                        value={descTitle}
                                        onChange={e=>setDescTitle(e.target.value)}
                                        id='nom' 
                                        placeholder="Entrer nom du catégorie" 
                                        required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nom">Description</label>
                                    <textarea 
                                        value={description}
                                        onChange={e=>setDescription(e.target.value)}
                                        id='nom' 
                                        placeholder="Entrer nom du catégorie" 
                                        required></textarea>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="img">Image</label>
                                    <button 
                                        type='button'
                                        className='fileButton'
                                        onClick={() => {InputFileRef.current.click();}}
                                    >
                                        <span>{ filename } <ImageImportIcon /></span>
                                        <img ref={image} src={`${import.meta.env.VITE_ASSETS}Category-images/${ filename }`} alt="" />
                                    </button>
                                    <input 
                                        type="file"
                                        id='img'
                                        style={{ display: 'none' }} 
                                        ref={InputFileRef}
                                        onChange={handleFileImport}/>
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