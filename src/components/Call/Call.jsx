import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../App"
import AnswerCall from "./AnswerCall"
import CallEstablished from "./CallEstablished"
import { useNavigate } from "react-router-dom";

export default function Call () {
    const { callExist, isAnswered, socket } = useContext(AppContext);
    const navigate = useNavigate()

    if(callExist && !isAnswered){ 
        return <AnswerCall /> 
    }else if(callExist && isAnswered){
        return <CallEstablished />
    }
    useEffect(()=>{
        navigate('/')
    })

    return navigate('/')
}