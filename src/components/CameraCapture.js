import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCameraRotate } from "@fortawesome/free-solid-svg-icons";

const CameraCapture = ({ closeCamera, onDataReceived }) => {
  const [stream, setStream] = useState(null); // Video stream
  const [facingMode, setFacingMode] = useState("user"); // Camera mode
  const videoRef = useRef(null); // Reference to the video element

  // Function to start the camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }, // Set the desired camera
        audio: false, // Disable audio
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
      alert("Camera access failed. Please check permissions.");
    }
  };

  // Function to stop the camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
  };

  // Function to handle switching cameras
  const switchCamera = () => {
    stopCamera(); // Stop the current stream
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  // Restart the camera whenever the facingMode changes
  useEffect(() => {
    startCamera();
    return () => stopCamera(); // Cleanup on unmount or when facingMode changes
  }, [facingMode]);

  // Function to capture a frame from the video stream
  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageSrc = canvas.toDataURL("image/jpeg");
      console.log("Captured Image:", imageSrc);
      // You can now upload or process the captured image
    }
  };

  return (
    <div className="camera-container">
      <h1>Capture Prescription Photo</h1>

      <div className="webcam-wrapper">
        {/* Video element to display the camera feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%" }}
        ></video>

        {/* Button to switch between front and back cameras */}
        <div className="camera-switch-overlay" onClick={switchCamera}>
          <FontAwesomeIcon icon={faCameraRotate} size="2x" />
        </div>
      </div>

      {/* Capture button */}
      <div className="capture-button-container">
        <button className="capture-button" onClick={captureImage}>
          <FontAwesomeIcon icon={faCamera} style={{ marginRight: "5px" }} />
          Capture Photo
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
