// // import React, { useState, useEffect } from 'react';
// // import './NewTicket.css';
// // import Swal from 'sweetalert2';
// // import { useNavigate } from 'react-router-dom';
// // // Firebase Imports (Modular SDK)
// // import { getAuth } from 'firebase/auth';
// // import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

// // function NewTicket() {
// //   const navigate = useNavigate();
// //   const [subject, setSubject] = useState('');
// //   const [onBehalfOf, setOnBehalfOf] = useState('self');
// //   const [Employee_ID, setEmployee_ID] = useState('');
// //   const [debouncedEmployee_ID, setDebouncedEmployee_ID] = useState('');
// //   const [deviceType, setDeviceType] = useState('');
// //   const [issueType, setIssueType] = useState('');
// //   const [attachment, setAttachment] = useState(null);
// //   const [description, setDescription] = useState('');
// //   const [formErrors, setFormErrors] = useState('');
// //   const [employeeExists, setEmployeeExists] = useState(false);

// //   const db = getFirestore(); // Firestore instance

// //   useEffect(() => {
// //     // Add a debounce effect for Employee_ID lookup
// //     const timer = setTimeout(() => {
// //       if (onBehalfOf === 'others' && Employee_ID) {
// //         setDebouncedEmployee_ID(Employee_ID);
// //       }
// //     }, 1500);

// //     return () => clearTimeout(timer);
// //   }, [Employee_ID, onBehalfOf]);

// //   useEffect(() => {
// //     if (debouncedEmployee_ID && onBehalfOf === 'others') {
// //       // Check Firestore for Employee_ID existence
// //       const checkEmployeeExists = async () => {
// //         const q = query(collection(db, 'users'), where('Employee_ID', '==', debouncedEmployee_ID));
// //         const querySnapshot = await getDocs(q);

// //         if (!querySnapshot.empty) {
// //           setEmployeeExists(true);
// //         } else {
// //           setEmployeeExists(false);
// //         }
// //       };

// //       checkEmployeeExists();
// //     }
// //   }, [debouncedEmployee_ID, db, onBehalfOf]);

// //   const handleAttachmentChange = (e) => {
// //     setAttachment(e.target.files[0]);
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();

// //     // Check for mandatory fields
// //     if (!subject || !deviceType || !issueType || !attachment || (onBehalfOf === 'others' && !Employee_ID)) {
// //       setFormErrors('Please fill all the mandatory fields.');
// //       return;
// //     }

// //     // Check if Employee_ID exists when on behalf of others
// //     if (onBehalfOf === 'others' && !employeeExists) {
// //       setFormErrors('No employee found with this Employee_ID.');
// //       return;
// //     }

// //     // Clear form errors if all mandatory fields are filled
// //     setFormErrors('');

// //     // Firebase Auth to get the current user's ID token
// //     const auth = getAuth(); // Get the Firebase Auth instance
// //     auth.currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
// //       // Prepare form data
// //       const formData = new FormData();
// //       formData.append('subject', subject);
// //       formData.append('onBehalfOf', onBehalfOf);
// //       formData.append('Employee_ID', onBehalfOf === 'others' ? Employee_ID : 'self');
// //       formData.append('deviceType', deviceType);
// //       formData.append('issueType', issueType);
// //       formData.append('attachment', attachment);
// //       formData.append('description', description);

// //       // Make the request to the backend
// //       fetch('http://localhost:1760/admin/create', {
// //         method: 'POST',
// //         headers: {
// //           'Authorization': `Bearer ${idToken}` // Include the Firebase ID token in the Authorization header
// //         },
// //         body: formData // Send the form data
// //       })
// //         .then((response) => response.json())
// //         .then((data) => {
// //           if (data.message === 'Ticket created successfully') {
// //             Swal.fire({
// //               title: 'Success!',
// //               text: 'Your ticket has been raised successfully!',
// //               icon: 'success',
// //               confirmButtonText: 'OK'
// //             }).then(() => {
// //               navigate('/AdminDashboard/tickets'); // Navigate to the desired route after success
// //             });
// //           } else {
// //             Swal.fire({
// //               title: 'Error',
// //               text: data.message || 'Something went wrong!',
// //               icon: 'error',
// //               confirmButtonText: 'OK'
// //             });
// //           }
// //         })
// //         .catch((error) => {
// //           console.error('Error submitting ticket:', error);
// //           Swal.fire({
// //             title: 'Error',
// //             text: 'Failed to raise ticket.',
// //             icon: 'error',
// //             confirmButtonText: 'OK'
// //           });
// //         });
// //     }).catch((error) => {
// //       console.error('Error getting Firebase ID token:', error);
// //       Swal.fire({
// //         title: 'Authentication Error',
// //         text: 'Failed to retrieve authentication token. Please login again.',
// //         icon: 'error',
// //         confirmButtonText: 'OK'
// //       });
// //     });
// //   };

