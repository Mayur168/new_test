// import React, { useEffect, useState } from "react";
// import About from "./About";
// import Contact from "./Contact";
// import CameraCapture from "./CameraCapture";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faCamera,
//   faUser,
//   faCalendarAlt,
//   faPills,
//   faClock,
// } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { handleError } from "../utils";

// const Home = () => {
//   const [loggedInUser, setLoggedInUser] = useState("");
//   const [isCameraVisible, setIsCameraVisible] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [responseData, setResponseData] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedResponseData, setEditedResponseData] = useState({});
//   const [isApiLoading, setIsApiLoading] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false); // Changed
//   const [capturedImageSize, setCapturedImageSize] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(""); // added success message to the state
//   const navigate = useNavigate();

//   useEffect(() => {
//     const user = localStorage.getItem("loggedInUser");
//     setLoggedInUser(user);
//   }, []);

//   const toggleCamera = () => {
//     setIsCameraVisible(true);
//   };

//   const handleDataReceived = async (data) => {
//     setIsApiLoading(true);
//     setCapturedImage(data.image);
//     setResponseData(data.response);
//     setEditedResponseData({ ...data.response, id: data.response.id });
//     setIsCameraVisible(false);
//     setIsApiLoading(false);
//     calculateImageSize(data.image);
//   };

//   const handleApiLoading = () => {
//     setIsApiLoading(true);
//   };

//   const handleEdit = async () => {
//     setIsApiLoading(true);
//     try {
//       setIsEditing(true);
//       setIsApiLoading(false);
//     } catch (error) {
//       console.error("Error getting the data:", error);
//       setIsApiLoading(false);
//       handleError(
//         error.response?.data?.message || "An unexpected error occurred."
//       );
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setIsApiLoading(false);
//     setSuccessMessage("");
//   };

//   const handleSaveEdit = async () => {
//     setIsApiLoading(true);
//     try {
//       const response = await sendEditedDataToBackend(editedResponseData);
//       if (response && response.data) {
//         setResponseData(editedResponseData);
//         setIsEditing(false);
//         setIsApiLoading(false);
//           setSuccessMessage("Data saved successfully.");// set the success message
//         setShowSuccess(true); // Show the success message
//         setTimeout(() => {
//           setShowSuccess(false); // Hide the success message
//           navigate("/");
//         }, 2000);
//       } else {
//         setIsApiLoading(false);
//         setSuccessMessage("Failed to save data.");
//         handleError("An unexpected error occurred during saving.");
//       }
//     } catch (error) {
//       console.error("Error sending image to backend:", error);
//       setIsApiLoading(false);
//       setSuccessMessage("Failed to save data.");
//       handleError(
//         error.response?.data?.message || "An unexpected error occurred."
//       );
//     }
//   };

//   const sendEditedDataToBackend = async (data) => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const response = await axios.post(
//         `https://bharati-clinic-test.vercel.app/prescription/`,
//         {
//           action: "postPrescriptionRecord",
//           ...data,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       return response;
//     } catch (error) {
//       console.error("Error sending updated data to backend:", error);
//       throw error;
//     }
//   };

//   const calculateImageSize = async (imageSrc) => {
//     try {
//       const response = await fetch(imageSrc);
//       const blob = await response.blob();
//       const sizeInBytes = blob.size;
//       const sizeInKB = sizeInBytes / 1024;
//       let formattedSize;
//       if (sizeInKB > 1024) {
//         formattedSize = (sizeInKB / 1024).toFixed(2) + " MB";
//       } else {
//         formattedSize = sizeInKB.toFixed(2) + " KB";
//       }
//       setCapturedImageSize(formattedSize);
//     } catch (error) {
//       console.error("Error calculating image size:", error);
//       setCapturedImageSize(null);
//     }
//   };
//   const handleInputChange = (e, section, key) => {
//     const { value } = e.target;
//     setEditedResponseData((prevData) => {
//       if (section === "medications") {
//         const newMedications = prevData.medications.map((med, index) => {
//           if (index === parseInt(key)) {
//             return { ...med, name: value };
//           }
//           return med;
//         });
//         return { ...prevData, medications: newMedications };
//       } else {
//         return { ...prevData, [key]: value }; // Corrected update logic for other fields
//       }
//     });
//   };

