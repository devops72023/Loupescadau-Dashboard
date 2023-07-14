import { useContext, useEffect, useState, useMemo } from 'react'
import { AppContext } from '../../App'
import { Link } from 'react-router-dom'
import SpinningToast from '../global/SpinningToast';
import { toast } from 'react-toastify';
import { CancelIcon, ConfirmIcon, OrdersIcon, ProductsIcon, TrashIcon } from '../global/Icons';

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
                props.setOrders(res.products);
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
            <td>{ props.user.name }</td>
            <td>{ props.products }</td>
            <td>{ props.amount }</td>
            <td>{ props.status }</td>
            <td className='actions'>
                <div className="action-links">
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

export default function Orders (){
    const { navState, setPageName, setActiveItem } = useContext(AppContext)
    const [ orders, setOrders ] = useState([])
    const [ checkAll, setCheckAll ] = useState(false)
    const [ checkedIds, setCheckedIds ] = useState([])

    function handleCheckAll (event) {
        setCheckAll(event.target.checked);
    }  

    useEffect(() => {
        setPageName("Orders")
        setActiveItem("orders");
        fetch(`${ import.meta.env.VITE_API_URL }orders/`, {
            method: "GET",
            headers: { Authorization: "Bareer " + localStorage.getItem('jwt') }
        })
        .then(async res => {
            if (res.status === 200){
                const response = await res.json();
                setOrders(response);
            }
        })
    }, [])

    return (
        <div className={`app-container${navState ? ' app-shrink' : ''}`}>
            <div className="app">
            <div className="fieldset">
                    <div className="legends">
                        <Link to='/products' className="legend active-legend">
                            <OrdersIcon  />
                            <div className="label">
                                Listes des ordres
                            </div>
                        </Link>
                    </div>
                    <div className="fieldset-main">
                        <div className="fieldset-main-header">
                            <h2 className='font-bold text-light text-2xl'>Les ordres: </h2>
                        </div>
                        <div className="list-holder">
                            <table className="list ">
                                <thead>
                                    <tr>
                                        <th className='flex gap th-trash'>
                                            <input type="checkbox" name="all" id="all"  onChange={handleCheckAll} />
                                            <TrashIcon />
                                        </th>
                                        <th><div className="th-label">User</div></th>
                                        <th><div className="th-label">Products</div></th>
                                        <th><div className="th-label">Amount</div></th>
                                        <th><div className="th-label">Status</div></th>
                                        <th className='actions'><div className="th-label">Actions</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orders.map((item, index) => {
                                            const data = {
                                                checked: checkAll,
                                                ...item,
                                            };
                                            return (<Row key={index} setOrders={setOrders} setCheckedIds={setCheckedIds} checkedIds={checkedIds} {...data}  />)})
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