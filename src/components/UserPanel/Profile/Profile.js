// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaEdit } from "react-icons/fa";
// import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth
// import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore"; // Firebase Firestore
// import "./Profile.css";

// // PopupDialog component
// const PopupDialog = ({ message, onClose }) => {
//   return (
//     <div className="popup-dialog">
//       <div className="popup-content">
//         <h4>{message}</h4>
//         <button className="close-popup-btn" onClick={onClose}>
//           OK
//         </button>
//       </div>
//     </div>
//   );
// };

// const ProfileForm = () => {
//   const navigate = useNavigate();
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupMessage, setPopupMessage] = useState("");
//   const [phoneError, setPhoneError] = useState("");
//   const [loading, setLoading] = useState(true); // To track loading state
//   const [formData, setFormData] = useState({
//     First_Name: "",
//     Last_Name: "",
//     Employee_ID: "",
//     Email: "",
//     Mobile_Number: "",
//     Circle: "",
//     Organization: "",
//   });
//   const [isEditable, setIsEditable] = useState({
//     Email: false,
//     Mobile_Number: false,
//   });

//   const auth = getAuth();
//   const db = getFirestore();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       onAuthStateChanged(auth, async (user) => {
//         if (user) {
//           const userId = user.uid;
//           console.log("Authenticated User ID:", userId); // Debugging log
//           try {
//             const userDocRef = doc(db, "users", userId);
//             const userDocSnap = await getDoc(userDocRef);

//             if (userDocSnap.exists()) {
//               console.log("User data fetched:", userDocSnap.data()); // Debugging log
//               setFormData(userDocSnap.data());
//               setLoading(false); // Stop loading once data is fetched
//             } else {
//               console.log("User document does not exist.");
//               setPopupMessage("User data not found.");
//               setShowPopup(true);
//               setLoading(false); // Stop loading even if no data is found
//             }
//           } catch (error) {
//             console.error("Error fetching user data:", error.message);
//             setPopupMessage("Failed to fetch user data.");
//             setShowPopup(true);
//             setLoading(false); // Stop loading on error
//           }
//         } else {
//           console.log("No authenticated user found.");
//           setPopupMessage("No authenticated user found.");
//           setShowPopup(true);
//           setLoading(false); // Stop loading if no user is found
//         }
//       });
//     };

