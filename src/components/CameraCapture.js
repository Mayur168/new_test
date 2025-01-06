
// import React, { useState, useRef, useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCamera, faCameraRotate, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// const CameraCapture = ({ closeCamera, onDataReceived }) => {
//   const [stream, setStream] = useState(null); // Video stream
//   const [facingMode, setFacingMode] = useState("environment"); // Set initial camera to "environment" (back camera)
//   const videoRef = useRef(null); // Reference to the video element

//   // Function to start the camera with normal zoom-like behavior
//   const startCamera = async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: facingMode, // Use the front or back camera
//           width: { ideal: 1280 }, // HD resolution
//           height: { ideal: 960 }, // Adjust height for 4:3 aspect ratio
//           aspectRatio: 4 / 3, // Normal camera view
//         },
//         audio: false, // No audio needed
//       });
//       setStream(mediaStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//       }
//     } catch (error) {
//       console.error("Error accessing the camera:", error);
//       alert("Camera access failed. Please check permissions.");
//     }
//   };
  
//   // Function to stop the camera
//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//     }
//     setStream(null);
//   };

//   // Function to handle switching cameras
//   const switchCamera = () => {
//     stopCamera(); // Stop the current stream
//     setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
//   };

//   // Restart the camera whenever the facingMode changes
//   useEffect(() => {
//     startCamera();
//     return () => stopCamera(); // Cleanup on unmount or when facingMode changes
//   }, [facingMode]);

//   // Function to capture a frame from the video stream
//   const captureImage = () => {
//     if (videoRef.current) {
//       const canvas = document.createElement("canvas");
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//       const context = canvas.getContext("2d");
//       context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//       const imageSrc = canvas.toDataURL("image/jpeg");

//       // Send the captured image to the Home component via onDataReceived callback
//       onDataReceived(imageSrc);

//       // Stop the camera and close the camera view
//       stopCamera();
//       closeCamera(); // Ensure the camera view is hidden
//     }
//   };

//   return (
//     <div
//       className="camera-container"
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         zIndex: 9999, // Ensure it's above the navbar
//         backgroundColor: "black",
//       }}
//     >
//       <div
//         className="webcam-wrapper"
//         style={{
//           width: "100%",
//           height: "100%",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           position: "relative",
//         }}
//       >
//         {/* Video element to display the camera feed */}
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover", // Make the video cover the full screen
//           }}
//         ></video>

//         {/* Button to switch between front and back cameras */}
//         <div
//           className="camera-switch-overlay"
//           onClick={switchCamera}
//           style={{
//             position: "absolute",
//             top: "10px",
//             right: "10px",
//             color: "white",
//             cursor: "pointer",
//             zIndex: 1000, // Ensure it's above the video content
//           }}
//         >
//           <FontAwesomeIcon icon={faCameraRotate} size="2x" />

//         </div>

//         {/* Back button */}
//         <div
//           className="back-button"
//           onClick={() => {
//             stopCamera();
//             closeCamera();
//           }}
//           style={{
//             position: "absolute",
//             top: "20px", // Adjust top to avoid navbar overlap (make sure to consider navbar height)
//             left: "10px",
//             color: "white",
//             cursor: "pointer",
//             zIndex: 1001, // Make sure the Back button is on top of other elements
//             backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: Add a semi-transparent background for better visibility
//             padding: "10px",
//             borderRadius: "50%",
//           }}
//         >
//           <FontAwesomeIcon icon={faArrowLeft} size="2x" />
//         </div>
//       </div>

//       {/* Capture button */}
//       <div
//         className="capture-button-container"
//         style={{
//           position: "absolute",
//           bottom: "20px",
//           left: "50%",
//           transform: "translateX(-50%)",
//         }}
//       >
//         <button
//           className="capture-button"
//           onClick={captureImage}
//           style={{
//             padding: "10px 20px",
//             fontSize: "16px",
//             borderRadius: "50px",
//             border: "none",
//             backgroundColor: "#1c75c4",
//             color: "white",
//             cursor: "pointer",
//           }}
//         >
//           <FontAwesomeIcon icon={faCamera} style={{ marginRight: "5px" }} />
//           Capture Photo
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CameraCapture;


import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCameraRotate, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const CameraCapture = ({ closeCamera, onDataReceived }) => {
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const autoCaptureInterval = useRef(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 960 },
          aspectRatio: 4 / 3,
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
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageSrc = canvas.toDataURL("image/jpeg");

      onDataReceived(imageSrc); // Optional callback to pass the image back to the parent component
      await sendImageToBackend(imageSrc); // Send image to the backend

      stopCamera();
      closeCamera();
    }
  };

  const detectPrescription = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.videoWidth === 0 || video.videoHeight === 0) return false;

      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      let whitePixelCount = 0;
      let totalPixels = pixels.length / 4;

      // Count the number of "white-ish" pixels
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const brightness = (r + g + b) / 3;

        // Threshold for white detection
        if (brightness > 200) {
          whitePixelCount++;
        }
      }

      // If the proportion of white pixels is high, assume it's a prescription
      const whitePixelRatio = whitePixelCount / totalPixels;
      return whitePixelRatio > 0.5; // Adjust threshold as needed
    }
    return false;
  };

  const autoCapture = async () => {
    if (detectPrescription()) {
      console.log("Prescription detected! Capturing photo...");
      await captureImage();
      clearInterval(autoCaptureInterval.current); // Stop the auto-capture process
    }
  };

  const sendImageToBackend = async (imageSrc) => {
    try {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "captured_image.jpg");

      const response = await axios.post(
        "https://django-imageprocessing-api.vercel.app/api/imageprocess/getdata/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Backend Response:", response.data);
      onDataReceived(response.data); // Pass backend response to parent component if needed
    } catch (error) {
      console.error("Error sending image to backend:", error);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      autoCaptureInterval.current = setInterval(autoCapture, 1000); // Check every second
    }
    return () => clearInterval(autoCaptureInterval.current);
  }, []);

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
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

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
          <FontAwesomeIcon icon={faArrowLeft} size="2x" />
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

