import React, { useState } from "react";
import Webcam from "react-webcam";

const CameraCapture = ({ closeCamera }) => {
  const [image, setImage] = useState(null); // State to hold the captured image
  const webcamRef = React.useRef(null); // Reference to the webcam

  const captureImage = () => {
    if (webcamRef.current) {
      // Capture image from the webcam
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc); // Update state with the captured image

      // Save the captured image to local storage
      localStorage.setItem("capturedPhoto", imageSrc);

      // Automatically close the camera
      closeCamera();
    }
  };

  return (
    <div className="camera-container">
      <h1>Capture Prescription Photo</h1>

      {/* Webcam Component */}
      {!image && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
        />
      )}

      {/* Display Captured Image */}
      {image && (
        <div className="image-preview">
          <h2>Captured Photo:</h2>
          <img src={image} alt="Captured" style={{ width: "100%" }} />
        </div>
      )}

      {/* Capture Button */}
      {!image && (
        <button className="capture-button" onClick={captureImage}>
          Capture Photo
        </button>
      )}
    </div>
  );
};

export default CameraCapture;