//     fetchUserData();
//   }, [auth, db]);

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     if (id === "Mobile_Number") {
//       if (/^\d*$/.test(value) && value.length <= 10) {
//         setFormData((prevState) => ({
//           ...prevState,
//           [id]: value,
//         }));
//         setPhoneError("");
//       } else {
//         setPhoneError("Phone number must be numeric and up to 10 digits.");
//       }
//     } else {
//       setFormData((prevState) => ({
//         ...prevState,
//         [id]: value,
//       }));
//     }
//   };

//   const handleSaveChanges = async () => {
//     try {
//       const user = auth.currentUser;
//       if (user) {
//         const userId = user.uid;
//         const userDocRef = doc(db, "users", userId);
//         await updateDoc(userDocRef, {
//           Email: formData.Email,
//           Mobile_Number: formData.Mobile_Number,
//           Circle: formData.Circle,
//         });
//         setPopupMessage("Changes saved successfully!");
//         setShowPopup(true);
//       } else {
//         setPopupMessage("No authenticated user found.");
//         setShowPopup(true);
//       }
//     } catch (error) {
//       console.error("Error saving changes:", error.message);
//       setPopupMessage("Failed to save changes.");
//       setShowPopup(true);
//     }
//   };

//   const toggleEditField = (field) => {
//     setIsEditable((prevState) => ({
//       ...prevState,
//       [field]: !prevState[field],
//     }));
//   };

//   const handleChangePassword = () => {
//     navigate("/user-dashboard/change-password");
//   };

//   const handleClosePopup = () => {
//     setShowPopup(false);
//   };

//   // If loading, show a loading message
//   if (loading) {
//     return <p>Loading profile...</p>;
//   }

//   return (
//     <div className="profile-form-container">
//       <div className="profile-header">
//         <h2 className="profile-name">
//           {formData.First_Name} {formData.Last_Name}
//         </h2>
//       </div>
//       <form className="profile-form">
//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="First_Name">First Name</label>
//             <input
//               type="text"
//               id="First_Name"
//               value={formData.First_Name}
//               placeholder="First Name"
//               disabled
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="Last_Name">Last Name</label>
//             <input
//               type="text"
//               id="Last_Name"
//               value={formData.Last_Name}
//               placeholder="Last Name"
//               disabled
//             />
//           </div>
//         </div>
//         <div className="form-group">
//           <label htmlFor="Employee_ID">Employee ID</label>
//           <input
//             type="text"
//             id="Employee_ID"
//             value={formData.Employee_ID}
//             placeholder="Employee ID"
//             disabled
//           />
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="Email">Email Address</label>
//             <div className="input-wrapper">
//               <input
//                 type="email"
//                 id="Email"
//                 value={formData.Email}
//                 onChange={handleInputChange}
//                 disabled={!isEditable.Email}
//                 placeholder="Email Address"
//               />
//               <FaEdit
//                 className="edit-icon"
//                 onClick={() => toggleEditField("Email")}
//               />
//             </div>
//           </div>
//           <div className="form-group">
//             <label htmlFor="Mobile_Number">Phone Number</label>
//             <div className="input-wrapper">
//               <input
//                 type="tel"
//                 id="Mobile_Number"
//                 value={formData.Mobile_Number}
//                 onChange={handleInputChange}
//                 disabled={!isEditable.Mobile_Number}
//                 placeholder="Phone Number"
//               />
//               <FaEdit
//                 className="edit-icon"
//                 onClick={() => toggleEditField("Mobile_Number")}
//               />
//             </div>
//             {phoneError && <p className="error-message">{phoneError}</p>}
//           </div>
//         </div>
//         <div className="form-group">
//           <label htmlFor="Circle">Circle</label>
//           <input
//             type="text"
//             id="Circle"
//             value={formData.Circle}
//             onChange={handleInputChange}
//             placeholder="Circle"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="Organization">Organization</label>
//           <input
//             type="text"
//             id="Organization"
//             value={formData.Organization}
//             placeholder="Current Organization"
//             disabled
//           />
//         </div>

//         <div className="button-container">
//           <button
//             type="button"
//             className="save-changes-btn"
//             onClick={handleSaveChanges}
//           >
//             Save Changes
//           </button>
//           <button
//             type="button"
//             className="change-password-btn"
//             onClick={handleChangePassword}
//           >
//             Change Password
//           </button>
//         </div>
//       </form>

//       {showPopup && (
//         <PopupDialog message={popupMessage} onClose={handleClosePopup} />
//       )}
//     </div>
//   );
// };

// export default ProfileForm;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore"; // Firebase Firestore
import "./Profile.css";

// PopupDialog component
const PopupDialog = ({ message, onClose }) => {
  return (
    <div className="popup-dialog">
      <div className="popup-content">
        <h4>{message}</h4>
        <button className="close-popup-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

const ProfileForm = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(true); // To track loading state
  const [formData, setFormData] = useState({
    First_Name: "",
    Last_Name: "",
    Employee_ID: "",
    Email: "",
    Mobile_Number: "",
    Circle: "",
    Organization: "",
  });
  const [isEditable, setIsEditable] = useState({
    Email: false,
    Mobile_Number: false,
    Organization: false, // Add editable state for Organization
  });

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userId = user.uid;
          console.log("Authenticated User ID:", userId); // Debugging log
          try {
            const userDocRef = doc(db, "users", userId);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              console.log("User  data fetched:", userDocSnap.data()); // Debugging log
              setFormData(userDocSnap.data());
              setLoading(false); // Stop loading once data is fetched
            } else {
              console.log("User  document does not exist.");
              setPopupMessage("User  data not found.");
              setShowPopup(true);
              setLoading(false); // Stop loading even if no data is found
            }
          } catch (error) {
            console.error("Error fetching user data:", error.message);
            setPopupMessage("Failed to fetch user data.");
            setShowPopup(true);
            setLoading(false); // Stop loading on error
          }
        } else {
          console.log("No authenticated user found.");
          setPopupMessage("No authenticated user found.");
          setShowPopup(true);
          setLoading(false); // Stop loading if no user is found
        }
      });
    };

    fetchUserData();
  }, [auth, db]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "Mobile_Number") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setFormData((prevState) => ({
          ...prevState,
          [id]: value,
        }));
        setPhoneError("");
      } else {
        setPhoneError("Phone number must be numeric and up to 10 digits.");
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      const user = auth.currentUser ;
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
          Email: formData.Email,
          Mobile_Number: formData.Mobile_Number,
          Circle: formData.Circle,
          Organization: formData.Organization, // Include Organization in the update
        });
        setPopupMessage("Changes saved successfully!");
        setShowPopup(true);
      } else {
        setPopupMessage("No authenticated user found.");
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error saving changes:", error.message);
      setPopupMessage("Failed to save changes.");
      setShowPopup(true);
    }
  };

  const toggleEditField = (field) => {
    setIsEditable((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleChangePassword = () => {
    navigate("/user-dashboard/change-password");
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // If loading, show a loading message
  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-form-container">
      <div className="profile-header">
        <h2 className="profile-name">
          {formData.First_Name} {formData.Last_Name}
        </h2>
      </div>
      <form className="profile-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="First_Name">First Name</label>
            <input
              type="text"
              id="First_Name"
              value={formData.First_Name}
              placeholder="First Name"
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="Last_Name">Last Name</label>
            <input
              type="text"
              id="Last_Name"
              value={formData.Last_Name}
              placeholder="Last Name"
              disabled
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="Employee_ID">Employee ID</label>
          <input
            type="text"
            id="Employee_ID"
            value={formData.Employee_ID}
            placeholder="Employee ID"
            disabled
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="Email">Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="Email"
                value={formData.Email}
                onChange={handleInputChange}
                disabled={!isEditable.Email}
                placeholder="Email Address"
              />
              <FaEdit
                className="edit-icon"
                onClick={() => toggleEditField("Email")}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="Mobile_Number">Phone Number</label>
            <div className="input-wrapper">
              <input
                type="tel"
                id="Mobile_Number"
                value={formData.Mobile_Number}
                onChange={handleInputChange}
                disabled={!isEditable.Mobile_Number}
                placeholder="Phone Number"
              />
              <FaEdit
                className="edit-icon"
                onClick={() => toggleEditField("Mobile_Number")}
              />
            </div>
            {phoneError && <p className="error-message">{phoneError}</p>}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="Circle">Circle</label>
          <input
            type="text"
            id="Circle"
            value={formData.Circle}
            onChange={handleInputChange}
            placeholder="Circle"
          />
        </div>
        <div className="form-group">
          <label htmlFor="Organization">Organization</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="Organization"
              value={formData.Organization}
              onChange={handleInputChange}
              placeholder="Current Organization"
              disabled={!isEditable.Organization} // Make it editable
            />
            <FaEdit
              className="edit-icon"
              onClick={() => toggleEditField("Organization")}
            />
          </div>
        </div>

        <div className="button-container">
          <button
            type="button"
            className="save-changes-btn"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
          <button
            type="button"
            className="change-password-btn"
            onClick={handleChangePassword}
          >
            Change Password
          </button>
        </div>
      </form>

      {showPopup && (
        <PopupDialog message={popupMessage} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default ProfileForm;