//   const handleTimingChange = (e, medicationIndex, timingKey) => {
//     const isChecked = e.target.checked;
//     setEditedResponseData((prevData) => {
//       if (!prevData || !prevData.medications || !prevData.medications[medicationIndex]) {
//         return prevData;
//       }
//       const newMedications = prevData.medications.map((med, index) => {
//         if (index === medicationIndex) {
//           return { ...med, timing: { ...med.timing, [timingKey]: isChecked } };
//         }
//         return med;
//       });
//       return { ...prevData, medications: newMedications };
//     });
//   };

//   const handleRemoveImage = () => {
//     setCapturedImage(null);
//     setResponseData(null);
//     setEditedResponseData({});
//     setIsApiLoading(false);
//     setCapturedImageSize(null);
//   };
//   const handlePostImage = async () => {
//     if (responseData) {
//       setIsApiLoading(true);
//       try {
//         const accessToken = localStorage.getItem("accessToken");
//         await axios.post(
//           "https://bharati-clinic-test.vercel.app/prescription/",
//           {
//             action: "postPrescriptionRecord",
//             ...responseData,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );
//         setCapturedImage(null);
//         setResponseData(null);
//         setEditedResponseData({});
//         setIsApiLoading(false);
//         setCapturedImageSize(null);
//         setSuccessMessage("Data posted successfully!");
//         setShowSuccess(true); // Show success message
//         setTimeout(() => {
//           setShowSuccess(false); // Hide success message
//           navigate("/");
//         }, 2000);
//       } catch (error) {
//         console.error("Error sending image to backend:", error);
//         setIsApiLoading(false);
//         setSuccessMessage("Failed to post data.");
//         handleError(
//           error.response?.data?.message || "An unexpected error occurred."
//         );
//       }
//     } else {
//       handleError("No data to post. Please capture an image first.");
//     }
//   };

//   const renderSuccessModal = () => {
//       if (!showSuccess) return null;
//       return (
//           <div className="home-success-modal-overlay">
//               <div className="home-success-modal">
//                   <p>{successMessage}</p>
//               </div>
//           </div>
//       );
//   };

//   return (
//     <>
//       {renderSuccessModal()}
//       {!isCameraVisible && !capturedImage && !isApiLoading && (
//         <div className="home-camera-button-container">
//           <button className="home-camera-toggle" onClick={toggleCamera}>
//             <FontAwesomeIcon icon={faCamera} style={{ fontSize: "1.5rem" }} />
//           </button>
//         </div>
//       )}

//       {isCameraVisible && (
//         <CameraCapture
//           closeCamera={() => setIsCameraVisible(false)}
//           onResponseReceived={handleDataReceived}
//           onApiLoading={handleApiLoading}
//           isDisabled={isApiLoading}
//         />
//       )}
//       {capturedImage && (
//         <div className="home-captured-image-display">
//           <div className="home-captured-image-header">
//             <h2 className="home-captured-image-title">Captured Image:</h2>
//           </div>

//           <img
//             src={capturedImage}
//             alt="Captured"
//             className="home-captured-image"
//           />
//         </div>
//       )}

