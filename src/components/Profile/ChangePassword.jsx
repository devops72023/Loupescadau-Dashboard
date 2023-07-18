import { toast } from "react-toastify"
import SpinningToast from "../global/SpinningToast"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../App"

export default function ChangePassword({ file }){
    const { currentUser, setCurrentUser } = useContext(AppContext)
    const [ cpwd , setCpwd ] = useState('')
    const [ npwd , setNpwd ] = useState('')
    const [ rpwd, setRpwd ] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        let endpoint = `${ import.meta.env.VITE_API_URL }users/current-user/change-password/${ currentUser._id}`;
        let toastId = toast.dark(<SpinningToast />, { autoClose: false, hideProgressBar: true, theme: 'light' });
        const formData = {
            'cpwd': cpwd,
            'npwd': npwd,
            'rpwd': rpwd
        };
        
        fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then( res => {
            if (res.incorrect_password) {
                toast.update(toastId, {
                    render: "Mot de passe actuel est incorrecte!",
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
            }else if(res.unmatch_password){
                toast.update(toastId, {
                    render: "Les deux mots de passe ne sont pas identiques!",
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
    }

    return (
        <div className="flex w-full rounded-xl bg-colors-light shadow-xl relative px-5 py-7 pt-[27px] min-w-[330px]">
            <div className="px-5 py-2 shadow-md rounded-3xl bg-colors-blueAccent text-colors-light absolute left-7  -top-[20px] " >
                Changer le mot de passe
            </div>
            <form 
                className="flex flex-col gap-3 w-full mt-6"
                onSubmit={handleSubmit}>
                <div className="flex column gap-3 align-center w-full">
                    <div className="form-group">
                        <label htmlFor="cpwd" className="ml-2" style={{color: "var(--blue)"}}>Mot de passe actue</label>
                        <input 
                            className="!text-colors-lightblue !text-[12px]"
                            type="password"
                            placeholder='Current password' 
                            value={cpwd}
                            onChange={e => setCpwd(e.target.value)}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cpwd" className="ml-2" style={{color: "var(--blue)"}}>Nouveau mot de passe</label>
                        <input 
                            className="!text-colors-lightblue !text-[12px]"
                            type="password"
                            placeholder='New password' 
                            value={npwd}
                            onChange={e => setNpwd(e.target.value)}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cpwd" className="ml-2" style={{color: "var(--blue)"}}>Répéter le nouveau mot de passe</label>
                        <input 
                            className="!text-colors-lightblue !text-[12px]"
                            type="password"
                            placeholder='Reapeat new password' 
                            value={rpwd}
                            onChange={e => setRpwd(e.target.value)}
                            required />
                    </div>
                    <div className="form-group form-submit mt-4">
                        <input type="submit" value="Modifier" />
                    </div>
                </div>
            </form>
        </div>
    )
}