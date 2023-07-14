import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AppContext } from '../../App';
import { EditIcon, TrashIcon, ColorsIcon, GeneralInfosIcon, CouponIcon, ConfirmIcon, CancelIcon } from '../global/Icons';
import { Link } from 'react-router-dom'


import '../../assets/styles/fieldset.css';
import '../../assets/styles/Coupons.css'

import { toast } from 'react-toastify';
import SpinningToast from '../global/SpinningToast';
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
        fetch(`${ import.meta.env.VITE_API_URL }coupons/${props._id}`,{
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('jwt'),
            }
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            props.setCoupons(res.coupons);
            toast.update(toastId, {
                render: 'Le coupon été suprimé avec succès!',
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
            <td>{ props.label }</td>
            <td>{ props.code }</td>
            <td>{ props.discount }</td>
            <td className='actions'>
                <div className="action-links">
                    <Link to={`update-coupon/${props._id}`}>
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

export default function Coupons(props){
    const { setPageName, setActiveItem, navState } = useContext(AppContext)
    const [isMounted, setIsMounted] = useState(false);
    const [coupons, setCoupons] = useState([])
    const [ checkAll, setCheckAll ] = useState(false)
    const [ checkedIds, setCheckedIds ] = useState([])

    function handleCheckAll (event) {
        setCheckAll(event.target.checked);
    }    
    
    useEffect(()=>{
        setIsMounted(true);
        setPageName("Settings")
        setActiveItem("settings");
        fetch(`${ import.meta.env.VITE_API_URL }coupons/`, {
            method: "GET",
            headers: { Authorization: "Bareer " + localStorage.getItem('jwt') }
        })
        .then(async res => {
            if (res.status === 200){
                const response = await res.json();

                setCoupons(response);
            }
        })
    }, []);

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
                            <form action="/" style={{marginLeft: 'unset'}}>
                                <input type="search" placeholder='Entrer un nom...' />
                                <button>Chercher</button>
                            </form>
                            <Link to='/settings/coupons/add-coupon' className="create-coupon">
                                Creer un coupon
                            </Link>
                        </div>
                        <div className="list-holder">
                            <table className="list ">
                                <thead>
                                    <tr>
                                        <th className='flex gap th-trash'>
                                            <input type="checkbox" name="all" id="all" onChange={handleCheckAll}/>
                                            <TrashIcon />
                                        </th>
                                        <th><div className="th-label">Label</div></th>
                                        <th><div className="th-label">Code</div></th>
                                        <th><div className="th-label">Remise</div></th>
                                        <th className='actions'><div className="th-label">Actions</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        coupons.map((item, index) => {
                                            const data = {
                                                checked: checkAll,
                                                ...item,
                                            };
                                            return (<Row key={index} setCoupons={setCoupons} setCheckedIds={setCheckedIds} checkedIds={checkedIds} {...data}  />)})
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