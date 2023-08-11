import { useContext, useEffect } from "react";
import { useState } from "react";
import { AppContext } from "../../App";


const Chat = () => {
    const { socketObj, from } = useContext(AppContext)
    const [ message, setMessage ] = useState('');
    const [ messages, setMessages ] = useState([]);
    const onSubmit = async (event) => {
        event.preventDefault()
        
        if ( message.length > 0 ){
            const obj = {author: socketObj.id, message}
            socketObj.emit('message', {from: socketObj.id, to: from, message: obj});
            setMessages(prv=>{
                return [...prv, obj]
            })
            setMessage('')
        }
    }
    useEffect(()=>{
        socketObj.on('message', ({from, message}) => {
            console.log(message)
            setMessages(prv=>{
                return [...prv, message]
            })
        })
    },[])
    return (
        <div className="chatContainer flex flex-col max-w-lg w-full h-full rounded-md shadow-md bg-colors-light bg-opacity-80 backdrop-blur-lg overflow-hidden">
            <div className="text-blue px-5 py-3 shadow-md">Messages</div>
            <div className="flex flex-col gap-3 py-3 px-4 max-h-[300px] overflow-hidden overflow-y-auto">
                {
                    messages.length > 0
                    && messages.map((msg, index)=>{
                        if(msg.author == socketObj.id){
                            return (
                                <div key={index} className="flex items-center relative rounded-lg shadow-lg bg-white px-5 py-3 z-0 ml-auto min-w-[150px] text-sm">
                                    <span className="absolute w-[15px] h-[15px] rotate-45 rounded-sm bg-white  -right-[7px]"></span>
                                    {msg.message}
                                </div>
                            )
                        }else{
                            return (
                                <div key={index} className="flex items-center relative rounded-lg shadow-lg bg-blue-100 px-5 py-3 z-0 mr-auto min-w-[150px] text-sm">
                                    <span className="absolute w-[15px] h-[15px] rotate-45 rounded-sm bg-blue-100  -left-[7px]"></span>
                                    {msg.message}
                                </div>
                            )
                        }
                    })
                }
            </div>
            <form 
                onSubmit={onSubmit}
                className="flex w-full h-14 mt-auto align-center bg-colors-light shadow-2xl">
                <input 
                    type="text"
                    placeholder='Ecrire un message'
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full h-full px-3 py-2 text-xs bg-colors-light text-colors-blue outline-none placeholder:text-blue  transition-all" />
                <button className="w-fit px-3 text-sm text-colors-light h-10 bg-transparent mx-2 rounded-3xl hover:bg-colors-blue group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-colors-blue transition-all group-hover:text-colors-light">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </button>
            </form>
        </div>
    )
}
export default Chat;