//       {responseData && (
//         <div className="home-response-display">
//           <h2 className="home-prescription-title">Prescription Details</h2>
//           <div className="home-prescription-container">
//             {isEditing ? (
//               <form className="home-edit-form">
//                 <div className="home-form-group">
//                   <label className="home-form-label">
//                     <FontAwesomeIcon icon={faUser} className="home-icon" />
//                     Patient Name:
//                   </label>
//                   <input
//                     type="text"
//                     className="home-form-input"
//                     value={editedResponseData?.patient_name || ""}
//                     onChange={(e) =>
//                       handleInputChange(e, null, "patient_name")
//                     }
//                   />
//                 </div>
//                 <div className="home-form-group">
//                   <label className="home-form-label">
//                     <FontAwesomeIcon
//                       icon={faCalendarAlt}
//                       className="home-icon"
//                     />
//                     Date:
//                   </label>
//                   <input
//                     type="text"
//                     className="home-form-input"
//                     value={editedResponseData?.prescription_date || ""}
//                     onChange={(e) => handleInputChange(e, null, "prescription_date")} // Corrected date key here
//                   />
//                 </div>
//                 <h3 className="home-medication-title">
//                   <FontAwesomeIcon icon={faPills} className="home-icon" />
//                   Medications:
//                 </h3>
//                 <ul className="home-medication-list">
//                   {editedResponseData?.medications &&
//                     editedResponseData.medications.map((medication, index) => (
//                       <li key={index} className="home-medication-item">
//                         <div className="home-medication-name">
//                           <label className="home-form-label">
//                             Name:
//                             <input
//                               type="text"
//                               className="home-form-input"
//                               value={medication?.name || ""}
//                               onChange={(e) =>
//                                 handleInputChange(e, "medications", index)
//                               }
//                             />
//                           </label>
//                         </div>
//                         <div className="home-medication-timing">
//                           <label className="home-form-label">
//                             <FontAwesomeIcon
//                               icon={faClock}
//                               className="home-icon"
//                             />
//                             Timing:
//                             {Object.entries(medication?.timing || {}).map(
//                               ([key, value]) => (
//                                 <label key={key} className="home-timing-label">
//                                   <input
//                                     type="checkbox"
//                                     className="home-timing-checkbox"
//                                     checked={value}
//                                     onChange={(e) =>
//                                       handleTimingChange(e, index, key)
//                                     }
//                                   />
//                                   {key.charAt(0).toUpperCase() + key.slice(1)}
//                                 </label>
//                               )
//                             )}
//                           </label>
//                         </div>
//                       </li>
//                     ))}
//                 </ul>
//                 <div className="home-save-cancel-container">
//                   <button
//                     className="home-save-button"
//                     type="button"
//                     onClick={handleSaveEdit}
//                   >
//                     submit
//                   </button>
//                   <button
//                     className="home-cancel-button"
//                     onClick={handleCancelEdit}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             ) : (
//               <div>
//                 <p className="home-details-text">
//                   <strong>Patient Name:</strong> {responseData?.patient_name || "N/A"}
//                 </p>
//                 <p className="home-details-text">
//                   <strong>Date:</strong> {responseData?.prescription_date || "N/A"}
//                 </p>
//                 <h3 className="home-medication-title">Medications:</h3>
//                 <ul className="home-medication-list">
//                   {responseData?.medications &&
//                     responseData.medications.map((medication, index) => (
//                       <li key={index} className="home-medication-item">
//                         <p className="home-details-text">
//                           <strong>Name:</strong> {medication?.name || "N/A"}
//                         </p>
//                         <p className="home-details-text">
//                           <strong>Timing:</strong>{" "}
//                           {Object.entries(medication?.timing || {})
//                             .filter(([_, value]) => value)
//                             .map(
//                               ([key]) =>
//                                 key.charAt(0).toUpperCase() + key.slice(1)
//                             )
//                             .join(", ")}
//                         </p>
//                       </li>
//                     ))}
//                 </ul>
//                 <div className="home-edit-button-container">
//                   <button className="home-edit-button" onClick={handleEdit}>
//                     Edit
//                   </button>
//                   <button
//                     className="home-post-button"
//                     onClick={handlePostImage}
//                   >
//                     Post
//                   </button>
//                   <button
//                     className="home-remove-image-button"
//                     onClick={handleRemoveImage}
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Hero Section */}
//       <section className="hero-section">
//         <div className="hero-content">
//           <div className="hero-text">
//             <h1>Welcome to Medilab</h1>
//             <p>Your trusted medical care provider.</p>
//           </div>

