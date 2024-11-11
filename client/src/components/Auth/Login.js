// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { signInWithEmailAndPassword } from "firebase/auth";
// // import { getDoc, getFirestore, doc } from "firebase/firestore";
// // import { auth } from "../../firebase/firebaseconfig.js";
// // import Button from "@mui/material/Button";
// // import Stack from "@mui/material/Stack";
// // import Tooltip from "@mui/material/Tooltip";
// // import axios from "axios";
// // import "../Auth/Login.css";

// // const UserLogin = () => {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [message, setMessage] = useState("");
// //   const [messageType, setMessageType] = useState("");
// //   const [error, setError] = useState("");
// //   const navigate = useNavigate();

// //   const allowedEmailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|yahoo)\.com$/;
// //   const passwordCriteria = [
// //     { label: "At least 6 characters", test: /.{6,}/ },
// //     { label: "At least 1 uppercase letter", test: /[A-Z]/ },
// //     { label: "At least 1 lowercase letter", test: /[a-z]/ },
// //     { label: "At least 1 number", test: /[0-9]/ },
// //     { label: "At least 1 special character", test: /[!@#$%^&*(),.?":{}|<>]/ },
// //   ];

// //   const isCriteriaMet = (test) => test.test(password);

// //   const handleLogin = async (e) => {
// //     const db = getFirestore();
// //     e.preventDefault();
// //     setMessage("");

// //     if (!allowedEmailRegex.test(email)) {
// //       setError("Email domain must be gmail.com, outlook.com, or yahoo.com");
// //       return;
// //     }

// //     const allCriteriaMet = passwordCriteria.every((criteria) => isCriteriaMet(criteria.test));
// //     if (!allCriteriaMet) {
// //       setError("Password does not meet the required criteria.");
// //       return;
// //     }

// //     try {
// //       const userCredential = await signInWithEmailAndPassword(auth, email, password);
// //       const user = userCredential.user;
// //       const uid = user.uid;
// //       const idToken = await user.getIdToken();

// //       const saveResponse = await axios.post("http://127.0.0.1:3001/clients/save", {}, {
// //         headers: {
// //           Authorization: `Bearer ${idToken}`,
// //         },
// //       });

// //       const docPath = doc(db, "users", uid);
// //       const employeeDoc = await getDoc(docPath);
// //       const employeeData = employeeDoc.data();
// //       const employeeId = employeeData.Employee_ID;

// //       sessionStorage.setItem("employeeId", employeeId);

// //       if (saveResponse.status === 200) {
// //         localStorage.setItem("token", saveResponse.data.token);
// //         setMessage("Login successful!");
// //         setMessageType("success");

// //         const role = saveResponse.data.role;
// //         let dashboardPath = "/user-dashboard/mytickets";
// //         if (role === "Admin") {
// //           dashboardPath = "/AdminDashboard/tickets";
// //         } else if (role === "SuperAdmin") {
// //           dashboardPath = "/SuperAdminDashboard/tickets";
// //         }

// //         setTimeout(() => {
// //           navigate(dashboardPath, { state: { role } });
// //         }, 2000);
// //       } else {
// //         setMessage("Login failed. Please try again.");
// //         setMessageType("error");
// //       }
// //     } catch (error) {
// //       let errorMessage = "";

// //       if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
// //         errorMessage = "Please enter a valid email address.";
// //       } else if (error.code === "auth/wrong-password") {
// //         errorMessage = "Incorrect password. Please try again.";
// //       } else if (error.code === "auth/invalid-credential") {
// //         errorMessage = "Invalid credentials. Please try again.";
// //       } else {
// //         errorMessage = error.message;
// //       }

// //       console.error("Error logging in: ", errorMessage);
// //       setMessage(errorMessage);
// //       setMessageType("error");
// //     }
// //   };

// //   const handleForgotPassword = () => {
// //     navigate("/forgot-password");
// //   };

// //   const handleRegistration = () => {
// //     navigate("/registration");
// //   };

// //   return (
// //     <div className="login-container">
// //       <div className="login-image-container">
// //         <img
// //           src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg"
// //           alt="Login"
// //         />
// //       </div>
// //       <div className="login-form-container">
// //         <h2>Login</h2>
// //         {message && (
// //           <div className={messageType === "success" ? "login-message-success" : "login-message-error"}>
// //             {message}
// //           </div>
// //         )}
// //         <form onSubmit={handleLogin}>
// //           <div className="form-group-container">
// //             <Tooltip
// //               title="Email domain must be gmail.com, outlook.com, or yahoo.com"
// //               arrow
// //               placement="top"
// //             >
// //               <div>
// //                 <label>Email ID:</label>
// //                 <input
// //                   type="email"
// //                   value={email}
// //                   placeholder="Enter your Email ID"
// //                   required
// //                   onChange={(e) => setEmail(e.target.value)}
// //                 />
// //               </div>
// //             </Tooltip>
// //           </div>
// //           <div className="form-group-container">
// //             <label>Password:</label>
// //             <input
// //               type="password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               placeholder="Enter your password"
// //               required
// //             />
// //           </div>

