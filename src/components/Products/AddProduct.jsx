import React, { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../../App';
import { ProductsIcon, PlusIcon, ImageImportIcon } from '../global/Icons';
import { Link, useParams } from 'react-router-dom'


import '../../assets/styles/fieldset.css';
import '../../assets/styles/AddUserPage.css';
import { toast } from 'react-toastify';
import SpinningToast from '../global/SpinningToast';

export default function AddProduct(props){
    const { setPageName, setActiveItem, navState } = useContext(AppContext)
    const { id } = useParams()
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [prix, setPrix] = useState('');
    const [categorie, setCategorie] = useState({ _id: "Choisir une categorie", name: "Choisir une categorie" });
    const [ categories, setCategories ] = useState([])
    const [quantite, setQuantite] = useState('');
    const [solde, setSolde] = useState(''); 
    const [filename, setFilename] = useState('Choisir une image');
    const [file, setFile] = useState(null);
    const InputFileRef = useRef(null)
    const image = useRef(null)

    const handleFileButtonClick = () =>{
        InputFileRef.current.click();
    }
    const handleFileImport = e => {
        setFilename(e.target.files[0].name)
        setFile(e.target.files[0])
        const reader = new FileReader();
        reader.onload = () => image.current.src = reader.result
        reader.readAsDataURL(e.target.files[0])
    }
    const handleChange = (e) => {
        setCategorie({_id: e.target.value, name: e.target.options[e.target.selectedIndex].textContent})
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        let endpoint = `${ import.meta.env.VITE_API_URL }products/${ id != undefined ? id : ''}`;
        let toastId = toast.dark(<SpinningToast />, { autoClose: false, hideProgressBar: true, theme: 'light' });
        if ( id != undefined ) {
            const formData = new FormData();
            
            formData.append('title', titre);
            formData.append('description', description);
            formData.append('price', prix);
            formData.append('category', categorie._id);
            formData.append('quantity', quantite);
            formData.append('sold', solde);
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
            
            formData.append('title', titre);
            formData.append('description', description);
            formData.append('price', prix);
            formData.append('category', categorie._id);
            formData.append('quantity', quantite);
            formData.append('sold', solde);
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

    useEffect(() => {
        setPageName("Ajouter un produit")
        setActiveItem("products");
        if( id != undefined ) {
            fetch(`${ import.meta.env.VITE_API_URL }products/${ id }`,{
                methods: "GET",
                headers: {
                    Authorization: "Bareer " + localStorage.getItem("jwt"),
                }
            })
            .then(res=>res.json())
            .then(res=>{
                const prod = res.product
                console.log(prod)
                setTitre(prod.title)
                setDescription(prod.description)
                setPrix(prod.price)
                setQuantite(prod.quantity)
                setSolde(prod.sold)
                setFilename(prod.photo)
                setCategorie(prod.category)
            })
            
        }
        // get the categories
        fetch(`${ import.meta.env.VITE_API_URL }categories`,{
            methods: "GET",
            headers: {
                Authorization: "Bareer " + localStorage.getItem("jwt"),
            }
        })
        .then(res=>res.json())
        .then(res=>{
            if(categorie._id == undefined) setCategorie(res[0])
            setCategories(res)
        })

    }, [id]);
    
    return (
        <div className={`app-container${navState ? ' app-shrink' : ''}`}>
            <div className='app'>
                <div className="fieldset">
                    <div className="legends">
                        <Link to='/products' className="legend">
                            <ProductsIcon />
                            <div className="label">
                                Listes des produit
                            </div>
                        </Link>
                        <Link to='' className="legend active-legend">
                            <PlusIcon />
                            <div className="label">
                                { id!=undefined ? 'Modifier un produit' : 'Ajouter un produit' }
                            </div>
                        </Link>
                    </div>
                    <div className="fieldset-main">
                        <div className="fieldset-main-header">
                            <h1 className='fieldset-title'>
                                { id!=undefined ? 'Modifier un produit' : 'Ajouter un produit' }
                            </h1>
                        </div>
                        <form className="add-user-form flex" onSubmit={handleSubmit}>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="titre">Titre</label>
                                    <input 
                                        type="text" 
                                        value={titre}
                                        onChange={e=>{setTitre(e.target.value)}}
                                        placeholder='Entrer le titre' 
                                        required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="desc">Description</label>
                                    <textarea 
                                        id='desc' 
                                        value={description}
                                        onChange={e=>{setDescription(e.target.value)}}
                                        placeholder="Entrer une description" 
                                        required></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="prix">Prix</label>
                                    <input 
                                        type="number" 
                                        value={prix}
                                        onChange={e=>{setPrix(e.target.value)}}
                                        id='prix' 
                                        placeholder="Entrer un prix" 
                                        required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="categorie">Categorie</label>
                                    <select name="categorie" id="categorie" defaultValue={categorie._id} onChange={handleChange} required>
                                        <option value={ categorie._id }>{ categorie.name }</option>
                                        {
                                            categories.map(item => {
                                                return item._id != categorie._id ? <option key={item._id} value={item._id}>{item.name}</option> : ''
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-group">
                                    <label htmlFor="quantite">Quantite</label>
                                    <input 
                                        type="text" 
                                        value={quantite}
                                        onChange={e=>{setQuantite(e.target.value)}}
                                        id='quantite' 
                                        placeholder="Entre la quntite" 
                                        required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="solde">Solde</label>
                                    <input 
                                        type="number"
                                        value={solde}
                                        onChange={e=>{setSolde(e.target.value)}}
                                        id='solde' 
                                        placeholder="Entrer le solde" 
                                        required/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="img">Image</label>
                                    <button 
                                        type='button'
                                        className='fileButton'
                                        onClick={handleFileButtonClick}
                                    >
                                        <span>{ filename } <ImageImportIcon /></span>
                                        <img ref={image} src={`${import.meta.env.VITE_ASSETS}Products-images/${filename}`} alt="" />
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