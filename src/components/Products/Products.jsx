import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AppContext } from '../../App';
import { PlusIcon, EditIcon, ProductsIcon, TrashIcon, ConfirmIcon, CancelIcon } from '../global/Icons';
import { Link } from 'react-router-dom'


import '../../assets/styles/fieldset.css';
import '../../assets/styles/Products.css'
import { toast } from 'react-toastify';

const SpinningToast = () => {
    return (
      <div className="spinning-toast">
        <div className="spinner" />
      </div>
    );
  };

const Row = (props) => {
    const [ checked, setChecked ] = useState(false);
    const [ trashClicked, setTrashClicked ] = useState(false);

    function handleChange(e){
        setChecked(!checked);
    }
    function cancelDeletion(){
        setTrashClicked(false);
    }
    function checkDeletion(){
        setTrashClicked(true);
    }
    function confirmDeletion(){
        let toastId = toast.dark(<SpinningToast />, { autoClose: false, hideProgressBar: true, theme: 'light' });
        fetch(`${ import.meta.env.VITE_API_URL }products/${props._id}`,{
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            }
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            if(!res.error){
                props.setProducts(res.products);
                toast.update(toastId, {
                    render: 'Le produit été suprimé avec succès!',
                    type: 'success',
                    theme: 'light',
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000, // Close the alert after 3 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
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
        })
    }
    useMemo(()=>setChecked(props.checked), [props.checked])
    useEffect(() => {
        if(checked){
            let exist = false;
            props.checkedIds.map(item => {
                if(item == props._id){
                    exist = true;
                }
            })
            if(!exist) props.setCheckedIds(prv => [props._id, ...prv]);
        }else{
            props.setCheckedIds(prv => {
                return prv.filter(item => item !== props._id)
            });
        }
    }, [checked])
    return (
        <tr>
            <td><input type="checkbox" name="one" id="one" checked={ checked ? 'checked' : '' } onChange={handleChange} /></td>
            <td><img src={ `${import.meta.env.VITE_ASSETS}Products-images/${ props.photo }` } alt="" /></td>
            <td>{ props.title }</td>
            <td className='one-line'>{ props.description }</td>
            <td>{ props.price }</td>
            <td>{ props.category.name }</td>
            <td>{ props.quantity }</td>
            <td>{ props.sold }</td>
            <td className='actions'>
                <div className="action-links">
                    <Link to={`update-product/${props._id}`}>
                        <EditIcon />
                    </Link>
                    {
                        trashClicked
                        ? <button className={`trash-btn ${trashClicked?'trash-check':''}`}><ConfirmIcon onClick={confirmDeletion} /> <CancelIcon onClick={cancelDeletion}/></button>
                        : <button className='trash-btn'><TrashIcon onClick={checkDeletion}/></button>
                    }
                </div>
            </td>
        </tr>
    )
}

export default function Products(props){
    const { setPageName, setActiveItem, navState } = useContext(AppContext)
    const [isMounted, setIsMounted] = useState(false);
    const [ products, setProducts ] = useState([]);
    const [ checkAll, setCheckAll ] = useState(false)
    const [ checkedIds, setCheckedIds ] = useState([])

    function handleCheckAll (event) {
        setCheckAll(event.target.checked);
    }   
    
    useEffect(()=>{
        setIsMounted(true);
        setPageName("Products")
        setActiveItem("products");
        fetch(`${ import.meta.env.VITE_API_URL }products/`, {
            method: "GET",
            headers: { Authorization: "Bareer " + localStorage.getItem('jwt') }
        })
        .then(async res => {
            if (res.status === 200){
                const response = await res.json();
                setProducts(response);
            }
        })
        return () => { setIsMounted(false); }
    }, []);

    return (
        <div className={`app-container${navState ? ' app-shrink' : ''}`}>
            <div className='app'>
                <div className="fieldset">
                    <div className="legends">
                        <Link to='/products' className="legend active-legend">
                            <ProductsIcon />
                            <div className="label">
                                Listes des produit
                            </div>
                        </Link>
                        <Link to='/products/add-product' className="legend">
                            <PlusIcon />
                            <div className="label">
                                Ajouter un produit
                            </div>
                        </Link>
                    </div>
                    <div className="fieldset-main">
                        <div className="fieldset-main-header">
                            <form action="/" >
                                <input type="search" placeholder='Entrer un nom...' />
                                <button>Chercher</button>
                            </form>
                        </div>
                        <div className="list-holder">
                            <table className="list ">
                                <thead>
                                    <tr>
                                        <th className='flex gap th-trash'>
                                            <input type="checkbox" name="all" id="all"  onChange={handleCheckAll} />
                                            <TrashIcon />
                                        </th>
                                        <th><div className="th-label">image</div></th>
                                        <th><div className="th-label">Titre</div></th>
                                        <th><div className="th-label">Description</div></th>
                                        <th><div className="th-label">Prix</div></th>
                                        <th><div className="th-label">Categorie</div></th>
                                        <th><div className="th-label">Quantité</div></th>
                                        <th><div className="th-label">Solde</div></th>
                                        <th className='actions'><div className="th-label">Actions</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        products.map((item, index) => {
                                            const data = {
                                                checked: checkAll,
                                                ...item,
                                            };
                                            return (<Row key={index} setProducts={setProducts} setCheckedIds={setCheckedIds} checkedIds={checkedIds} {...data}  />)})
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}