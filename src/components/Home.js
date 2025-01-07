// import React, { useEffect, useState } from "react";
// import About from "./About";
// import Contact from "./Contact";
// import CameraCapture from "./CameraCapture";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCamera, faUser, faCalendarAlt, faPills, faClock } from "@fortawesome/free-solid-svg-icons";

// const Home = () => {
//   const [loggedInUser, setLoggedInUser] = useState("");
//   const [isCameraVisible, setIsCameraVisible] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [responseData, setResponseData] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedResponseData, setEditedResponseData] = useState({});

//   useEffect(() => {
//     const user = localStorage.getItem("loggedInUser");
//     setLoggedInUser(user);
//   }, []);

//   const toggleCamera = () => {
//     setIsCameraVisible(true);
//   };

//   const handleDataReceived = (data) => {
//     setCapturedImage(data.image);
//     setResponseData(data.response);
//     setEditedResponseData(data.response);
//     setIsCameraVisible(false);
//     console.log(data);
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//   };

//   const handleSaveEdit = () => {
//     setResponseData(editedResponseData);
//     setIsEditing(false);
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
//         return { ...prevData, [key]: value };
//       }
//     });
//   };

//   const handleTimingChange = (e, medicationIndex, timingKey) => {
//     const isChecked = e.target.checked;
//     setEditedResponseData((prevData) => {
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
//   };

//   return (
//     <>
//       {!isCameraVisible && (
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
//         />
//       )}
//       {capturedImage && (
//         <div className="home-captured-image-display">
//           <div className="home-captured-image-header">
//             <h2 className="home-captured-image-title">Captured Image:</h2>
//             <button
//               className="home-remove-image-button"
//               onClick={handleRemoveImage}
//             >
//               Remove Image
//             </button>
//           </div>

