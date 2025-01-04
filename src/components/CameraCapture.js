import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCameraRotate } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { handleError } from "../utils";

const CameraCapture = ({ closeCamera, onDataReceived }) => {
  const [image, setImage] = useState(null); // Captured image state
  const [facingMode, setFacingMode] = useState("user"); // Camera mode state
  const webcamRef = useRef(null); // Reference to the webcam

  // Function to toggle between front and back cameras
  const switchCamera = () => {
    // Toggle the facing mode between "user" (front) and "environment" (back)
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  // Function to handle API call for processing the uploaded image
  const handleApiCall = async (imageUrl) => {
    try {
      const apiUrl =
        "https://django-imageprocessing-api.vercel.app/api/imageprocess/getdata/";

      const response = await axios.get(apiUrl, {
        params: { image_url: imageUrl },
      });

      if (response.status === 200) {
        console.log(response.data);
        onDataReceived(response.data); // Notify parent component
        closeCamera(); // Close camera view
      } else {
        handleError("Data fetching failed.");
      }
    } catch (error) {
      handleError("Data fetching failed." + error.message);
    }
  };

  // Function to upload the captured image to the server
  const handleImageUpload = async (imageSrc) => {
    try {
      const apiUrl = "https://hoteltest-six.vercel.app/uploads/upload_image";
      const formData = new FormData();

      // Convert base64 to Blob for uploading
      const base64Image = imageSrc.split(",")[1];
      const blob = await fetch(`data:image/jpeg;base64,${base64Image}`).then(
        (res) => res.blob()
      );
      formData.append("file", blob, "captured-image.jpeg");

      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        handleApiCall(response.data.file_url);
      } else {
        handleError("Image upload failed.");
      }
    } catch (error) {
      handleError("Image upload failed. " + error.message);
    }
  };

  // Function to capture an image from the webcam
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc); // Save captured image
      handleImageUpload(imageSrc); // Upload the captured image
    }
  };

  return (
    <div className="camera-container">
      <h1>Capture Prescription Photo</h1>

      {/* Display the webcam view */}
      {!image && (
        <div className="webcam-wrapper">
          <Webcam
            audio={false} // Disable audio
            ref={webcamRef} // Attach webcam reference
            screenshotFormat="image/jpeg" // Set screenshot format
            width="100%" // Full width
            facingMode={facingMode} // Use dynamic facing mode (front/back camera)
            key={facingMode} // Force re-render when facingMode changes
            onUserMediaError={(error) => {
              console.error("Camera access error:", error);
              alert("Camera access error: " + error.message);
            }}
            onUserMedia={() => {
              console.log("Camera initialized with facingMode:", facingMode);
            }}
          />

          {/* Button to switch between front and back cameras */}
          <div className="camera-switch-overlay" onClick={switchCamera}>
            <FontAwesomeIcon icon={faCameraRotate} size="2x" />
          </div>
        </div>
      )}

      {/* Display the captured image preview */}
      {image && (
        <div className="image-preview">
          <h2>Captured Photo:</h2>
          <img src={image} alt="Captured" style={{ width: "100%" }} />
        </div>
      )}

      {/* Capture button only shown when webcam is active */}
      {!image && (
        <div className="capture-button-container">
          <button className="capture-button" onClick={captureImage}>
            <FontAwesomeIcon icon={faCamera} style={{ marginRight: "5px" }} />
            Capture Photo
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
