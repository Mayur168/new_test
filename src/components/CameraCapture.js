// import React, { useState, useRef } from "react";
// import Webcam from "react-webcam";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCamera, faCameraRotate } from "@fortawesome/free-solid-svg-icons"; // Import icons

// const CameraCapture = ({ closeCamera }) => {
//   const [image, setImage] = useState(null);
//   const [facingmode, setfacingmode] = useState("user");
//   const webcamRef = useRef(null);

//   const switchCamera = () => {
//     setfacingmode((prevMode) =>
//       prevMode === "user" ? "environment" : "user"
//     );
//   };

//   const captureImage = () => {
//     if (webcamRef.current) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       setImage(imageSrc);
//       localStorage.setItem("capturedPhoto", imageSrc);
//       closeCamera();
//     }
//   };

//   return (
//     <div className="camera-container">
//       <h1>Capture Prescription Photo</h1>

//       {!image && (
//         <div className="webcam-wrapper">
//           <Webcam
//             audio={false}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             width="100%"
//             facingmode={facingmode}
//           />

//           {/* Camera switch button */}
//           <div className="camera-switch-overlay" onClick={switchCamera}>
//             <FontAwesomeIcon icon={faCameraRotate} size="2x" />
//           </div>
//         </div>
//       )}

//       {image && (
//         <div className="image-preview">
//           <h2>Captured Photo:</h2>
//           <img src={image} alt="Captured" style={{ width: "100%" }} />
//         </div>
//       )}

//       {!image && (
//         <div className="capture-button-container">
//           <button className="capture-button" onClick={captureImage}>
//             <FontAwesomeIcon icon={faCamera} style={{ marginRight: "5px" }} />
//             Capture Photo
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CameraCapture;import React, { useState, useRef } from "react";

import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro, faCameraRotate } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { handleError } from "../utils";

const CameraCapture = ({ closeCamera, onDataReceived }) => {
    const [image, setImage] = useState(null);
    const [facingmode, setfacingmode] = useState("user");
    const webcamRef = useRef(null);

    const switchCamera = () => {
        setfacingmode((prevMode) => (prevMode === "user" ? "environment" : "user"));
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

            {!image && (
                <div className="webcam-wrapper">
                    <Webcam
                        key={facingmode}
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width="100%"
                        facingmode={facingmode}
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
                        <FontAwesomeIcon icon={faCameraRetro} style={{ marginRight: "5px" }} />
                        Capture Photo
                    </button>
                </div>
            )}
        </div>
    );
};

export default CameraCapture;