//           {/* Cards Section */}
//           <div className="cards-section">
//             <div className="card" style={{ backgroundColor: "#1c75c4" }}>
//               <h2>Why Choose Medilab</h2>
//               <p>
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
//                 eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis
//                 aute irure dolor in reprehenderit asperiores dolores sed et.
//                 Tenetur quia eos. Autem tempore quibusdam vel necessitatibus
//                 optio ad corporis.
//               </p>
//               <a href="#about" className="learn-more-btn">
//                 Learn More
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* About Section */}
//       <section
//         id="about"
//         style={{ padding: "50px 20px", backgroundColor: "#f8f9fa" }}
//       >
//         <About />
//       </section>

//       {/* Contact Section */}
//       <section id="contact" style={{ padding: "50px 20px" }}>
//         <Contact />
//       </section>
//     </>
//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";
import About from "./About";
import Contact from "./Contact";
import CameraCapture from "./CameraCapture";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faUser,
  faCalendarAlt,
  faPills,
  faClock,
  faVenusMars,
  faWeight,
  faHeartPulse,
  faLocationDot,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { handleError } from "../utils";

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResponseData, setEditedResponseData] = useState({});
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [capturedImageSize, setCapturedImageSize] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    setLoggedInUser(user);
  }, []);

  const toggleCamera = () => {
    setIsCameraVisible(true);
  };

  const handleDataReceived = async (data) => {
    setIsApiLoading(true);
    setCapturedImage(data.image);
    setResponseData(data.response);
    setEditedResponseData({ ...data.response, id: data.response.id });
    setIsCameraVisible(false);
    setIsApiLoading(false);
    calculateImageSize(data.image);
  };

  const handleApiLoading = () => {
    setIsApiLoading(true);
  };

  const handleEdit = async () => {
    setIsApiLoading(true);
    try {
      setIsEditing(true);
      setIsApiLoading(false);
    } catch (error) {
      console.error("Error getting the data:", error);
      setIsApiLoading(false);
      handleError(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsApiLoading(false);
    setSuccessMessage("");
  };

  const handleSaveEdit = async () => {
    setIsApiLoading(true);
    try {
      const response = await sendEditedDataToBackend(editedResponseData);
      if (response && response.data) {
        setResponseData(editedResponseData);
        setIsEditing(false);
        setIsApiLoading(false);
        setSuccessMessage("Data saved successfully.");
        setShowSuccess(true); // Show the success message
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/");
        }, 2000);
      } else {
        setIsApiLoading(false);
        setSuccessMessage("Failed to save data.");
        handleError("An unexpected error occurred during saving.");
      }
    } catch (error) {
      console.error("Error sending image to backend:", error);
      setIsApiLoading(false);
      setSuccessMessage("Failed to save data.");
      handleError(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  const sendEditedDataToBackend = async (data) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        `https://bharati-clinic-test.vercel.app/prescription/`,
        {
          action: "postPrescriptionRecord",
          ...data,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error sending updated data to backend:", error);
      throw error;
    }
  };
  const calculateImageSize = async (imageSrc) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const sizeInBytes = blob.size;
      const sizeInKB = sizeInBytes / 1024;
      let formattedSize;
      if (sizeInKB > 1024) {
        formattedSize = (sizeInKB / 1024).toFixed(2) + " MB";
      } else {
        formattedSize = sizeInKB.toFixed(2) + " KB";
      }
      setCapturedImageSize(formattedSize);
    } catch (error) {
      console.error("Error calculating image size:", error);
      setCapturedImageSize(null);
    }
  };
  const handleInputChange = (e, section, key) => {
    const { value } = e.target;
    setEditedResponseData((prevData) => {
      if (section === "medications") {
        const newMedications = prevData.medications.map((med, index) => {
          if (index === parseInt(key)) {
            return { ...med, name: value };
          }
          return med;
        });
        return { ...prevData, medications: newMedications };
      } else {
        return { ...prevData, [key]: value };
      }
    });
  };

  const handleTimingChange = (e, medicationIndex, timingKey) => {
    const isChecked = e.target.checked;
    setEditedResponseData((prevData) => {
      if (
        !prevData ||
        !prevData.medications ||
        !prevData.medications[medicationIndex]
      ) {
        return prevData;
      }
      const newMedications = prevData.medications.map((med, index) => {
        if (index === medicationIndex) {
          return { ...med, timing: { ...med.timing, [timingKey]: isChecked } };
        }
        return med;
      });
      return { ...prevData, medications: newMedications };
    });
  };

  const handleRemoveImage = () => {
    setCapturedImage(null);
    setResponseData(null);
    setEditedResponseData({});
    setIsApiLoading(false);
    setCapturedImageSize(null);
  };
  const handlePostImage = async () => {
    if (responseData) {
      setIsApiLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        await axios.post(
          "https://bharati-clinic-test.vercel.app/prescription/",
          {
            action: "postPrescriptionRecord",
            ...responseData,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setCapturedImage(null);
        setResponseData(null);
        setEditedResponseData({});
        setIsApiLoading(false);
        setCapturedImageSize(null);
        setSuccessMessage("Data posted successfully!");
        setShowSuccess(true); // Show success message
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/");
        }, 2000);
      } catch (error) {
        console.error("Error sending image to backend:", error);
        setIsApiLoading(false);
        setSuccessMessage("Failed to post data.");
        handleError(
          error.response?.data?.message || "An unexpected error occurred."
        );
      }
    } else {
      handleError("No data to post. Please capture an image first.");
    }
  };
  const renderSuccessModal = () => {
    if (!showSuccess) return null;
    return (
      <div className="home-success-modal-overlay">
        <div className="home-success-modal">
          <p>{successMessage}</p>
        </div>
      </div>
    );
  };
  return (
    <>
      {renderSuccessModal()}
      {!isCameraVisible && !capturedImage && !isApiLoading && (
        <div className="home-camera-button-container">
          <button className="home-camera-toggle" onClick={toggleCamera}>
            <FontAwesomeIcon icon={faCamera} style={{ fontSize: "1.5rem" }} />
          </button>
        </div>
      )}

      {isCameraVisible && (
        <CameraCapture
          closeCamera={() => setIsCameraVisible(false)}
          onResponseReceived={handleDataReceived}
          onApiLoading={handleApiLoading}
          isDisabled={isApiLoading}
        />
      )}
      {capturedImage && (
        <div className="home-captured-image-display">
          <div className="home-captured-image-header">
            <h2 className="home-captured-image-title">Captured Image:</h2>
          </div>

          <img
            src={capturedImage}
            alt="Captured"
            className="home-captured-image"
          />
        </div>
      )}

      {responseData && (
        <div className="home-response-display">
          <h2 className="home-prescription-title">Prescription Details</h2>
          <div className="home-prescription-container">
            {isEditing ? (
              <form className="home-edit-form">
                <div className="home-form-group">
                  <label className="home-form-label">
                    <FontAwesomeIcon icon={faUser} className="home-icon" />
                    Patient Name:
                  </label>
                  <input
                    type="text"
                    className="home-form-input"
                    value={editedResponseData?.patient_name || ""}
                    onChange={(e) => handleInputChange(e, null, "patient_name")}
                  />
                </div>

                {/* <div className="home-form-group">
                  <label className="home-form-label">
                    <FontAwesomeIcon icon={faVenusMars} className="home-icon" />
                    Gender:
                  </label>
                  <input
                    type="text"
                    className="home-form-input"
                    value={editedResponseData?.gender || ""}
                    onChange={(e) => handleInputChange(e, null, "gender")}
                  />
                </div> */}
                <div className="home-form-group">
                  <label className="home-form-label">
                    <FontAwesomeIcon icon={faVenusMars} className="home-icon" />
                    Gender:
                  </label>
                  <select
                    className="home-form-input"
                    value={editedResponseData?.gender || ""}
                    onChange={(e) => handleInputChange(e, null, "gender")}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="home-form-group">
                  <label className="home-form-label">
                    <FontAwesomeIcon icon={faUser} className="home-icon" />
                    Age:
                  </label>
                  <input
                    type="number"
                    className="home-form-input"
                    value={editedResponseData?.age || ""}
                    onChange={(e) => handleInputChange(e, null, "age")}
                  />
                </div>
                {/* <div className="home-form-group">
                  <label className="home-form-label">
                    <FontAwesomeIcon icon={faWeight} className="home-icon" />
                    Weight:
                  </label>
                  <input
                    type="text"
                    className="home-form-input"
                    value={editedResponseData?.weight || ""}
                    onChange={(e) => handleInputChange(e, null, "weight")}
                  />
                </div> */}
                <div className="home-form-group">
                  <label className="home-form-label">
                    <FontAwesomeIcon icon={faWeight} className="home-icon" />
                    Weight (kg):
                  </label>
                  <input
                    type="number"
                    className="home-form-input"
                    value={editedResponseData?.weight || ""}
                    onChange={(e) => handleInputChange(e, null, "weight")}
                    min="0"
                    step="1"
                  />
                </div>
                <div className="home-form-group">
                  <label className="home-form-label">
                    <FontAwesomeIcon
                      icon={faHeartPulse}
                      className="home-icon"
                    />
                    B/P:
                  </label>
                  <input
                    type="text"
                    className="home-form-input"
                    value={editedResponseData?.bp || ""}
                    onChange={(e) => handleInputChange(e, null, "bp")}
                  />
                </div>

                <div className="home-form-group">
                  <label className="home-form-label">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="home-icon"
                    />
                    Place:
                  </label>
                  <input
                    type="text"
                    className="home-form-input"
                    value={editedResponseData?.place || ""}
                    onChange={(e) => handleInputChange(e, null, "place")}
                  />
                </div>
                <div className="home-form-group">
                  <label className="home-form-label">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="home-icon"
                    />
                    Prescription Date:
                  </label>
                  <input
                    type="text"
                    className="home-form-input"
                    value={editedResponseData?.prescription_date}
                    placeholder="YYYY/MM/DD"
                    onChange={(e) =>
                      handleInputChange(e, null, "prescription_date")
                    }
                  />
                </div>
                <div className="home-form-group">
                  <label className="home-form-label">
                    <FontAwesomeIcon
                      icon={faCalendarDay}
                      className="home-icon"
                    />
                    Follow up date:
                  </label>
                  <input
                    type="date"
                    className="home-form-input"
                    value={editedResponseData?.follow_up_date || ""}
                    placeholder="YYYY/MM/DD"
                    onChange={(e) =>
                      handleInputChange(e, null, "follow_up_date")
                    }
                  />
                </div>

                {/* <div className="home-form-group">
                  <label className="home-form-label">
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="home-icon"
                    />
                    Prescription Date:
                  </label>
                  <input
                    type="text"
                    className="home-form-input"
                    value={editedResponseData?.prescription_date || ""}
                    onChange={(e) => handleInputChange(e, null, "prescription_date")}
                  />
                </div>  */}
                <div className="home-form-group">
                  <label className="home-form-label">
                    <FontAwesomeIcon icon={faUser} className="home-icon" />
                    Complaints:
                  </label>
                  <input
                    type="text"
                    className="home-form-input"
                    value={editedResponseData?.complaints || ""}
                    onChange={(e) => handleInputChange(e, null, "complaints")}
                  />
                </div>

                <h3 className="home-medication-title">
                  <FontAwesomeIcon icon={faPills} className="home-icon" />
                  Medications:
                </h3>
                <ul className="home-medication-list">
                  {editedResponseData?.medications &&
                    editedResponseData.medications.map((medication, index) => (
                      <li key={index} className="home-medication-item">
                        <div className="home-medication-name">
                          <label className="home-form-label">
                            Name:
                            <input
                              type="text"
                              className="home-form-input"
                              value={medication?.name || ""}
                              onChange={(e) =>
                                handleInputChange(e, "medications", index)
                              }
                            />
                          </label>
                        </div>
                        <div className="home-medication-timing">
                          <label className="home-form-label">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="home-icon"
                            />
                            Timing:
                            {Object.entries(medication?.timing || {}).map(
                              ([key, value]) => (
                                <label key={key} className="home-timing-label">
                                  <input
                                    type="checkbox"
                                    className="home-timing-checkbox"
                                    checked={value}
                                    onChange={(e) =>
                                      handleTimingChange(e, index, key)
                                    }
                                  />
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                              )
                            )}
                          </label>
                        </div>
                      </li>
                    ))}
                </ul>
                <div className="home-save-cancel-container">
                  <button
                    className="home-save-button"
                    type="button"
                    onClick={handleSaveEdit}
                  >
                    submit
                  </button>
                  <button
                    className="home-cancel-button"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p className="home-details-text">
                  <strong>Patient Name:</strong>{" "}
                  {responseData?.patient_name || "N/A"}
                </p>
                <p className="home-details-text">
                  <strong>Gender:</strong> {responseData?.gender || ""}
                </p>
                <p className="home-details-text">
                  <strong>Age:</strong> {responseData?.age || "N/A"}
                </p>
                <p className="home-details-text">
                  <strong>Weight:</strong> {responseData?.weight || "N/A"}
                </p>
                <p className="home-details-text">
                  <strong>B/P:</strong> {responseData?.bp || "N/A"}
                </p>
                <p className="home-details-text">
                  <strong>Place:</strong> {responseData?.place || "N/A"}
                </p>
                <p className="home-details-text">
                  <strong>Prescription Date:</strong>{" "}
                  {responseData?.prescription_date}
                </p>
                <p className="home-details-text">
                  <strong>Follow up date:</strong>{" "}
                  {responseData?.follow_up_date}
                </p>

                {/* <p className="home-details-text">
                    <strong>Prescription Date:</strong> {responseData?.prescription_date || "N/A"}
                  </p>  */}

                <p className="home-details-text">
                  <strong>Complaints:</strong>{" "}
                  {responseData?.complaints || "N/A"}
                </p>

                <h3 className="home-medication-title">Medications:</h3>
                <ul className="home-medication-list">
                  {responseData?.medications &&
                    responseData.medications.map((medication, index) => (
                      <li key={index} className="home-medication-item">
                        <p className="home-details-text">
                          <strong>Name:</strong> {medication?.name || "N/A"}
                        </p>
                        <p className="home-details-text">
                          <strong>Timing:</strong>{" "}
                          {Object.entries(medication?.timing || {})
                            .filter(([_, value]) => value)
                            .map(
                              ([key]) =>
                                key.charAt(0).toUpperCase() + key.slice(1)
                            )
                            .join(", ")}
                        </p>
                      </li>
                    ))}
                </ul>
                <div className="home-edit-button-container">
                  <button className="home-edit-button" onClick={handleEdit}>
                    Edit
                  </button>
                  <button
                    className="home-post-button"
                    onClick={handlePostImage}
                  >
                    Post
                  </button>
                  <button
                    className="home-remove-image-button"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to Medilab</h1>
            <p>Your trusted medical care provider.</p>
          </div>

          {/* Cards Section */}
          <div className="cards-section">
            <div className="card" style={{ backgroundColor: "#1c75c4" }}>
              <h2>Why Choose Medilab</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis
                aute irure dolor in reprehenderit asperiores dolores sed et.
                Tenetur quia eos. Autem tempore quibusdam vel necessitatibus
                optio ad corporis.
              </p>
              <a href="#about" className="learn-more-btn">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        style={{ padding: "50px 20px", backgroundColor: "#f8f9fa" }}
      >
        <About />
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ padding: "50px 20px" }}>
        <Contact />
      </section>
    </>
  );
};

export default Home;
