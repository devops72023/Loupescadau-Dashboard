

const Chat = () => {
    return (
        <div className="chatContainer flex flex-col max-w-lg w-full h-full rounded-md shadow-md bg-light overflow-hidden">
            <div className="text-blue px-5 py-3 shadow-md">Messages</div>
            <div className="flex flex-col gap-3">
                {/* The messages */}
            </div>
            <form 
                className="flex w-full h-14 mt-auto align-center bg-light shadow-2xl">
                <input 
                    type="text"
                    placeholder='Ecrire un message'
                    className="w-full h-full px-3 py-2 text-xs bg-light text-blue outline-none placeholder:text-blue" />
                <button className="w-fit px-3 text-sm text-light h-10 bg-blue mx-2 rounded-md hover:bg-blueAccent">Envoyer</button>
            </form>
        </div>
    )
}
export default Chat;