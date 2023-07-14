import { useContext, useState } from "react"
import { AppContext } from "../../App"
import AnswerCall from "./AnswerCall"
import CallEstablished from "./CallEstablished"

export default function Call () {
    const { callExist, isAnswered, socket } = useContext(AppContext);

    if(callExist && !isAnswered){ 
        return <AnswerCall /> 
    }else if(callExist && isAnswered){
        return <CallEstablished />
    }

    return (<h1> Calls History </h1>)
}