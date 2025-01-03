import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCameraRotate } from "@fortawesome/free-solid-svg-icons"; // Import icons

const CameraCapture = ({ closeCamera }) => {
  const [image, setImage] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const webcamRef = useRef(null);

  const switchCamera = () => {
    setFacingMode((prevMode) =>
      prevMode === "user" ? "environment" : "user"
    );
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
      localStorage.setItem("capturedPhoto", imageSrc);
      closeCamera();
    }
  };

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

          {/* Camera switch button */}
          <div className="camera-switch-overlay" onClick={switchCamera}>
            <FontAwesomeIcon icon={faCameraRotate} size="2x" />
          </div>
        </div>
      )}

      {image && (
        <div className="image-preview">
          <h2>Captured Photo:</h2>
          <img src={image} alt="Captured" style={{ width: "100%" }} />
        </div>
      )}

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