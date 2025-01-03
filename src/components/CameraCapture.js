import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCameraRotate } from "@fortawesome/free-solid-svg-icons"; // Import icons

const CameraCapture = ({ closeCamera }) => {
    const [image, setImage] = useState(null);
    const [facingMode, setFacingMode] = useState("user");
    const webcamRef = useRef(null);


    const handleCameraAction = () => {
       if (image) {
           //If an image is already captured we do not want to capture another photo so we will close the camera
            closeCamera();
            return;
        }

        if (webcamRef.current) {
            // Capture image from the webcam
            const imageSrc = webcamRef.current.getScreenshot();

            if (imageSrc) {
                 // Update state with the captured image
                setImage(imageSrc);

                // Save the captured image to local storage
                 localStorage.setItem("capturedPhoto", imageSrc);
            } else {
                 // No image captured, so switch the camera
                setFacingMode((prevMode) =>
                     prevMode === "user" ? "environment" : "user"
                );

            }


        }
     };


  const getButtonIcon = () => {
        if (image) {
            return faCamera;
        }
        return  faCameraRotate;
    }

    const getButtonText = () => {
          if (image) {
              return 'Close Camera';
          }
          return  'Switch Camera';
      }


  return (
    <div className="camera-container">
      <h1>Capture Prescription Photo</h1>
      {!image && (
        <div className="webcam-wrapper">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            facingMode={facingMode}
          />
        </div>
      )}
        {image && (
            <div className="image-preview">
              <h2>Captured Photo:</h2>
              <img src={image} alt="Captured" style={{ width: "100%" }} />
            </div>
          )}

      <div className="capture-button-container">
        <button className="capture-button" onClick={handleCameraAction}>
             <FontAwesomeIcon icon={getButtonIcon()}  style={{ marginRight: '5px' }}/> {getButtonText()}
         </button>
      </div>
    </div>
  );
};

export default CameraCapture;