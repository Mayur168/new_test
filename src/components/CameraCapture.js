

import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faCameraRotate,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { handleError } from "../utils";


const CameraCapture = ({
  closeCamera,
  onResponseReceived,
  onApiLoading,
  isDisabled,
}) => {
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const videoRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
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

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
  };

  const switchCamera = () => {
    stopCamera();
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const captureImage = async () => {
    if (videoRef.current && !isDisabled && !isCapturing) {
      setIsCapturing(true);
      
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      // Stop the camera stream after capturing the image
      stopCamera();
  
      // Compress the image using canvas
      const compressedImageSrc = await compressImage(canvas, 100); // Target 100KB
  
      // Notify API loading
      onApiLoading();
  
      // Send the captured and compressed image to the backend
      await sendImageToBackend(compressedImageSrc);
  
      // Reset capture state
      setIsCapturing(false);
    }
  };
  

  // const captureImage = async () => {
  //   if (videoRef.current && !isDisabled && !isCapturing) {
  //     setIsCapturing(true);
  //     const video = videoRef.current;
  //     const canvas = document.createElement("canvas");
  //     canvas.width = video.videoWidth;
  //     canvas.height = video.videoHeight;
  //     const context = canvas.getContext("2d");
  //     context.drawImage(video, 0, 0, canvas.width, canvas.height);

  //     // Compress the image using canvas
  //     const compressedImageSrc = await compressImage(canvas, 100); // Target 100KB

  //     onApiLoading();
  //     await sendImageToBackend(compressedImageSrc);
  //   }
  // };

  const compressImage = (canvas, targetSizeKB) => {
    return new Promise((resolve) => {
      let quality = 0.9; // Initial quality
      let compressedImageSrc = canvas.toDataURL("image/jpeg", quality);

        const checkAndCompress = async () => {
              const blob = await fetch(compressedImageSrc).then((res) => res.blob());
              const sizeInKB = blob.size / 1024;

                if (sizeInKB <= targetSizeKB || quality <= 0.1) {
                 resolve(compressedImageSrc)
                 return;
                } else if (sizeInKB > targetSizeKB) {
                  quality -= 0.1; // Reduce the quality.
                   compressedImageSrc = canvas.toDataURL('image/jpeg', quality)
                   return checkAndCompress()
              }  else {
                  resolve(compressedImageSrc)
                  return;
              }
        };

        checkAndCompress()
    });
  };

  const sendImageToBackend = async (imageSrc) => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "captured_image.jpg");

      const response = await axios.post(
        
        "https://bharati-clinic-test.vercel.app/prescription/imageprocess/",
              //  "https://django-imageprocessing-api.vercel.app/api/imageprocess/getdata/",

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${accessToken}`,

          },
        }
      );
        onResponseReceived({ image: imageSrc, response: response.data });
        window.scrollTo({
          top: 0,
          behavior: "smooth", // Smooth scrolling animation
        });
    } catch (error) {
      console.error("Error sending image to backend:", error);
        setIsCapturing(false); // reset capture after failure
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
        zIndex: 9999,
        backgroundColor: "black",
      }}
    >
      {isDisabled && (
        <div
          className="camera-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000, // Ensure it's on top
          }}
        >
          <p style={{ color: "white", fontSize: "20px" }}>Processing...</p>
        </div>
      )}
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
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        ></video>

        <div
          className="camera-switch-overlay"
          onClick={switchCamera}
          style={{
            position: "absolute",
            top: "20px",
            right: "10px",
            color: "white",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          <FontAwesomeIcon icon={faCameraRotate} size="1x" />
        </div>

        <div
          className="back-button"
          onClick={() => {
            stopCamera();
            closeCamera();
          }}
          style={{
            position: "absolute",
            top: "20px",
            left: "10px",
            color: "white",
            cursor: "pointer",
            zIndex: 1001,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "10px",
            borderRadius: "50%",
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} size="1x" />
        </div>
      </div>

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
          disabled={isDisabled}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "50px",
            border: "none",
            backgroundColor: isDisabled ? "#ccc" : "#1c75c4",
            color: "white",
            cursor: isDisabled ? "not-allowed" : "pointer",
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