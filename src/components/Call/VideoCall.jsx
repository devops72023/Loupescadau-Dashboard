import { useContext, useEffect, useRef, useState } from "react"
import { PhoneIcon, ExpandIcon, CloseIcon, CameraIcon, MicrophoneIcon } from "../global/Icons"

import '../../assets/styles/video_call.css'
import { AppContext } from "../../App"

const VideoCall = ()=>{
    const { callExist, isAnswered, socketObj, socketId, sdpObj } = useContext(AppContext)
    const [ isFullScreen, setIsFullScreen] = useState(false)
    const videoHolder = useRef()
    const localStream = useRef()
    const remoteStream = useRef()
    const pc = useRef();
    let stream = null;
    
    function enterFullscreen() {
        if (videoHolder.current.requestFullscreen) {
          videoHolder.current.requestFullscreen();
          setIsFullScreen(true)
        } else if (videoHolder.current.mozRequestFullScreen) { // Firefox
          videoHolder.current.mozRequestFullScreen();
          setIsFullScreen(true)
        } else if (videoHolder.current.webkitRequestFullscreen) { // Chrome, Safari and Opera
          videoHolder.current.webkitRequestFullscreen();
          setIsFullScreen(true)
        } else if (videoHolder.current.msRequestFullscreen) { // IE/Edge
          videoHolder.current.msRequestFullscreen();
          setIsFullScreen(true)
        }
      }
    function exitFullscreen() {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          setIsFullScreen(false)
        } else if (document.mozCancelFullScreen) { // Firefox
          document.mozCancelFullScreen();
          setIsFullScreen(false)
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
          document.webkitExitFullscreen();
          setIsFullScreen(false)
        } else if (document.msExitFullscreen) { // IE/Edge
          document.msExitFullscreen();
          setIsFullScreen(false)
        }
    }
    
    const closeStream = ()=>{
      stream.getTracks().forEach(track => {
        track.stop();
      })
    }
    useEffect(()=>{
      console.log('sdp object : ', sdpObj)
      
      socketObj.on('candidate' , (candidate) => {
        console.log('outside :', candidate)
        try {
            pc.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch(error) {
            console.log(error.message);
        }
      })

      const constraints = {
        video: true,
        audio: true,
      }
      try{
        navigator.mediaDevices.getUserMedia(constraints)
          .then(stream => {
            localStream.current.srcObject = stream;
  
            stream.getTracks().forEach(track => {
              _pc.addTrack(track, stream);
            })
          })
        }
      catch(err){
        console.log(err)
      }

      const _pc = new RTCPeerConnection(null);
      _pc.onicecandidate = (e) => {
        console.log(e.candidate)
          if (e.candidate){
            sendToPeer('candidate', e.candidate)
          }
      }

      _pc.oniceconnectionstatechange = (e) => {
          console.log(e)
      }
      
      _pc.ontrack = e => {
          // when the remote stream available
          remoteStream.current.srcObject =  e.streams[0];
      }

      pc.current = _pc;

      try {
        pc.current.setRemoteDescription(new RTCSessionDescription(sdpObj));
      } catch(error) {
        console.log(error.message);
      }
      
      const sendToPeer = (eventType, payload) => {
        socketObj.emit(eventType, payload)
      }
      
      const prcessSDP = (sdp) => {
        pc.current.setLocalDescription(sdp)
        // Sending the sdp to the server
        sendToPeer('sdp', sdp);
      }
      const createAnswer = ()=>{
        pc.current.createAnswer({
          offerToReceiveAudio: 1,
          offerToReceiveVideo: 1,
        }).then(sdp => {
          console.log(sdp)
          prcessSDP(sdp)
        }).catch(err => console.log(err))
      }

      createAnswer()
      
    }, [])
    return (
        <div 
            ref={videoHolder}
            className={`videoContainer flex justify-center items-center relative w-full max-w-lg h-full rounded-md shadow-md bg-light overflow-hidden ${isFullScreen ? 'fullscreen' : ''}`} >
            <video className="w-full h-full " ref={remoteStream} autoPlay></video>
            <video className="absolute top-2 right-2 max-h-20 rounded-lg overflow-hidden" ref={localStream} autoPlay></video>
            <div 
                className="absolute flex justify-center items-center gap-2 bottom-0 w-full py-2 bg-blue bg-opacity-20 backdrop-blur-lg">
                    <MicrophoneIcon
                        onClick={()=>{}} 
                        className="w-14 h-14 p-4 cursor-pointer rounded-full fill-blue bg-light bg-opacity-50 transition-all hover:bg-light" />
                    <CameraIcon
                        onClick={()=>{}} 
                        className="w-14 h-14 p-4 cursor-pointer rounded-full fill-blue bg-light bg-opacity-50 transition-all hover:bg-light" />
                    <PhoneIcon
                        onClick={closeStream} 
                        className="w-14 h-14 p-3 bg-red-800 rounded-full cursor-pointer stroke-light fill-light transition-all hover:bg-light hover:fill-red-800 hover:stroke-red-800" />
                    {
                        isFullScreen 
                        ? <CloseIcon
                            onClick={exitFullscreen} 
                            className="w-14 h-14 p-4 cursor-pointer rounded-full fill-blue bg-light bg-opacity-50 transition-all hover:bg-light" />
                        : <ExpandIcon
                            onClick={enterFullscreen} 
                            className="w-14 h-14 p-4 cursor-pointer rounded-full fill-blue bg-light bg-opacity-50 transition-all hover:bg-light" />    
                    }  
            </div>
        </div>
    )
}

export default VideoCall;