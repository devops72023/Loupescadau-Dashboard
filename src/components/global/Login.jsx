import React, { useState, useContext, useEffect } from 'react';
import logo from '/Assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';

import '../../assets/styles/login.css'
import SpinningToast from './SpinningToast';
import { toast } from 'react-toastify';
import { EyeIcon, EyeSlashIcon } from './Icons';

export default function Login(props){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { isLoggedIn, setIsLoggedIn } = useContext(AppContext)
    const [ isVisible, setIsVisible ] = useState(false)
    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        let toastId = toast.dark(<SpinningToast />, { autoClose: false, hideProgressBar: true, theme: 'light' });
        fetch(`${ import.meta.env.VITE_API_URL }auth/signin`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: username,
                password: password
            })
        })
        .then(res => {
            return res.json();
        })
        .then(res=>{
            if(res.type){
                toast.update(toastId, {
                    render: res.message,
                    type: 'error',
                    theme: 'light',
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000, // Close the alert after 3 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
            if(res.accessToken != undefined ){
                localStorage.setItem('jwt', res.accessToken);
                setIsLoggedIn(true)
                toast.update(toastId, {
                    render: "Bienvenue de nouveau !",
                    type: 'error',
                    theme: 'light',
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 3000, // Close the alert after 3 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        }).catch(err => {
            console.log(err.message)
        });
    }

    return (
        <div className="login-container">
            <div className="logo">
                <img src={ logo } />
            </div>
            <h2>ADMINISTRATEUR</h2>
            <h3>CONNEXION</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input 
                        type="email"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={e=>setUsername(e.target.value)} />
                </div>
                <div className="form-group relative">
                    <label htmlFor="password">Mot de passe</label>
                    <input 
                        type={isVisible ? "text" : "password"}
                        placeholder="Mot de passe"
                        autoComplete=''
                        value={password}
                        onChange={e=>setPassword(e.target.value)} />
                    
                    <div 
                        onClick={()=>setIsVisible(!isVisible)}
                        className="absolute bottom-[8px] right-[8px] px-[7px] w-[35px] h-[35px] shadow-md rounded-full bg-colors-lightblue fill-colors-light flex justify-center items-center cursor-pointer hover:bg-colors-blueAccent -scale-10">
                        {
                            isVisible
                            ? (<EyeSlashIcon />)
                            : (<EyeIcon />)
                        }
                    </div>
                    
                </div>
                <div className="form-group form-submit">
                    <input type="submit" value="CONNEXION" />
                    {/* <Link to="#">Mot de passe oublier?</Link> */}
                </div>
            </form>
        </div>
    )
}