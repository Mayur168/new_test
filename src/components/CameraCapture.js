import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCameraRotate, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const CameraCapture = ({ closeCamera, onDataReceived }) => {
  const [stream, setStream] = useState(null); // Video stream
  const [facingMode, setFacingMode] = useState("environment"); // Set initial camera to "environment" (back camera)
  const videoRef = useRef(null); // Reference to the video element

  // Function to start the camera with normal zoom-like behavior
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode, // Set the desired camera
          width: { ideal: 1280 }, // Ideal width for HD resolution
          height: { ideal: 720 }, // Ideal height for HD resolution
        },
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

      // Send the captured image to the Home component via onDataReceived callback
      onDataReceived(imageSrc);

      // Stop the camera and close the camera view
      stopCamera();
      closeCamera(); // Ensure the camera view is hidden
    }
  };

  return (
    <div
      className="camera-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 999,
        backgroundColor: "black",
      }}
    >
      <div
        className="webcam-wrapper"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Video element to display the camera feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // Make the video cover the full screen
          }}
        ></video>

        {/* Button to switch between front and back cameras */}
        <div
          className="camera-switch-overlay"
          onClick={switchCamera}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "white",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          <FontAwesomeIcon icon={faCameraRotate} size="2x" />
        </div>

        {/* Back button */}
        <div
          className="back-button"
          onClick={() => {
            stopCamera();
            closeCamera();
          }}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            color: "white",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} size="2x" />
        </div>
      </div>

      {/* Capture button */}
      <div
        className="capture-button-container"
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <button
          className="capture-button"
          onClick={captureImage}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "50px",
            border: "none",
            backgroundColor: "#1c75c4",
            color: "white",
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon icon={faCamera} style={{ marginRight: "5px" }} />
          Capture Photo
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
