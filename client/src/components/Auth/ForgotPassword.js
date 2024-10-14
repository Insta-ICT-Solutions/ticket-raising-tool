



// import React, { useState, useEffect } from 'react'; 
// import { sendPasswordResetEmail } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom'; 
// import { auth } from "../../firebase/firebaseconfig";
// import './ForgotPassword.css';

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [captchaResult, setCaptchaResult] = useState('');
//   const [captchaQuestion, setCaptchaQuestion] = useState('');
//   const [captchaAnswer, setCaptchaAnswer] = useState(null);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   // Function to generate random single digit addition
//   const generateCaptcha = () => {
//     const num1 = Math.floor(Math.random() * 10);
//     const num2 = Math.floor(Math.random() * 10);
//     setCaptchaQuestion(`${num1} + ${num2}`);
//     setCaptchaAnswer(num1 + num2);
//   };

//   // Generate a new captcha when the component is loaded
//   useEffect(() => {
//     generateCaptcha();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');

//     if (parseInt(captchaResult) === captchaAnswer) { // Check if the captcha is correct
//       try {
//         await sendPasswordResetEmail(auth, email);
//         setMessage('Password reset link has been sent to your email.');
//       } catch (err) {
//         setError('Failed to send password reset email. Please check the email ID.');
//       }
//     } else {
//       setError('Captcha is incorrect. Please try again.');
//     }
//   };

//   const handleCaptchaRefresh = () => {
//     generateCaptcha(); // Refresh the captcha question
//     setCaptchaResult(''); // Reset user input
//   };

//   const handleLoginClick = () => {
//     navigate("/Login");
//   };

//   return (
//     <div className="forgot-password-container">
//       <div className="forgot-password-card">
//         <h2>Forgot Password</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="input-group">
//             <label>Registered Email ID:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               placeholder="Enter your registered email"
//             />
//           </div>

//           <div className="input-group">
//             <label>Solve the following:</label>
//             <div className="captcha-box">
//               <span>{captchaQuestion} = </span>
//               <input
//                 type="text"  // Changed input type to text
//                 value={captchaResult}
//                 onChange={(e) => setCaptchaResult(e.target.value)}
//                 required
//                 placeholder="Answer"
//               />
//               <button type="button" onClick={handleCaptchaRefresh} className="refresh-button">Refresh</button>
//             </div>
//           </div>

//           <button type="submit" className="submit-button">Submit</button>
//         </form>

//         {message && <p className="success-message">{message}</p>}
//         {error && <p className="error-message">{error}</p>}

//         <p className="new-user">
//           <button onClick={handleLoginClick} className="link-button">Log in</button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;
import React, { useState, useEffect } from 'react'; 
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; 
import { auth } from "../../firebase/firebaseconfig";
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [captchaResult, setCaptchaResult] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaQuestion(`${num1} + ${num2}`);
    setCaptchaAnswer(num1 + num2);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (parseInt(captchaResult) === captchaAnswer) {
      try {
        await sendPasswordResetEmail(auth, email);
        setMessage('Password reset link has been sent to your email.');
      } catch (err) {
        setError('Failed to send password reset email. Please check the email ID.');
      }
    } else {
      setError('Captcha is incorrect. Please try again.');
    }
  };

  const handleCaptchaRefresh = () => {
    generateCaptcha();
    setCaptchaResult('');
  };

  const handleLoginClick = () => {
    navigate("/");
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Registered Email ID:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your registered email"
            />
          </div>

          <div className="input-group">
            <label>Solve the following:</label>
            <div className="captcha-question">
              <span>{captchaQuestion} = </span>
              <IconButton onClick={handleCaptchaRefresh} className="refresh-button">
                <RefreshIcon />
              </IconButton>
            </div>
            <div className="captcha-input-container">
              <input
                type="text"
                value={captchaResult}
                onChange={(e) => setCaptchaResult(e.target.value)}
                required
                placeholder="Answer"
              />
            </div>
          </div>

          <button type="submit" className="submit-button">Submit</button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <p className="new-user">
          <button onClick={handleLoginClick} className="link-button">Log in</button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;