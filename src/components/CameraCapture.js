import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCameraRotate } from "@fortawesome/free-solid-svg-icons";

const CameraCapture = ({ closeCamera, onDataReceived }) => {
  const [stream, setStream] = useState(null); // Video stream
  const [facingMode, setFacingMode] = useState("environment"); // Set initial camera to "environment" (back camera)
  const [showToggleButton, setShowToggleButton] = useState(false); // State to control toggle button visibility
  const videoRef = useRef(null); // Reference to the video element

  // Function to start the camera
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
      setShowToggleButton(true); // Show toggle button when the camera is active
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
    setShowToggleButton(false); // Hide toggle button when camera is stopped
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
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#f8f9fa",
        position: "relative",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Capture Prescription Photo
      </h1>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "500px",
          overflow: "hidden",
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
            height: "auto",
            borderRadius: "10px",
            backgroundColor: "black",
          }}
        ></video>

        {/* Button to switch between front and back cameras */}
        {showToggleButton && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              padding: "10px",
              borderRadius: "50%",
              cursor: "pointer",
              zIndex: 10,
              display: showToggleButton ? "block" : "none", // Conditionally hide the button
            }}
            onClick={switchCamera}
          >
            <FontAwesomeIcon icon={faCameraRotate} size="2x" />
          </div>
        )}
      </div>

      {/* Capture button */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={captureImage}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon
            icon={faCamera}
            style={{ marginRight: "5px", verticalAlign: "middle" }}
          />
          Capture Photo
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
