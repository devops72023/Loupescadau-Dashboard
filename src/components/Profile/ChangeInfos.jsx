import { toast } from "react-toastify"
import SpinningToast from "../global/SpinningToast"
import { useContext, useState } from "react"
import { AppContext } from "../../App"

export default function ChangeInfos(){
    const { currentUser, setCurrentUser } = useContext(AppContext)
    
    const [ name , setName ] = useState('fg')
    const [ email , setEmail ] = useState('dfg')
    const [ about, setAbout ] = useState('dfg')

    const handleSubmit = (e) => {
        e.preventDefault();
        let endpoint = `${ import.meta.env.VITE_API_URL }users/current-user/${ currentUser._id}`;
        let toastId = toast.dark(<SpinningToast />, { autoClose: false, hideProgressBar: true, theme: 'light' });
        const formData = new FormData();
        console.log(name)
        formData.append('name', name);
        formData.append('email', email);
        formData.append('about', about);
        formData.append('image', file)
        fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: formData
        })
        .then(res => res.json())
        .then( res => {
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

    useEffect(() => {
        setName(currentUser.name)
        setEmail(currentUser.email)
        setAbout(currentUser.about)
    }, [currentUser])

    return (
        <div className="flex w-full rounded-xl bg-colors-light shadow-xl relative px-5 py-7 pt-[27px] min-w-[330px]">
            <div className="px-3 py-2 shadow-md rounded-md bg-colors-light absolute left-7  -top-[20px] " >
                Modifier les information
            </div>
            <form 
                className="flex flex-col gap-2 w-full"
                onSubmit={handleSubmit}>
                <div className="flex column gap-3 align-center w-full">
                    <div className="form-group">
                        <label htmlFor="nom" className="ml-2" style={{color: "var(--blue)"}}>Nom</label>
                        <input 
                            className="font-light !text-colors-lightblue"
                            type="text" 
                            placeholder='Entrer le nom' 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email" className="ml-2" style={{color: "var(--blue)"}}>Adresse email</label>
                        <input 
                            className="font-light !text-colors-lightblue"
                            type="email" 
                            placeholder="Entrer l'adresse email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required/>
                    </div>
                </div>
                <div className="flex column gap-3 justify-between align-center w-full" >
                    <div className="form-group">
                        <label htmlFor="apropos" className="ml-2" style={{color: "var(--blue)"}}>A propos</label>
                        <textarea 
                            className="font-light !text-colors-lightblue"
                            placeholder="A propos de l'utilisateur" 
                            value={about}
                            onChange={e => setAbout(e.target.value)}
                            required></textarea>
                    </div>
                    <div className="form-group form-submit">
                        <input type="submit" value="Modifier" />
                    </div>
                </div>
            </form>
        </div>
    )
}