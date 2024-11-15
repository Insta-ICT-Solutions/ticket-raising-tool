import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './AddEngineer.css';
import { useNavigate } from 'react-router-dom';

function AddEngineer() {
  const [rows, setRows] = useState([{ email: '' }]);
  const navigate = useNavigate();

  const hideNavigationBar = () => {
    const navBar = document.getElementById('navbar');
    if (navBar) {
      navBar.style.display = 'none';
    }
  };

  const showNavigationBar = () => {
    const navBar = document.getElementById('navbar');
    if (navBar) {
      navBar.style.display = 'block';
    }
  };

  useEffect(() => {
    hideNavigationBar();
    return () => showNavigationBar();
  }, []);

  const handleAddRow = () => {
    setRows([...rows, { email: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async () => {
    // Validate rows before sending the request
    for (let row of rows) {
      if (!row.email) {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Please enter an email address!',
          confirmButtonText: 'OK',
        });
        return;
      }
      if (!validateEmail(row.email)) {
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          text: 'Please enter a valid email address!',
          confirmButtonText: 'OK',
        });
        return;
      }
    }

    const token = localStorage.getItem('token'); // Retrieve the token from local storage

    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authorization Error',
        text: 'No token found. Please log in again.',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Send each email individually
    for (let row of rows) {
      if (!row.email) continue; // Skip if email is empty

      const payload = { email: row.email }; // Prepare the payload for a single email
      console.log("Payload being sent:", payload); // Log the payload

      try {
        const response = await fetch('http://15.206.81.1:1760/update-role', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Attach the token here
          },
          body: JSON.stringify(payload), // Send the single email
        });

        const data = await response.json();
        console.log("Response data:", data); // Log the response data

        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Successfully Updated Engineer Role!',
            text: data.message,
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(-1);
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.error || data.message, // Adjusted for possible error field
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        console.error("Error details:", error); // Log error details
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while updating engineer roles.',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  return (
    <div className="add-engineer-container fade-in">
      <div className="add-engineer-header">
        <h2 className="heading">Add Engineer</h2>
      </div>
      <div className="table">
        <div className="table-row table-header">
          <div className="table-cell">Email ID</div>
        </div>
        {rows.map((row, index) => (
          <div className="table-row fade-in" key={index}>
            <div className="table-cell">
              <input
                type="email"
                placeholder="Enter Email"
                value={row.email}
                className="input-field"
                onChange={(e) => handleInputChange(index, 'email', e.target.value)}
              />
            </div>
            <div className="table-cell">
              <i
                className="fas fa-times-circle remove-icon"
                onClick={() => handleRemoveRow(index)}
                style={{ cursor: 'pointer', color: 'red' }}
                title="Remove"
              ></i>
            </div>
          </div>
        ))}
        <div className="add-more-container">
          <button className="add-more-button bounce" onClick={handleAddRow}>
            + Add More
          </button>
        </div>
      </div>
      <div className="submit-container">
        <button className="add-engineer-button" onClick={handleSubmit}>
          Update Engineer Role
        </button>
      </div>
    </div>
  );
}

export default AddEngineer;