// //           {error && <p className="login-error-message">{error}</p>}

// //           <div className="login-button-container">
// //             <Stack direction="row" spacing={2}>
// //               <Button type="submit" variant="contained">Submit</Button>
// //               <Button variant="outlined" onClick={handleForgotPassword}>
// //                 Forgot Password
// //               </Button>
// //             </Stack>
// //             <Stack direction="row" spacing={2} mt={2}>
// //               <Button variant="text" onClick={handleRegistration}>
// //                 Registration
// //               </Button>
// //             </Stack>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };
// // export default UserLogin;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { getDoc, getFirestore, doc } from "firebase/firestore";
// import { auth } from "../../firebase/firebaseconfig.js";
// import Button from "@mui/material/Button";
// import Stack from "@mui/material/Stack";
// import Tooltip from "@mui/material/Tooltip";
// import axios from "axios";
// import "../Auth/Login.css";

// const UserLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const allowedEmailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|yahoo)\.com$/;
//   const passwordCriteria = [
//     { label: "At least 6 characters", test: /.{6,}/ },
//     { label: "At least 1 uppercase letter", test: /[A-Z]/ },
//     { label: "At least 1 lowercase letter", test: /[a-z]/ },
//     { label: "At least 1 number", test: /[0-9]/ },
//     { label: "At least 1 special character", test: /[!@#$%^&*(),.?":{}|<>]/ },
//   ];

//   const isCriteriaMet = (test) => test.test(password);

//   const handleLogin = async (e) => {
//     const db = getFirestore();
//     e.preventDefault();
//     setMessage("");

//     if (!allowedEmailRegex.test(email)) {
//       setError("Email domain must be gmail.com, outlook.com, or yahoo.com");
//       return;
//     }

//     const allCriteriaMet = passwordCriteria.every((criteria) => isCriteriaMet(criteria.test));
//     if (!allCriteriaMet) {
//       setError("Password does not meet the required criteria.");
//       return;
//     }

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       const uid = user.uid;
//       const idToken = await user.getIdToken();

//       const saveResponse = await axios.post("http://127.0.0.1:3001/clients/save", {}, {
//         headers: {
//           Authorization: `Bearer ${idToken}`,
//         },
//       });

//       const docPath = doc(db, "users", uid);
//       const employeeDoc = await getDoc(docPath);
//       const employeeData = employeeDoc.data();
//       const employeeId = employeeData.Employee_ID;

//       // Save employeeId and role in sessionStorage for future use
//       sessionStorage.setItem("employeeId", employeeId);

//       if (saveResponse.status === 200) {
//         const role = saveResponse.data.role;
//         sessionStorage.setItem("role", role); // Store role in sessionStorage
//         localStorage.setItem("token", saveResponse.data.token);
        
//         setMessage("Login successful!");
//         setMessageType("success");

//         // Set the navigation path based on role
//         let dashboardPath = "/user-dashboard/mytickets";
//         if (role === "Admin") {
//           dashboardPath = "/AdminDashboard/tickets";
//         } else if (role === "SuperAdmin") {
//           dashboardPath = "/SuperAdminDashboard/tickets";
//         }

//         setTimeout(() => {
//           navigate(dashboardPath, { state: { role } });
//         }, 2000);
//       } else {
//         setMessage("Login failed. Please try again.");
//         setMessageType("error");
//       }
//     } catch (error) {
//       let errorMessage = "";

//       if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
//         errorMessage = "Please enter a valid email address.";
//       } else if (error.code === "auth/wrong-password") {
//         errorMessage = "Incorrect password. Please try again.";
//       } else if (error.code === "auth/invalid-credential") {
//         errorMessage = "Invalid credentials. Please try again.";
//       } else {
//         errorMessage = error.message;
//       }

//       console.error("Error logging in: ", errorMessage);
//       setMessage(errorMessage);
//       setMessageType("error");
//     }
//   };

//   const handleForgotPassword = () => {
//     navigate("/forgot-password");
//   };

//   const handleRegistration = () => {
//     navigate("/registration");
//   };

