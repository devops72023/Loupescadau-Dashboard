import React, { useState, useContext, useEffect } from 'react';
import { Howl } from 'howler';

import logo from '/Assets/images/logo.png';
import { Link, useLocation } from 'react-router-dom'
import callRing from '/Assets/audios/call-ring.mp3'
import {  ProfileIcon, CategoryIcon, DashboardIcon, LogoutIcon, ProductsIcon, SettingIcon, UsersIcon, PhoneIcon, OrdersIcon} from './Icons';

import '/src/assets/styles/Navigation.css'
import { AppContext } from '../../App';


const Navigation = (props) => {
    const location = useLocation();
    const [btnState, setBtnState] = useState(false);
    const {pageName, currentUser, activeItem, setNavState, setIsLoggedIn, callExist, isAnswered } = useContext(AppContext);

    
    const menuBtnClick = () => {
        setBtnState(prv => !prv);
    }

    if (location.pathname == '/login') return null;
    const handleSignOut = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    }

    useEffect(() => {
        setNavState(btnState)
    }, [btnState]);

    return (
        <div className="container">
            <header className="header">
                {
                    callExist 
                    ? !isAnswered 
                        ? <audio src={callRing} autoPlay loop className="hidden"></audio> 
                        : ''
                    : ''
                }
                <button 
                    className={!btnState ? 'menu-btn' : 'menu-btn close-menu-btn'} 
                    onClick={menuBtnClick}>
                        <span></span>
                </button>
                <audio src={callRing} autoPlay class=""></audio> 
                <Link to='/' className="header-logo">
                    <img src={ logo } alt="Louoescadau log" />
                </Link>
                <h3 className="page-title">
                    <span className='circle'></span>
                    { pageName }
                </h3>
                <div className={`call-button ${ callExist ? 'call-exist' : ''}`}>
                    <Link to='/call' className="profile-link flex align-center gap">
                        <PhoneIcon />
                    </Link>
                </div>
                <div className="profile-button">
                    <Link to='/Profile' className="profile-link flex align-center gap">
                        {/* <ProfileIcon /> */}
                        <img src={ `${import.meta.env.VITE_ASSETS}Profile-pictures/${ currentUser.image }` } alt={ currentUser.image } className='header-profile-img' />
                    </Link>
                </div>
            </header>
            <nav className={!btnState ? 'nav-closed' : ''}>     
                <Link to='/dashboard' className={`navigation-item dashboard-btn ${activeItem == 'dashboard' ? 'active-item' : '' }`}>
                    <DashboardIcon />
                    <h3 >Dashboard</h3>
                </Link> 
                <Link to='/orders' className={`navigation-item orders-btn ${activeItem == 'orders' ? 'active-item' : '' }`}>
                    <OrdersIcon />
                    <h3 >Ordres</h3>
                </Link>
                <Link to='/categories' className={`navigation-item category-btn ${activeItem == 'category' ? 'active-item' : '' }`}>
                    <CategoryIcon />
                    <h3 >Catégories</h3>
                </Link> 
                <Link to='/products' className={`navigation-item products-btn ${activeItem == 'products' ? 'active-item' : '' }`}>
                    <ProductsIcon />
                    <h3 >Produits</h3>
                </Link> 
                <Link to='/users' className={`navigation-item users-btn ${activeItem == 'users' ? 'active-item' : '' }`}>
                    <UsersIcon />
                    <h3 >Utilisateurs</h3>
                </Link> 
                <Link to='/settings' className={`navigation-item settings-btn ${activeItem == 'settings' ? 'active-item' : '' }`}>
                    <SettingIcon />
                    <h3 >Paramètres</h3>
                </Link>
                
                <Link onClick={handleSignOut} className="navigation-item logout-btn">
                    <LogoutIcon />
                    <h3 >Déconnexion</h3>
                </Link>
            </nav>
        </div>
    )
}

export default Navigation;