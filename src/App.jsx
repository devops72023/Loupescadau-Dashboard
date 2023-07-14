import React, { useState, createContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Manager } from 'socket.io-client';
// Importing Components 
import Navigation from './components/global/NavigationBar';
import Dashboard from './components/dashboard/Dashboard';
import UsersPage from './components/users/UsersPage';
import AddUserPage from './components/users/AddUserPage';
import Products from './components/Products/Products';
import AddProduct from './components/Products/AddProduct';
import Category from './components/Categories/Category';
import AddCategory from './components/Categories/AddCategory';
import Coupons from './components/Settings/Coupons';
import AddCoupon from './components/Settings/AddCoupon';
import Login from './components/global/Login';
import ProtectedRoute from './components/global/ProtectedRoute';
import Colors from './components/Settings/Colors';
import GeneralInfos from './components/Settings/general-infos';
import Call from './components/Call/Call';
import { AnimatePresence } from 'framer-motion';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/Profile/Profile';
import Orders from './components/Orders/Orders';

// const manager = new Manager(import.meta.env.SOCKET_SERVER)
const AppContext = createContext();

const AppProvider = (props) => {
  // const socket = manager.socket('/')
  // manager.open((err) => {
  //   if (err) {
  //     // an error has occurred
  //     console.log(err);
  //   } else {
  //     // the connection was successfully established
  //     console.log('connection established');
  //     console.log(socket)
  //   }
  // });
  const [pageName, setPageName] = useState('Dashboard');
  const [navState, setNavState] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(props.isLoggedIn);
  const [ callExist, setCallExist ] = useState(false)
  const [ isAnswered, setIsAnswered ] = useState(false)
  const [ socketId, setSocketId ] = useState('')
  const [ socketObj, setSocketObj ] = useState('')
  const [ sdpObj, setSdpObj ] = useState('')

  const state = {
    pageName: pageName,
    setPageName: setPageName,
    navState: navState,
    setNavState: setNavState,
    activeItem: activeItem,
    setActiveItem: setActiveItem,
    isLoggedIn: isLoggedIn,
    setIsLoggedIn: setIsLoggedIn,
    currentUser: currentUser,
    setCurrentUser: setCurrentUser,
    setSettingChanged: props.setSettingChanged,
    callExist: callExist,
    setCallExist: setCallExist,
    isAnswered: isAnswered,
    setIsAnswered: setIsAnswered,
    socketId: socketId,
    setSocketId: setSocketId,
    socketObj: socketObj,
    setSocketObj: setSocketObj,
    sdpObj: sdpObj,
    setSdpObj: setSdpObj,
    settings: props.settings,
    setSettings: props.setSettings
  }

  useEffect(() => {
    // setSocketObj(socket)
    // socket.on('connection-success', socket => {
    //   console.log(socket.socketId)
    //   setSocketId(socketId)
    // })
    // socket.on('sdp' , async (sdp) => {
    //   console.log(sdp);
    //   if(sdp.type === 'offer'){
    //     setCallExist(true);
    //     setSdpObj(sdp)
    //   }
    // });
  }, [sdpObj]);
  

  return (
    <AppContext.Provider value={state}>
      {props.children}
    </AppContext.Provider>
  )
}


function App() {

  const [loaded, setLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [ settingChanged, setSettingChanged ] = useState('');
  const [ settings, setSettings ] = useState();

  async function checkAuth(){

    await fetch(`${import.meta.env.VITE_API_URL}auth/verifyToken`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
    })
    .then(res => res.json())
    .then(res => {
        if (res._id !== undefined) {
          setIsLoggedIn(true);
          setLoaded(true);
        }else{
          setIsLoggedIn(false);
          setLoaded(true);
        }
    })
    .catch(err => {
        console.error(err);
        setIsLoggedIn(false);
        setLoaded(true);
    });
  }
  
  useEffect(() => {
    checkAuth();
    fetch(`${ import.meta.env.VITE_API_URL }settings/`, {
        method: "GET",
        headers: { Authorization: "Bareer " + localStorage.getItem('jwt') }
    })
    .then(async res => {
        if (res.status === 200){
            const response = await res.json();
            setSettings(response)
            document.documentElement.style.setProperty('--blue', response.maincolor);
            document.documentElement.style.setProperty('--light', response.textcolor);
            document.documentElement.style.setProperty('--light-blue', response.secondarycolor);
        }
    })
  }, [isLoggedIn, settingChanged]);
  
  if(!loaded) return null;

  return (
    <BrowserRouter>
      <AppProvider isLoggedIn={isLoggedIn} setSettingChanged={setSettingChanged} settings={settings} setSettings={setSettings} >
        {/* this header and the side navigation bar */}

          <ToastContainer />

          <Routes>
            <Route path="/login" element={ isLoggedIn ? <Navigate to='/' /> : <Login /> } />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/Profile" element={<Profile />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/add-user" element={<AddUserPage />} />
              <Route path="/users/update-user/:id" element={<AddUserPage />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/add-product" element={<AddProduct />} />
              <Route path="/products/update-product/:id" element={<AddProduct />} />
              <Route path="/categories" element={<Category />} />
              <Route path="/categories/add-category" element={<AddCategory />} />
              <Route path="/categories/update-category/:id" element={<AddCategory />} />
              <Route path="/settings" element={<Colors />} />
              <Route path="/settings/general" element={<GeneralInfos />} />
              <Route path="/settings/coupons" element={<Coupons />} />
              <Route path="/settings/coupons/add-coupon" element={<AddCoupon />} />
              <Route path="/settings/coupons/update-coupon/:id" element={<AddCoupon />} />
              <Route path="/call" element={<Call />} />
            </Route>

          </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
export { AppContext }