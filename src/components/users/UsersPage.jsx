import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppContext } from '../../App';
import { AddUserIcon, EditIcon, TrashIcon, UsersIcon, ConfirmIcon, CancelIcon } from '../global/Icons';
import { Link } from 'react-router-dom'
import SpinningToast from '../global/SpinningToast';

import '../../assets/styles/fieldset.css';
import { toast } from 'react-toastify';

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
        fetch(`${ import.meta.env.VITE_API_URL }users/${props._id}`,{
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            }
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            props.setUsers(res.users);
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
                console.log(item);
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
            <td><input type="checkbox" name="one" id="one" value={props._id} checked={ checked ? 'checked' : '' } onChange={handleChange}/></td>
            <td><img src={ `${import.meta.env.VITE_ASSETS}Profile-pictures/${ props.image }` } alt={ props.image } /></td>
            <td>{ props.name }</td>
            <td className='one-line'>{ props.email }</td>
            <td className='one-line'>{ props.about }</td>
            <td>{ props.role == 1 ? "Admin" : "User" }</td>
            <td>{ props.history }</td>
            <td className='actions'>
                <div className="action-links">
                    <Link to={`update-user/${props._id}`}>
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

export default function UsersPage(props){
    const { setPageName, setActiveItem, navState } = useContext(AppContext)
    const [users, setUsers] = useState([])
    const [ checkAll, setCheckAll ] = useState(false)
    const [ checkedIds, setCheckedIds ] = useState([])

    function handleCheckAll (event) {
        setCheckAll(event.target.checked);
    }    
    
    useEffect(()=>{
        setPageName("Users")
        setActiveItem("users");
        fetch(`${ import.meta.env.VITE_API_URL }users/`, {
            method: "GET",
            headers: { Authorization: "Bareer " + localStorage.getItem('jwt') }
        })
        .then(async res => {
            if (res.status === 200){
                const response = await res.json();
                setUsers(response);
            }
        })
    }, []);

    return (
        <div className={`app-container ${navState ? ' app-shrink' : ''}`}>
            <div className='app'>
                <div className="fieldset">
                    <div className="legends">
                        <Link to='/users' className="legend active-legend">
                            <UsersIcon />
                            <div className="label">
                                Listes des utilisateurs
                            </div>
                        </Link>
                        <Link to='/users/add-user' className="legend">
                            <AddUserIcon />
                            <div className="label">
                                Ajouter un utilisateur
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
                            <table className="list">
                                <thead>
                                    <tr>
                                        <th className='flex gap th-trash'>
                                            <input type="checkbox" name="all" id="all" onChange={handleCheckAll}/>
                                            <TrashIcon />
                                        </th>
                                        <th>
                                            <div className="th-label">Image</div>
                                        </th>
                                        <th>
                                            <div className="th-label">Nom</div>
                                        </th>
                                        <th>
                                            <div className="th-label">Email</div>
                                        </th>
                                        <th>
                                            <div className="th-label">A-propos</div>
                                        </th>
                                        <th>
                                            <div className="th-label">Rôle</div>
                                        </th>
                                        <th>
                                            <div className="th-label">Historique</div>
                                        </th>
                                        <th>
                                            <div className="th-label">Actions</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map((item, index) => {
                                            const data = {
                                                checked: checkAll,
                                                ...item,
                                            };
                                            return (<Row key={index} setUsers={setUsers} setCheckedIds={setCheckedIds} checkedIds={checkedIds} {...data}  />)})
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