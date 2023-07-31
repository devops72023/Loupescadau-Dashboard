import { useContext, useEffect } from "react";
import { AppContext } from "../../App";
import { Link } from 'react-router-dom';
import { PhoneIcon } from "../global/Icons";

import '/src/assets/styles/AnswerCall.css';


export default function AnswerCall(){
    const { navState, currentUser, callExist, setCallExist, isAnswered, setIsAnswered, socketObj, from } = useContext(AppContext)
    
    function acceptCall(){
        if(callExist && !isAnswered){
            setIsAnswered(true)
            socketObj.emit('call-answer', {from: currentUser._id, to: from, answer: "accepted"})
        }
    }
    function denyCall(){
        if(callExist && !isAnswered){
            socketObj.emit('call-answer', {from: currentUser._id, to: from, answer: "not_accepted"})
            window.location.reload();
        }
    }

    return (
        <div className={`app-container ${navState ? ' app-shrink' : ''}`}>
            <div className="app flex column gap-10 justify-center align-center">
                <div className="image py-24">
                    <img 
                        src={`${import.meta.env.VITE_ASSETS}Profile-pictures/${currentUser.image}`} 
                        alt={currentUser.name}
                        className="w-48 h-48 object-cover caller-img" 
                        />
                </div>
                <h2>
                    {currentUser.name}
                </h2>
                <div className="flex gap-10">
                    <button 
                        onClick={denyCall}
                        className=" text-red-800 flex gap-5 align-center rounded-xl px-7 py-3 transition-all hover:bg-red-800 hover:text-colors-light group">
                        <PhoneIcon className="fill-red-800 stroke-red-800 rotate-down group-hover:fill-colors-light group-hover:stroke-colors-light" />
                        <div>
                            Refuse
                        </div>
                    </button> 
                    <button 
                        onClick={acceptCall}
                        className="answer-call-btn relative bg-colors-blueAccent text-colors-light  flex gap-5 align-center rounded-xl px-7 py-3 transition-all hover:bg-colors-blue ">
                        <PhoneIcon className="answer-call-icon fill-colors-light stroke-colors-light rotate-90" />
                        <div>
                            Answer
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}