// //   const handleCancel = () => {
// //     navigate('/admin-tickets/tickets');
// //   };

// //   return (
// //     <div className="new-ticket-container">
// //       <h2>Raise Ticket</h2>
// //       <form onSubmit={handleSubmit} className="ticket-form">
// //         <div>
// //           <label>Subject (Mandatory): </label>
// //           <input
// //             type="text"
// //             value={subject}
// //             onChange={(e) => setSubject(e.target.value)}
// //             required
// //           />
// //         </div>

// //         <div>
// //           <label>On Behalf Of (Mandatory): </label>
// //           <select value={onBehalfOf} onChange={(e) => setOnBehalfOf(e.target.value)}>
// //             <option value="self">Self</option>
// //             <option value="others">Other Employee</option>
// //           </select>
// //         </div>

// //         {onBehalfOf === 'others' && (
// //           <div>
// //             <label>Enter Employee-ID (Mandatory): </label>
// //             <input
// //               type="text"
// //               value={Employee_ID}
// //               onChange={(e) => setEmployee_ID(e.target.value)}
// //               required={onBehalfOf === 'others'}
// //             />
// //             {formErrors && !employeeExists && (
// //               <p style={{ color: 'red' }}>No employee found with this Employee_ID.</p>
// //             )}
// //           </div>
// //         )}

// //         <div>
// //           <label>Device Type (Mandatory): </label>
// //           <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)} required>
// //             <option value="">Select Device Type</option>
// //             <option value="Mobile">Mobile</option>
// //             <option value="Laptop">Laptop</option>
// //             <option value="Other">Other</option>
// //           </select>
// //         </div>

// //         <div>
// //           <label>Issue Type (Mandatory): </label>
// //           <select value={issueType} onChange={(e) => setIssueType(e.target.value)} required>
// //             <option value="">Select Issue Type</option>
// //             <option value="Software">Software</option>
// //             <option value="Hardware">Hardware</option>
// //           </select>
// //         </div>

// //         <div>
// //           <label>Attachment (Mandatory): </label>
// //           <input type="file" onChange={handleAttachmentChange} required />
// //         </div>

// //         <div>
// //           <label>Description: </label>
// //           <textarea
// //             value={description}
// //             onChange={(e) => setDescription(e.target.value)}
// //             rows="4"
// //           />
// //         </div>

// //         {formErrors && <p style={{ color: 'red' }}>{formErrors}</p>}

// //         <div>
// //           <button type="button" onClick={handleCancel}>Cancel</button>
// //           <button type="submit">Raise Ticket</button>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // }

// // export default NewTicket;

// import React, { useState, useEffect } from 'react';
// import './NewTicket.css';
// import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router-dom';
// // Firebase Imports (Modular SDK)
// import { getAuth } from 'firebase/auth';
// import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

// function NewTicket() {
//   const navigate = useNavigate();
//   const [subject, setSubject] = useState('');
//   const [onBehalfOf, setOnBehalfOf] = useState('self');
//   const [Employee_ID, setEmployee_ID] = useState('');
//   const [debouncedEmployee_ID, setDebouncedEmployee_ID] = useState('');
//   const [deviceType, setDeviceType] = useState('');
//   const [issueType, setIssueType] = useState('');
//   const [attachment, setAttachment] = useState(null);
//   const [description, setDescription] = useState('');
//   const [formErrors, setFormErrors] = useState('');
//   const [employeeExists, setEmployeeExists] = useState(false);

//   const db = getFirestore(); // Firestore instance

//   useEffect(() => {
//     // Add a debounce effect for Employee_ID lookup
//     const timer = setTimeout(() => {
//       if (onBehalfOf === 'others' && Employee_ID) {
//         setDebouncedEmployee_ID(Employee_ID);
//       }
//     }, 1500);

//     return () => clearTimeout(timer);
//   }, [Employee_ID, onBehalfOf]);