//           <img src={capturedImage} alt="Captured" className="home-captured-image" />
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
//                     <FontAwesomeIcon icon={faUser} className="home-icon"/>
//                     Patient Name:
//                   </label>
//                   <input
//                     type="text"
//                     className="home-form-input"
//                     value={editedResponseData.patient_name}
//                     onChange={(e) =>
//                       handleInputChange(e, "patient_name", "patient_name")
//                     }
//                   />
//                 </div>
//                 <div className="home-form-group">
//                   <label className="home-form-label">
//                     <FontAwesomeIcon icon={faCalendarAlt} className="home-icon"/>
//                     Date:
//                   </label>
//                   <input
//                     type="text"
//                     className="home-form-input"
//                     value={editedResponseData.date}
//                     onChange={(e) => handleInputChange(e, "date", "date")}
//                   />
//                 </div>
//                 <h3 className="home-medication-title">
//                   <FontAwesomeIcon icon={faPills} className="home-icon"/>
//                   Medications:
//                 </h3>
//                 <ul className="home-medication-list">
//                   {editedResponseData.medications &&
//                     editedResponseData.medications.map((medication, index) => (
//                       <li key={index} className="home-medication-item">
//                         <div className="home-medication-name">
//                           <label className="home-form-label">
//                             Name:
//                             <input
//                               type="text"
//                               className="home-form-input"
//                               value={medication.name}
//                               onChange={(e) =>
//                                 handleInputChange(e, "medications", index)
//                               }
//                             />
//                           </label>
//                         </div>
//                         <div className="home-medication-timing">
//                           <label className="home-form-label">
//                             <FontAwesomeIcon icon={faClock} className="home-icon"/>
//                             Timing:
//                              {Object.entries(medication.timing).map(
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
//                   <button className="home-save-button" onClick={handleSaveEdit}>
//                     Save
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
//                   <strong>Patient Name:</strong> {responseData.patient_name}
//                 </p>
//                 <p className="home-details-text">
//                   <strong>Date:</strong> {responseData.date}
//                 </p>
//                 <h3 className="home-medication-title">Medications:</h3>
//                 <ul className="home-medication-list">
//                   {responseData.medications &&
//                     responseData.medications.map((medication, index) => (
//                       <li key={index} className="home-medication-item">
//                         <p className="home-details-text">
//                           <strong>Name:</strong> {medication.name}
//                         </p>
//                         <p className="home-details-text">
//                           <strong>Timing:</strong>{" "}
//                           {Object.entries(medication.timing)
//                             .filter(([_, value]) => value)
//                             .map(([key]) =>
//                               key.charAt(0).toUpperCase() + key.slice(1)
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
//                 eiusmod tempor incididunt ut labore et dolore magna aliqua.
//                 Duis aute irure dolor in reprehenderit asperiores dolores sed
//                 et. Tenetur quia eos. Autem tempore quibusdam vel necessitatibus
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
//       <section id="about" style={{ padding: "50px 20px", backgroundColor: "#f8f9fa" }}>
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
import { faCamera, faUser, faCalendarAlt, faPills, faClock } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResponseData, setEditedResponseData] = useState({});
    const [isApiLoading, setIsApiLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    setLoggedInUser(user);
  }, []);

  const toggleCamera = () => {
    setIsCameraVisible(true);
  };

  const handleDataReceived = (data) => {
    setCapturedImage(data.image);
    setResponseData(data.response);
    setEditedResponseData(data.response);
    setIsCameraVisible(false);
      setIsApiLoading(false); // Request complete
    console.log(data);
  };
    const handleApiLoading = () => {
        setIsApiLoading(true);
    }


  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    setResponseData(editedResponseData);
    setIsEditing(false);
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
  };

  return (
    <>
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
            onApiLoading = {handleApiLoading}
            isDisabled = {isApiLoading}
        />
      )}
      {capturedImage && (
        <div className="home-captured-image-display">
          <div className="home-captured-image-header">
            <h2 className="home-captured-image-title">Captured Image:</h2>
            {/* <button
              className="home-remove-image-button"
              onClick={handleRemoveImage}
            >
              Remove Image
            </button> */}
          </div>

          <img src={capturedImage} alt="Captured" className="home-captured-image" />
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
                    <FontAwesomeIcon icon={faUser} className="home-icon"/>
                    Patient Name:
                  </label>
                  <input
                    type="text"
                    className="home-form-input"
                    value={editedResponseData.patient_name}
                    onChange={(e) =>
                      handleInputChange(e, "patient_name", "patient_name")
                    }
                  />
                </div>
                <div className="home-form-group">
                  <label className="home-form-label">
                    <FontAwesomeIcon icon={faCalendarAlt} className="home-icon"/>
                    Date:
                  </label>
                  <input
                    type="text"
                    className="home-form-input"
                    value={editedResponseData.date}
                    onChange={(e) => handleInputChange(e, "date", "date")}
                  />
                </div>
                <h3 className="home-medication-title">
                  <FontAwesomeIcon icon={faPills} className="home-icon"/>
                  Medications:
                </h3>
                <ul className="home-medication-list">
                  {editedResponseData.medications &&
                    editedResponseData.medications.map((medication, index) => (
                      <li key={index} className="home-medication-item">
                        <div className="home-medication-name">
                          <label className="home-form-label">
                            Name:
                            <input
                              type="text"
                              className="home-form-input"
                              value={medication.name}
                              onChange={(e) =>
                                handleInputChange(e, "medications", index)
                              }
                            />
                          </label>
                        </div>
                        <div className="home-medication-timing">
                          <label className="home-form-label">
                            <FontAwesomeIcon icon={faClock} className="home-icon"/>
                            Timing:
                             {Object.entries(medication.timing).map(
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
                  <button className="home-save-button" onClick={handleSaveEdit}>
                    Save
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
                  <strong>Patient Name:</strong> {responseData.patient_name}
                </p>
                <p className="home-details-text">
                  <strong>Date:</strong> {responseData.date}
                </p>
                <h3 className="home-medication-title">Medications:</h3>
                <ul className="home-medication-list">
                  {responseData.medications &&
                    responseData.medications.map((medication, index) => (
                      <li key={index} className="home-medication-item">
                        <p className="home-details-text">
                          <strong>Name:</strong> {medication.name}
                        </p>
                        <p className="home-details-text">
                          <strong>Timing:</strong>{" "}
                          {Object.entries(medication.timing)
                            .filter(([_, value]) => value)
                            .map(([key]) =>
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
              className="home-remove-image-button"
              onClick={handleRemoveImage}
            >
              Remove
            </button> 
            <button className="home-edit-button-save" onClick={handleSaveEdit}>
                    Save
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
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Duis aute irure dolor in reprehenderit asperiores dolores sed
                et. Tenetur quia eos. Autem tempore quibusdam vel necessitatibus
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
      <section id="about" style={{ padding: "50px 20px", backgroundColor: "#f8f9fa" }}>
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