//   return (
//     <div className="login-container">
//       <div className="login-image-container">
//         <img
//           src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg"
//           alt="Login"
//         />
//       </div>
//       <div className="login-form-container">
//         <h2>Login</h2>
//         {message && (
//           <div className={messageType === "success" ? "login-message-success" : "login-message-error"}>
//             {message}
//           </div>
//         )}
//         <form onSubmit={handleLogin}>
//           <div className="form-group-container">
//             <Tooltip
//               title="Email domain must be gmail.com, outlook.com, or yahoo.com"
//               arrow
//               placement="top"
//             >
//               <div>
//                 <label>Email ID:</label>
//                 <input
//                   type="email"
//                   value={email}
//                   placeholder="Enter your Email ID"
//                   required
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//               </div>
//             </Tooltip>
//           </div>
//           <div className="form-group-container">
//             <label>Password:</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           {error && <p className="login-error-message">{error}</p>}

//           <div className="login-button-container">
//             <Stack direction="row" spacing={2}>
//               <Button type="submit" variant="contained">Submit</Button>
//               <Button variant="outlined" onClick={handleForgotPassword}>
//                 Forgot Password
//               </Button>
//             </Stack>
//             <Stack direction="row" spacing={2} mt={2}>
//               <Button variant="text" onClick={handleRegistration}>
//                 Registration
//               </Button>
//             </Stack>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserLogin;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, getFirestore, doc } from "firebase/firestore";
import { auth } from "../../firebase/firebaseconfig.js";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import "../Auth/Login.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const allowedEmailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|yahoo)\.com$/;
  const passwordCriteria = [
    { label: "At least 6 characters", test: /.{6,}/ },
    { label: "At least 1 uppercase letter", test: /[A-Z]/ },
    { label: "At least 1 lowercase letter", test: /[a-z]/ },
    { label: "At least 1 number", test: /[0-9]/ },
    { label: "At least 1 special character", test: /[!@#$%^&*(),.?":{}|<>]/ },
  ];

  const isCriteriaMet = (test) => test.test(password);

  const handleLogin = async (e) => {
    const db = getFirestore();
    e.preventDefault();
    setMessage("");

    

    if (!allowedEmailRegex.test(email)) {
      setError("Email domain must be gmail.com, outlook.com, or yahoo.com");
      return;
    }

    const allCriteriaMet = passwordCriteria.every((criteria) => isCriteriaMet(criteria.test));
    if (!allCriteriaMet) {
      setError("Password does not meet the required criteria.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;
      const idToken = await user.getIdToken();

      const saveResponse = await axios.post("http://127.0.0.1:3001/clients/save", {}, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const docPath = doc(db, "users", uid);
      const employeeDoc = await getDoc(docPath);
      const employeeData = employeeDoc.data();
      const employeeId = employeeData.Employee_ID;

      sessionStorage.setItem("employeeId", employeeId);

      if (saveResponse.status === 200) {
        localStorage.setItem("token", saveResponse.data.token);
        setMessage("Login successful!");
        setMessageType("success");

       
      // sessionStorage.setItem("userRole", role); // Save role in sessionStorage
      // or use localStorage.setItem("userRole", role); for persistence across sessions


        const role = saveResponse.data.role;
        sessionStorage.setItem("userRole", role); 
        let dashboardPath = "/user-dashboard/mytickets";
        if (role === "Admin") {
          dashboardPath = "/AdminDashboard/tickets";
        } else if (role === "SuperAdmin") {
          dashboardPath = "/SuperAdminDashboard/tickets";
        }

        setTimeout(() => {
          navigate(dashboardPath, { state: { role } });
        }, 2000);
      } else {
        setMessage("Login failed. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      let errorMessage = "";

      if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid credentials. Please try again.";
      } else {
        errorMessage = error.message;
      }

      console.error("Error logging in: ", errorMessage);
      setMessage(errorMessage);
      setMessageType("error");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleRegistration = () => {
    navigate("/registration");
  };

  return (
    <div className="login-container">
      <div className="login-image-container">
        <img
          src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg"
          alt="Login"
        />
      </div>
      <div className="login-form-container">
        <h2>Login</h2>
        {message && (
          <div className={messageType === "success" ? "login-message-success" : "login-message-error"}>
            {message}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="form-group-container">
            <Tooltip
              title="Email domain must be gmail.com, outlook.com, or yahoo.com"
              arrow
              placement="top"
            >
              <div>
                <label>Email ID:</label>
                <input
                  type="email"
                  value={email}
                  placeholder="Enter your Email ID"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </Tooltip>
          </div>
          <div className="form-group-container">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="login-error-message">{error}</p>}

          <div className="login-button-container">
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained">Submit</Button>
              <Button variant="outlined" onClick={handleForgotPassword}>
                Forgot Password
              </Button>
            </Stack>
            <Stack direction="row" spacing={2} mt={2}>
              <Button variant="text" onClick={handleRegistration}>
                Registration
              </Button>
            </Stack>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UserLogin;