import { useEffect, useContext, Fragment } from "react"
import { Outlet, useNavigate } from 'react-router-dom';
import { AppContext } from "../../App";
import Login from "./Login";
import Navigation from "./NavigationBar";


export default function ProtectedRoute({ children }){
    const { isLoggedIn, setIsLoggedIn, setCurrentUser, callExist, isAnswered } = useContext(AppContext)

    async function checkAuth(){
        await fetch(`${import.meta.env.VITE_API_URL}auth/verifyToken`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
        })
        .then(res => res.json())
        .then(res => {
            if (res._id !== undefined) {
                setCurrentUser(res)
              setIsLoggedIn(true);
            }else{
              setIsLoggedIn(false);
            }
        })
        .catch(err => {
            console.error(err);
        })
    }
    
    useEffect(() => {
        checkAuth();
    }, [isLoggedIn]);

    return (
        isLoggedIn 
        ? <>
            <Navigation />
            <Outlet/>
        </> 
        : <Login />
    )
}