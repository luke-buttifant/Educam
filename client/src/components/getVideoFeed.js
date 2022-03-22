import React, {useEffect} from 'react'

const VideoFeed = () => {

  const streamCamVideo = () => {
  var constraints = { audio: true, video: { width: 1280, height: 720 } };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(mediaStream) {
      var video = document.querySelector("video");

      video.srcObject = mediaStream;
      video.onloadedmetadata = function(e) {
        video.play();
      };
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    }); // always check for errors at the end.
  }

  useEffect(()=>{
    streamCamVideo()
  },[])

  return (
        <video autoPlay={true} id="videoElement" className='rounded-lg shadow-lg'></video>
  );
}

export default VideoFeed;
