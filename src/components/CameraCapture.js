import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCameraRotate } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { handleError } from "../utils";

const CameraCapture = ({ closeCamera, onDataReceived }) => {
    const [image, setImage] = useState(null);
    const [facingmode, setfacingmode] = useState("user");
    const [showCamera, setShowCamera] = useState(true);
    const [error, setError] = useState(null);
    const webcamRef = useRef(null);
    const [availableCameras, setAvailableCameras] = useState([]);


    useEffect(() => {
        const checkCameraAvailability = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter((device) => device.kind === "videoinput");
                setAvailableCameras(videoDevices);

                if (videoDevices.length === 0) {
                    setError("No camera available.");
                }
            } catch (err) {
                setError("Error checking camera: " + err.message);
            }
        };

        checkCameraAvailability();
    }, []);

  const switchCamera = async () => {
       setError(null);
      setShowCamera(false);

        const newMode = facingmode === "user" ? "environment" : "user";

        try {
            // Get new mode video device
           const nextCamera = availableCameras.find(device =>
                device.label.toLowerCase().includes(newMode) || device.label.toLowerCase().includes(newMode === "user" ? "front" : "back"));

            if (nextCamera) {
               setfacingmode(newMode);
                setShowCamera(true);
            } else if (availableCameras.length > 0){ // if we have devices but didnt find the desired device then set the face mode to the first device.
                  setfacingmode(availableCameras[0].label.toLowerCase().includes("user") || availableCameras[0].label.toLowerCase().includes("front") ? "user" : "environment");
                    setShowCamera(true);
           } else {
              setError("Camera not found.");
              setShowCamera(true);
            }
        } catch (err) {
            setError("Failed to access cameras." + err.message);
             setShowCamera(true);
        }
    };



    const handleApiCall = async (imageUrl) => {
        try {
            const apiUrl =
                "https://django-imageprocessing-api.vercel.app/api/imageprocess/getdata/";

            const response = await axios.get(apiUrl, {
                params: { image_url: imageUrl },
            });

            if (response.status === 200) {
                // Notify the parent component with the data
                console.log(response.data);
                onDataReceived(response.data);
                closeCamera();
            } else {
                handleError("Data fetching failed.");
            }
        } catch (error) {
            handleError("Data fetching failed." + error.message);
        }
    };

    const handleImageUpload = async (imageSrc) => {
        try {
            // Upload image using the hotel api
            const apiUrl = "https://hoteltest-six.vercel.app/uploads/upload_image";
            const formData = new FormData();
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
                // Notify the parent component that the image was uploaded
                handleApiCall(response.data.file_url);
            } else {
                handleError("Image upload failed.");
            }
        } catch (error) {
            handleError("Image upload failed. " + error.message);
        }
    };

    const captureImage = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setImage(imageSrc);
            handleImageUpload(imageSrc);
        }
    };

    return (
        <div className="camera-container">
            <h1>Capture Prescription Photo</h1>
              {error && <div className="error-message">{error}</div>}
            {!image && (
                <div className="webcam-wrapper">
                    {showCamera && (
                        <Webcam
                            key={facingmode}
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width="100%"
                            facingmode={facingmode}
                        />
                    )}
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