import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../../App"
import { EditIcon } from "../global/Icons"
import { toast } from "react-toastify"
import SpinningToast from "../global/SpinningToast"
import ChangeInfos from "./ChangeInfos"

export default function Profile(){
    const { setPageName, navState, currentUser, setCurrentUser } = useContext(AppContext)
    const [ file, setFile ] = useState(null)
    const fileRef = useRef()
    const imgRef = useRef()

    const handleFileButtonClick = () => {
        fileRef.current.click()
    }
    const handleFileImport = (e) => {
        const reader = new FileReader()
        reader.onload = () => {
            imgRef.current.src = reader.result
        }
        reader.readAsDataURL(e.target.files[0])
        setFile(e.target.files[0])
    }

    useEffect(() => {
        setPageName("Mon Compt")
        setName(currentUser.name)
        setEmail(currentUser.email)
        setAbout(currentUser.about)
    }, [currentUser])

    return (
        <div className={`app-container ${navState ? ' app-shrink' : ''} md:py-36`}>
            <div className="flex gap-10 flex-col md:flex-row md:gap-20">

                <div className="flex flex-col items-center gap-3 w-full p-10 bg-colors-light rounded-lg shadow-md h-fit ">
                    <div className="relative">
                        <img
                            ref={ imgRef }
                            src={`${import.meta.env.VITE_ASSETS}/Profile-pictures/${currentUser.image}`} 
                            className="w-36 rounded-full shadow-2xl" />
                        <input 
                            ref={ fileRef } 
                            type="file" 
                            className="hidden" 
                            onChange={handleFileImport} />
                        <EditIcon onClick={handleFileButtonClick} className="absolute bottom-2 right-2 w-10 cursor-pointer h-10 p-3 rounded-3xl fill-colors-light flex justify-center align-center bg-colors-lightblue hover:bg-colors-blue transition-all" />
                    </div>
                    <div className="flex column gap-1 justify-center items-center">
                        <h1 className="text-xl font-bold">{ currentUser.name }</h1>
                        <h4>{ currentUser.email }</h4>
                    </div>
                    <button className="w-full border-solid border-colors-blueAccent border-[1px] px-5 py-3 rounded-md text-colors-blueAccent transition-all whitespace-nowrap hover:bg-colors-blueAccent hover:text-colors-light">Changer le mot de passe</button>
                </div>

                <ChangeInfos />
            </div>
        </div>
    )
}