//   useEffect(() => {
//     if (debouncedEmployee_ID && onBehalfOf === 'others') {
//       // Check Firestore for Employee_ID existence
//       const checkEmployeeExists = async () => {
//         const q = query(collection(db, 'users'), where('Employee_ID', '==', debouncedEmployee_ID));
//         const querySnapshot = await getDocs(q);

//         if (!querySnapshot.empty) {
//           setEmployeeExists(true);
//         } else {
//           setEmployeeExists(false);
//         }
//       };

//       checkEmployeeExists();
//     }
//   }, [debouncedEmployee_ID, db, onBehalfOf]);

//   const handleAttachmentChange = (e) => {
//     setAttachment(e.target.files[0]);
//   };

//   // const handleSubmit = (e) => {
//   //   e.preventDefault();

//   //   // Check for mandatory fields
//   //   if (!subject || !deviceType || !issueType  || (onBehalfOf === 'others' && !Employee_ID)) {
//   //     setFormErrors('Please fill all the mandatory fields.');
//   //     return;
//   //   }

//   //   // Check if Employee_ID exists when on behalf of others
//   //   if (onBehalfOf === 'others' && !employeeExists) {
//   //     setFormErrors('No employee found with this Employee_ID.');
//   //     return;
//   //   }

//   //   // Clear form errors if all mandatory fields are filled
//   //   setFormErrors('');

//   //   // Firebase Auth to get the current user's ID token
//   //   const auth = getAuth(); // Get the Firebase Auth instance
//   //   const user = auth.currentUser;

//   //   if (!user) {
//   //     setFormErrors('User not authenticated.');
//   //     return;
//   //   }

//   //   auth.currentUser.getIdToken(/* forceRefresh */ true).then(async(idToken) => {
//   //     // Prepare form data
//   //     const token = await user.getIdToken();
//   //     const formData = new FormData();
//   //     formData.append('subject', subject);
//   //     formData.append('onBehalfOf', onBehalfOf);
//   //     formData.append('Employee_ID', onBehalfOf === 'others' ? Employee_ID : 'self');
//   //     formData.append('deviceType', deviceType);
//   //     formData.append('issueType', issueType);
//   //     formData.append('attachment', attachment);
//   //     formData.append('description', description);

//   //     // Make the request to the backend
//   //     fetch('http://localhost:1760/admin/create', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Authorization': `Bearer ${idToken}` // Include the Firebase ID token in the Authorization header
//   //       },
//   //       body: formData // Send the form data
//   //     })
//   //       .then((response) => response.json())
//   //       .then((data) => {
//   //         if (data.message === 'Ticket created successfully') {
//   //           Swal.fire({
//   //             title: 'Success!',
//   //             text: 'Your ticket has been raised successfully!',
//   //             icon: 'success',
//   //             confirmButtonText: 'OK'
//   //           }).then(() => {
//   //             navigate('/AdminDashboard/tickets'); // Navigate to the desired route after success
//   //           });
//   //         } else {
//   //           Swal.fire({
//   //             title: 'Error',
//   //             text: data.message || 'Something went wrong!',
//   //             icon: 'error',
//   //             confirmButtonText: 'OK'
//   //           });
//   //         }
//   //       })
//   //       .catch((error) => {
//   //         console.error('Error submitting ticket:', error);
//   //         Swal.fire({
//   //           title: 'Error',
//   //           text: 'Failed to raise ticket.',
//   //           icon: 'error',
//   //           confirmButtonText: 'OK'
//   //         });
//   //       });
//   //   }).catch((error) => {
//   //     console.error('Error getting Firebase ID token:', error);
//   //     Swal.fire({
//   //       title: 'Authentication Error',
//   //       text: 'Failed to retrieve authentication token. Please login again.',
//   //       icon: 'error',
//   //       confirmButtonText: 'OK'
//   //     });
//   //   });
//   // };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Check for mandatory fields
//     if (!subject || !deviceType || !issueType  || (onBehalfOf === 'others' && !Employee_ID)) {
//       setFormErrors('Please fill all the mandatory fields.');
//       return;
//     }

//     // Check if Employee_ID exists when on behalf of others
//     if (onBehalfOf === 'others' && !employeeExists) {
//       setFormErrors('No employee found with this Employee_ID.');
//       return;
//     }

//     // Clear form errors if all mandatory fields are filled
//     setFormErrors('');

//     // Firebase Auth to get the current user's ID token
//     const auth = getAuth(); // Get the Firebase Auth instance
//     const user = auth.currentUser;

//     if (!user) {
//       setFormErrors('User not authenticated.');
//       return;
//     }

