import { useContext, useEffect, useRef, useState } from "react";
import {
  PhoneIcon,
  ExpandIcon,
  CloseIcon,
  CameraIcon,
  MicrophoneIcon,
} from "../global/Icons";

import "../../assets/styles/video_call.css";
import { AppContext } from "../../App";

const VideoCall = () => {
  const { setCallExist, setIsAnswered, currentUser, socketObj, from } = useContext(AppContext);
  let socket = socketObj;
  const [ isFullScreen, setIsFullScreen ] = useState(false);
  const [ isCameraOpen, setIsCameraOpen ] = useState(true);
  const [ isAudioOpen, setIsAudioOpen ] = useState(true);
  const videoHolder = useRef(); // This is for the full screen mode
  const local = useRef();
  const remote = useRef();
  const peer = useRef();
  let streamRef = useRef();

  function enterFullscreen() {
    if (videoHolder.current.requestFullscreen) {
      videoHolder.current.requestFullscreen();
      setIsFullScreen(true);
    } else if (videoHolder.current.mozRequestFullScreen) {
      // Firefox
      videoHolder.current.mozRequestFullScreen();
      setIsFullScreen(true);
    } else if (videoHolder.current.webkitRequestFullscreen) {
      // Chrome, Safari and Opera
      videoHolder.current.webkitRequestFullscreen();
      setIsFullScreen(true);
    } else if (videoHolder.current.msRequestFullscreen) {
      // IE/Edge
      videoHolder.current.msRequestFullscreen();
      setIsFullScreen(true);
    }
  }
  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
      setIsFullScreen(false);
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari and Opera
      document.webkitExitFullscreen();
      setIsFullScreen(false);
    } else if (document.msExitFullscreen) {
      // IE/Edge
      document.msExitFullscreen();
      setIsFullScreen(false);
    }
  }
  async function endCall() {
    peer.current.close();
    peer.current = null;
    streamRef.current.getTracks().forEach((track) => track.stop());
    local.current.srcObject = null;
    remote.current.srcObject = null;
    socket.emit("end-call", { to: from });
    location.reload();
  }

  function stopAudio() {
    if(isAudioOpen){
        streamRef.current
            .getAudioTracks()
            .forEach((track) => (track.enabled = false));
    }else{
        streamRef.current
            .getAudioTracks()
            .forEach((track) => (track.enabled = true));
    }
    setIsAudioOpen(prv => !prv)
  }

  function stopCamera() {
        if (isCameraOpen){
            streamRef.current
                .getVideoTracks()
                .forEach((track) => (track.enabled = false));
        }else{
            streamRef.current
                .getVideoTracks()
                .forEach((track) => (track.enabled = true));
        }
        setIsCameraOpen(prv => !prv)
  }

  useEffect(() => {
    socket.on("sdp", async ({ sdp }) => {
      console.log(sdp);
      await peer.current.setRemoteDescription(new RTCSessionDescription(sdp));
      setTimeout(()=>{
        peer.current.createAnswer({
          offerToReceiveAudio: 1,
          offerToReceiveVideo: 1,
        })
        .then(prcessSDP)
        .catch(err => console.log(err))
      }, 1000)
    });
    socket.on('end-call', ()=>{
      window.location.reload()
    })

    socket.on("candidate", ({ candidate }) => {
      peer.current.addIceCandidate(new RTCIceCandidate(candidate));
    });
    const constraints = { video: true, audio: true };
    try {
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        local.current.srcObject = stream;
        streamRef.current = stream;

        stream.getTracks().forEach((track) => {
          peer.current.addTrack(track, stream);
        });
      });
    } catch (err) {
      console.log(err);
    }
    const _pc = new RTCPeerConnection(null);
    _pc.onicecandidate = (e) => {
      if (e.candidate) {
        sendToPeer("candidate", {
          from: socket.id,
          to: from,
          candidate: e.candidate,
        });
      }
    };
    _pc.oniceconnectionstatechange = (e) => {
      console.log(e)
      if (_pc.iceConnectionState === "closed") {
        setCallExist(false);
        setIsAnswered(false);
      }
    };
    _pc.ontrack = (e) => {
      console.log("streams ", e);
      remote.current.srcObject = e.streams[0];
    };
    peer.current = _pc;
    
    return ()=>{
      location.reload();
    };
  }, []);

  const sendToPeer = (eventType, payload) => {
    socket.emit(eventType, payload);
  };

  const prcessSDP = (sdp) => {
    try {
      peer.current.setLocalDescription(sdp); //
      console.log(sdp);
    } catch (error) {
      console.log(error.message);
    }
    // Sending the sdp to the server
    sendToPeer("sdp", { from: socket.id, to: from, sdp: sdp });
  };

  const createAnswer = () => {
    peer.current
      .createAnswer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      })
      .then(prcessSDP)
      .catch((err) => console.log(err));
  };

  return (
    <div
      ref={videoHolder}
      className={`videoContainer flex justify-center items-center relative w-full max-w-lg h-full rounded-md shadow-md bg-colors-light overflow-hidden ${
        isFullScreen ? "fullscreen" : ""
      }`}
    >
      <video className="w-full h-full " ref={remote} autoPlay loop></video>
      <video
        className="absolute top-2 right-2 max-h-20 rounded-lg overflow-hidden"
        ref={local}
        autoPlay
      ></video>
      <div className="absolute flex justify-center items-center gap-2 bottom-0 w-full py-2 bg-colors-blue bg-opacity-20 backdrop-blur-lg">
        <MicrophoneIcon
          onClick={stopAudio}
          className={`w-14 h-14 p-4 cursor-pointer rounded-full ${isAudioOpen ? 'fill-colors-blue bg-colors-light bg-opacity-50' : 'fill-colors-light bg-colors-blue' } transition-all hover:bg-light`}
        />
        <CameraIcon
          onClick={stopCamera}
          className={`w-14 h-14 p-4 cursor-pointer rounded-full ${isCameraOpen ? 'fill-colors-blue bg-colors-light bg-opacity-50' : 'fill-colors-light bg-colors-blue' } transition-all hover:bg-light`}
        />
        <PhoneIcon
          onClick={endCall}
          className="w-14 h-14 p-3 bg-red-800 rounded-full cursor-pointer stroke-colors-light fill-colors-light transition-all hover:bg-colors-light hover:fill-red-800 hover:stroke-red-800"
        />
        {isFullScreen ? (
          <CloseIcon
            onClick={exitFullscreen}
            className="w-14 h-14 p-4 cursor-pointer rounded-full fill-colors-blue bg-colors-light bg-opacity-50 transition-all hover:bg-colors-light"
          />
        ) : (
          <ExpandIcon
            onClick={enterFullscreen}
            className="w-14 h-14 p-4 cursor-pointer rounded-full fill-colors-blue bg-colors-light bg-opacity-50 transition-all hover:bg-colors-light"
          />
        )}
      </div>
    </div>
  );
};

export default VideoCall;
