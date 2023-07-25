import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../../App"
import { PhoneIcon, ExpandIcon, CloseIcon, CameraIcon, MicrophoneIcon } from "../global/Icons"
import PositionPicker from "../Settings/PositionPicker"
import VideoCall from "./VideoCall"
import Chat from "./Chat"


export default function CallEstablished(){
    const { setPageName, setActiveItem, navState } = useContext(AppContext)

    const onPositionSelected = (position) => {
    }


    return (
        <div className={`app-container ${navState ? ' app-shrink' : ''}`}>
            <div className="flex flex-col lg:flex-row w-full gap-3 h-auto items-center justify-center">
                <VideoCall />
                <Chat />
                <div className="max-w-lg w-full">
                    <PositionPicker  onPositionSelected={onPositionSelected} className="h-40 w-full"/>
                </div>
            </div>
        </div>
    )
}