//     auth.currentUser.getIdToken(/* forceRefresh */ true).then(async(idToken) => {
//       // Prepare form data
//       const token = await user.getIdToken();
//       const formData = new FormData();
//       formData.append('subject', subject);
//       formData.append('onBehalfOf', onBehalfOf);
//       formData.append('Employee_ID', onBehalfOf === 'others' ? Employee_ID : 'self');
//       formData.append('deviceType', deviceType);
//       formData.append('issueType', issueType);
//       formData.append('attachment', attachment);
//       formData.append('description', description);

//       // Make the request to the backend
//       fetch('http://localhost:1760/admin/create', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${idToken}` // Include the Firebase ID token in the Authorization header
//         },
//         body: formData // Send the form data
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           if (data.message === 'Ticket created successfully') {
//             Swal.fire({
//               title: 'Success!',
//               text: 'Your ticket has been raised successfully!',
//               icon: 'success',
//               confirmButtonText: 'OK'
//             }).then(() => {
//               // Role-based navigation
//               if (role === 'SuperAdmin') {
//                 navigate('/AdminDashboard/tickets'); // SuperAdmin navigates to tickets page
//               } else if (role === 'Admin') {
//                 navigate(-1); // Admin navigates to the previous page
//               }
//             });
//           } else {
//             Swal.fire({
//               title: 'Error',
//               text: data.message || 'Something went wrong!',
//               icon: 'error',
//               confirmButtonText: 'OK'
//             });
//           }
//         })
//         .catch((error) => {
//           console.error('Error submitting ticket:', error);
//           Swal.fire({
//             title: 'Error',
//             text: 'Failed to raise ticket.',
//             icon: 'error',
//             confirmButtonText: 'OK'
//           });
//         });
//     }).catch((error) => {
//       console.error('Error getting Firebase ID token:', error);
//       Swal.fire({
//         title: 'Authentication Error',
//         text: 'Failed to retrieve authentication token. Please login again.',
//         icon: 'error',
//         confirmButtonText: 'OK'
//       });
//     });
//   };

//   const handleCancel = () => {
//     navigate('/admin-tickets/tickets');
//   };

//   return (
//     <div className="new-ticket-container">
//       <h2>Raise Ticket</h2>
//       <form onSubmit={handleSubmit} className="ticket-form">
//         <div>
//           <label>Subject (*): </label>
//           <input
//             type="text"
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label>On Behalf Of (*): </label>
//           <select value={onBehalfOf} onChange={(e) => setOnBehalfOf(e.target.value)}>
//             <option value="self">Self</option>
//             <option value="others">Other Employee</option>
//           </select>
//         </div>

//         {onBehalfOf === 'others' && (
//           <div>
//             <label>Enter Employee-ID (Mandatory): </label>
//             <input
//               type="text"
//               value={Employee_ID}
//               onChange={(e) => setEmployee_ID(e.target.value)}
//               required={onBehalfOf === 'others'}
//             />
//             {formErrors && !employeeExists && (
//               <p style={{ color: 'red' }}>No employee found with this Employee_ID.</p>
//             )}
//           </div>
//         )}

//         <div>
//           <label>Device Type (*): </label>
//           <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)} required>
//             <option value="">Select Device Type</option>
//             <option value="Mobile">Mobile</option>
//             <option value="Laptop">Laptop</option>
//             <option value="Other">Other</option>
//           </select>
//         </div>

//         <div>
//           <label>Issue Type (*): </label>
//           <select value={issueType} onChange={(e) => setIssueType(e.target.value)} required>
//             <option value="">Select Issue Type</option>
//             <option value="Software">Software</option>
//             <option value="Hardware">Hardware</option>
//           </select>
//         </div>

//         <div>
//           <label>Attachment (*): </label>
//           <input type="file" onChange={handleAttachmentChange}  />
//         </div>

//         <div>
//           <label>Description: </label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             rows="4"
//           />
//         </div>

//         {formErrors && <p style={{ color: 'red' }}>{formErrors}</p>}

//         <div>
//           <button type="button" onClick={handleCancel}>Cancel</button>
//           <button type="submit">Raise Ticket</button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default NewTicket;

import React, { useState, useEffect } from "react";
import "./NewTicket.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// Firebase Imports (Modular SDK)
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function NewTicket({ role }) {
  // Assume role is passed as a prop
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [onBehalfOf, setOnBehalfOf] = useState("self");
  const [Employee_ID, setEmployee_ID] = useState("");
  const [debouncedEmployee_ID, setDebouncedEmployee_ID] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [issueType, setIssueType] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [description, setDescription] = useState("");
  const [formErrors, setFormErrors] = useState("");
  const [employeeExists, setEmployeeExists] = useState(false);

  const db = getFirestore(); // Firestore instance

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onBehalfOf === "others" && Employee_ID) {
        setDebouncedEmployee_ID(Employee_ID);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [Employee_ID, onBehalfOf]);

  useEffect(() => {
    if (debouncedEmployee_ID && onBehalfOf === "others") {
      const checkEmployeeExists = async () => {
        const q = query(
          collection(db, "users"),
          where("Employee_ID", "==", debouncedEmployee_ID)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setEmployeeExists(true);
        } else {
          setEmployeeExists(false);
        }
      };

      checkEmployeeExists();
    }
  }, [debouncedEmployee_ID, db, onBehalfOf]);

  const handleAttachmentChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !subject ||
      !deviceType ||
      !issueType ||
      (onBehalfOf === "others" && !Employee_ID)
    ) {
      setFormErrors("Please fill all the mandatory fields.");
      return;
    }

    if (onBehalfOf === "others" && !employeeExists) {
      setFormErrors("No employee found with this Employee_ID.");
      return;
    }

    setFormErrors("");

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setFormErrors("User not authenticated.");
      return;
    }

    auth.currentUser
      .getIdToken(/* forceRefresh */ true)
      .then(async (idToken) => {
        const token = await user.getIdToken();
        const formData = new FormData();
        formData.append("subject", subject);
        formData.append("onBehalfOf", onBehalfOf);
        formData.append(
          "Employee_ID",
          onBehalfOf === "others" ? Employee_ID : "self"
        );
        formData.append("deviceType", deviceType);
        formData.append("issueType", issueType);
        formData.append("attachment", attachment);
        formData.append("description", description);

        fetch("http://localhost:1760/admin/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message === "Ticket created successfully") {
              Swal.fire({
                title: "Success!",
                text: "Your ticket has been raised successfully!",
                icon: "success",
                confirmButtonText: "OK",
              }).then(() => {
                if (role === "Admin") {
                  navigate(-1); // Go back to the previous page for Admin
                } else {
                  navigate("/SuperAdminDashboard/tickets"); // SuperAdmin-specific navigation
                }
              });
            } else {
              Swal.fire({
                title: "Error",
                text: data.message || "Something went wrong!",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          })
          .catch((error) => {
            console.error("Error submitting ticket:", error);
            Swal.fire({
              title: "Error",
              text: "Failed to raise ticket.",
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      })
      .catch((error) => {
        console.error("Error getting Firebase ID token:", error);
        Swal.fire({
          title: "Authentication Error",
          text: "Failed to retrieve authentication token. Please login again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const handleCancel = () => {
    navigate("/admin-tickets/tickets");
  };

  return (
    <div className="new-ticket-container">
      <h2>Raise Ticket</h2>
      <form onSubmit={handleSubmit} className="ticket-form">
        <div>
          <label>Subject (*): </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div>
          <label>On Behalf Of (*): </label>
          <select
            value={onBehalfOf}
            onChange={(e) => setOnBehalfOf(e.target.value)}
          >
            <option value="self">Self</option>
            <option value="others">Other Employee</option>
          </select>
        </div>

        {onBehalfOf === "others" && (
          <div>
            <label>Enter Employee-ID (Mandatory): </label>
            <input
              type="text"
              value={Employee_ID}
              onChange={(e) => setEmployee_ID(e.target.value)}
              required={onBehalfOf === "others"}
            />
            {formErrors && !employeeExists && (
              <p style={{ color: "red" }}>
                No employee found with this Employee_ID.
              </p>
            )}
          </div>
        )}

        <div>
          <label>Device Type (*): </label>
          <select
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            required
          >
            <option value="">Select Device Type</option>
            <option value="Mobile">Mobile</option>
            <option value="Laptop">Laptop</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label>Issue Type (*): </label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            required
          >
            <option value="">Select Issue Type</option>
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
          </select>
        </div>

        <div>
          <label>Attachment (*): </label>
          <input type="file" onChange={handleAttachmentChange} />
        </div>

        <div>
          <label>Description: </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
        </div>

        {formErrors && <p style={{ color: "red" }}>{formErrors}</p>}

        <div>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit">Raise Ticket</button>
        </div>
      </form>
    </div>
  );
}

export default NewTicket;
