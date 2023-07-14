import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AppContext } from '../../App';
import { PlusIcon, EditIcon, CategoryIcon, TrashIcon, ConfirmIcon, CancelIcon } from '../global/Icons';
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
        fetch(`${ import.meta.env.VITE_API_URL }categories/${props._id}`,{
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            }
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            props.setCategories(res.categories);
            toast.update(toastId, {
                render: 'L\'utilisateur été suprimé avec succès!',
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
            <td><img src={`${import.meta.env.VITE_ASSETS}Category-images/${ props.image }`} alt="" /></td>
            <td>{ props.name }</td>
            <td>{ props.title }</td>
            <td className='one-line'>{ props.description }</td>
            <td className='actions'>
                <div className="action-links">
                    <Link to={`update-category/${props._id}`}>
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

export default function Category(props){
    const { setPageName, setActiveItem, navState } = useContext(AppContext)
    const [categories, setCategories] = useState([])
    const [ checkAll, setCheckAll ] = useState(false)
    const [ checkedIds, setCheckedIds ] = useState([])
    const [isMounted, setIsMounted] = useState(false);
    
    
    function handleCheckAll (event) {
        setCheckAll(event.target.checked);
    }  

    useEffect(()=>{
        setIsMounted(true);
        setPageName("Category");
        setActiveItem("category");
        
        fetch(`${ import.meta.env.VITE_API_URL }categories/`, {
            method: "GET",
            headers: { Authorization: "Bareer " + localStorage.getItem('jwt') }
        })
        .then(async res => {
            if (res.status === 200){
                const response = await res.json();
                console.log(response)
                setCategories(response);
            }
        })
        return () => { setIsMounted(false); }
    }, []);

    return (
        <div className={`app-container${navState ? ' app-shrink' : ''} ${isMounted ? ' animateMounting' : ' animateUnmounting'}`}>
            <div className='app'>
                <div className="fieldset">
                    <div className="legends">
                        <Link to='/categories' className="legend active-legend">
                            <CategoryIcon />
                            <div className="label">
                                Listes des categories
                            </div>
                        </Link>
                        <Link to='add-category' className="legend">
                            <PlusIcon />
                            <div className="label">
                                Ajouter une categorie
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
                                        <th><div className="th-label">Image </div></th>
                                        <th><div className="th-label">Nom </div></th>
                                        <th><div className="th-label">Titre </div></th>
                                        <th><div className="th-label">Description </div></th>
                                        <th><div className="th-label">Actions</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                        categories.map((item, index) => {
                                            const data = {
                                                checked: checkAll,
                                                ...item,
                                            };
                                            return (<Row key={index} setCategories={setCategories} setCheckedIds={setCheckedIds} checkedIds={checkedIds} {...data}  />)})
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