import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  Select,
  MenuItem,
  TextField,
  Grid,
  InputAdornment,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material"; // Importing Send Icon from Material UI
import { db, storage } from "../../../firebase/firebaseconfig";
import {
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  getDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import SweetAlert from "sweetalert2";
import "./TicketDetails.css";
import { Attachment } from '@mui/icons-material';
const TicketDetail = () => {
  const { ticketId } = useParams();
  const location = useLocation();
  const ticket = location.state?.ticket;

  const [admins, setAdmins] = useState([]);
  const [priority, setPriority] = useState(ticket?.priority || "Medium");
  const [status, setStatus] = useState(ticket?.status || "Raised");
  const [attachment, setAttachment] = useState(null);
  const [showAdminList, setShowAdminList] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sendersMap, setSendersMap] = useState({});
  const [assignedAdmin, setAssignedAdmin] = useState(ticket?.assignedTo || "");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      const userDocs = await getDocs(collection(db, "users"));
      const adminData = userDocs.docs
        .filter((doc) => doc.data().role === "Admin")
        .map((doc) => ({
          id: doc.id,
          name: `${doc.data().First_Name} ${doc.data().Last_Name}`,
          employeeId: doc.data().Employee_ID,
        }));
      setAdmins(adminData);
    };

    const unsubscribe = onSnapshot(
      query(
        collection(db, `ChatSection/${ticketId}/messages`),
        orderBy("timestamp", "asc")
      ),
      async (snapshot) => {
        const fetchedMessages = snapshot.docs.map((msgDoc) => ({
          id: msgDoc.id,
          ...msgDoc.data(),
        }));
        setMessages(fetchedMessages);

        const senderIds = [
          ...new Set(fetchedMessages.map((msg) => msg.senderId)),
        ];
        const senderDocs = await Promise.all(
          senderIds.map((id) => getDoc(doc(db, "users", id)))
        );
        const newSendersMap = {};
        senderDocs.forEach((userDoc, index) => {
          newSendersMap[senderIds[index]] = userDoc.exists()
            ? `${userDoc.data().First_Name} ${userDoc.data().Last_Name}`
            : "Anonymous";
        });
        setSendersMap(newSendersMap);
      }
    );

    fetchAdmins();
    return () => unsubscribe();
  }, [ticketId]);

  const handleFileChange = (event) =>
    setAttachment(event.target.files[0] || null);

  // Separate function to update priority in both collections
  const updatePriority = async (newPriority) => {
    try {
      console.log(ticket.createdBy);
      console.log(ticketId);
      const ticketDoc = doc(
        db,
        `users/${ticket.createdBy}/TicketDetails/${ticketId}`
      );
      const listDoc = doc(db, `TicketList/${ticketId}`);
      await setDoc(ticketDoc, { priority: newPriority }, {merge: true});
      await updateDoc(listDoc, { priority: newPriority });
      SweetAlert.fire("Success", `Priority set to ${newPriority}`, "success");
    } catch (err) {
      SweetAlert.fire("Error", "Could not update priority", "error");
    }
  };

  const handlePriorityChange = (event) => {
    const newPriority = event.target.value;
    if (newPriority !== priority) {
      setPriority(newPriority);
      updatePriority(newPriority);
    }
  };

  // Separate function to update status in both collections
  // const updateStatus = async (newStatus) => {
  //   try {
  //     const ticketDoc = doc(
  //       db,
  //       `users/${ticket.createdBy}/TicketDetails/${ticketId}`
  //     );
  //     const listDoc = doc(db, `TicketList/${ticketId}`);
  //     await updateDoc(ticketDoc, { status: newStatus });
  //     await updateDoc(listDoc, { status: newStatus });
  //     SweetAlert.fire("Success", `Status updated to ${newStatus}`, "success");
  //   } catch (err) {
  //     SweetAlert.fire("Error", "Could not update status", "error");
  //   }
  // };

  // Separate function to update status in both collections
// Function to format time as HH:MM AM/PM
// Function to format time as HH:MM AM/PM
const formatTime = (date) => {
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

// Function to format date as DD/MM/YYYY
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0'); // Get the day and pad with leading zero if necessary
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (0-indexed, so add 1) and pad with leading zero
  const year = date.getFullYear(); // Get the full year

  return `${day}/${month}/${year}`; // Construct the date string in DD/MM/YYYY format
};

// Update status function
const updateStatus = async (newStatus) => {
  try {
    const ticketDoc = doc(
      db,
      `users/${ticket.createdBy}/TicketDetails/${ticketId}`
    );
    const listDoc = doc(db, `TicketList/${ticketId}`);
    
    const currentTime = new Date(); // Get the current date and time
    const formattedTime = formatTime(currentTime); // Format it to just time (HH:MM AM/PM)
    const formattedDate = formatDate(currentTime); // Format it to just date (DD/MM/YYYY)

    await updateDoc(ticketDoc, { 
      status: newStatus,
      statusUpdatedTime: formattedTime, // Add formatted time for status update
      statusUpdatedDate: formattedDate // Add formatted date for status update
    });
    await updateDoc(listDoc, { 
      status: newStatus,
      statusUpdatedTime: formattedTime, // Add formatted time for status update
      statusUpdatedDate: formattedDate // Add formatted date for status update
    });
    
    SweetAlert.fire("Success", `Status updated to ${newStatus}`, "success");
  } catch (err) {
    SweetAlert.fire("Error", "Could not update status", "error");
  }
};
// Update status function


// Other component code...

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    if (newStatus !== status) {
      setStatus(newStatus);
      updateStatus(newStatus);
    }
  };

  //   // Separate function to update assigned admin in both collections
  const updateAssignedAdmin = async (adminName) => {
    try {
      // Find the selected admin's Employee_Id
      // const selectedAdmin = admins.find((admin) => admin.name === adminName);
      // const employeeId = selectedAdmin ? selectedAdmin.employeeId : '';
      // console.log("Admin Employee ID:", employeeId);
      console.log("Selected Admin Name:", adminName); // Log the admin name being passed
      const selectedAdmin = admins.find(
        (admin) => admin.name.toLowerCase() === adminName.toLowerCase()
      );
      console.log("Selected Admin:", selectedAdmin); // Log the selected admin object
      const employeeId = selectedAdmin ? selectedAdmin.employeeId : "";
      console.log("Admin Employee ID:", employeeId);
      if (employeeId) {
        // Update the assigned admin name and Employee_Id in both collections
        const ticketDoc = doc(
          db,
          `users/${ticket.createdBy}/TicketDetails/${ticketId}`
        );
        const listDoc = doc(db, `TicketList/${ticketId}`);
        await updateDoc(ticketDoc, {
          assignedTo: adminName,
          assignedId: employeeId,
        });
        await updateDoc(listDoc, {
          assignedTo: adminName,
          assignedId: employeeId,
        });

        // Update the local state

        SweetAlert.fire(
          "Success",
          `Assigned to ${adminName} (ID: ${employeeId})`,
          "success"
        );
      } else {
        SweetAlert.fire("Error", "Admin Employee ID not found", "error");
      }
    } catch (err) {
      SweetAlert.fire("Error", "Could not assign admin", "error");
    }
  };

  const handleAdminSelect = (adminName) => {
    setAssignedAdmin(adminName);
    setShowAdminList(false);
    updateAssignedAdmin(adminName);
  };

  const handleSendMessage = async () => {
    const user = getAuth().currentUser;
    if (user && messageInput) {
      const newMessage = {
        senderId: user.uid,
        message: messageInput,
        timestamp: serverTimestamp(),
      };
      try {
        await addDoc(
          collection(db, `ChatSection/${ticketId}/messages`),
          newMessage
        );
        setMessageInput("");
      } catch (err) {
        SweetAlert.fire("Error", "Could not send message", "error");
      }
    }
  };

  const handleFileUpload = async () => {
    if (attachment) {
      try {
        const fileRef = ref(
          storage,
          `attachments/${ticketId}/${attachment.name}`
        );
        await uploadBytes(fileRef, attachment);
        SweetAlert.fire("Success", "File uploaded successfully!", "success");
        setAttachment(null);
      } catch (err) {
        SweetAlert.fire("Error", "Failed to upload file", "error");
      }
    }
  };

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  return (
    <Container maxWidth="lg" className="ticket-details-container">
      <Paper elevation={4} className="ticket-details-paper">
        <Typography variant="h4" className="ticket-title" gutterBottom>
          {ticket.subject}
        </Typography>
        <Divider className="divider-spacing" />

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6">Description:</Typography>
            <Typography className="ticket-description">
              {ticket.description}
            </Typography>
            <Divider className="divider-spacing" />

            <div>
              <Typography variant="h6">Messages:</Typography>
              {/* <div className="message-list">
                {messages.map((msg) => (
                  <div key={msg.id} className="message-item">
                    <strong>{sendersMap[msg.senderId] || 'Anonymous'}:</strong> {msg.message}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div> */}
              <div className="message-list">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-item ${
                      msg.senderId === getAuth().currentUser.uid
                        ? "sent"
                        : "received"
                    }`}
                  >
                    <span className="sender">
                      {sendersMap[msg.senderId] || "Anonymous"}:
                    </span>{" "}
                    {msg.message}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <TextField
                multiline
                rows={2}
                variant="outlined"
                fullWidth
                placeholder="Enter your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SendIcon
                        onClick={handleSendMessage}
                        style={{ cursor: "pointer" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              {/* <Button variant="contained" color="primary" onClick={handleSendMessage}>Send</Button> */}
              {/* <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                className="send-button"
              >
                Send
              </Button> */}
            </div>

            <div>
              <input
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="file-input"
              />
              <label htmlFor="file-input">
                {/* <Button variant="contained" component="span">
                  Attach File
                </Button> */}
              </label>
              {attachment && (
                <Button variant="contained" onClick={handleFileUpload}>
                  Upload
                </Button>
              )}
            </div>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className="ticket-info">
              <Typography variant="h6">Ticket Info</Typography>
              <Divider className="divider-spacing" />
              <Typography>
                <strong>Ticket ID:</strong> {ticketId}
              </Typography>
              <Typography>
                <strong>Device Type:</strong> {ticket.deviceType || "N/A"}
              </Typography>
              <Typography>
                <strong>Issue Type:</strong> {ticket.issueType || "N/A"}
              </Typography>
              <Typography>
                <strong>Priority:</strong> {priority}
              </Typography>
              <Select value={priority} onChange={handlePriorityChange}>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
              <Typography>
                <strong>Status:</strong> {status}
              </Typography>
              <Select value={status} onChange={handleStatusChange}>
                {/* <MenuItem value="Raised">Raised</MenuItem> */}
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>

              <Typography>
                  <strong>Status Changed Time:</strong> {ticket.statusUpdatedTime} <br/>
                  <strong>Status Updated Date:</strong> {ticket.statusUpdatedDate} 
              </Typography> 
               

              <Typography>
  <Attachment fontSize="small" /> <strong>Attached File:</strong>
  {(ticket.attachmentURL || ticket.attachmentUrl) && (
    <a href={ticket.attachmentURL || ticket.attachmentUrl} target="_blank" rel="noopener noreferrer">
      View Attachment
    </a>
  )}
</Typography>
              <Typography>
                <strong>Assigned Admin:</strong> {assignedAdmin}
              </Typography>
              <Button onClick={() => setShowAdminList(!showAdminList)}>
                Change Admin
              </Button>
              {showAdminList && (
                <div className="admin-list">
                  {admins.map((admin) => (
                    <Button
                      key={admin.id}
                      onClick={() => handleAdminSelect(admin.name)}
                    >
                      {admin.name}
                    </Button>
                  ))}
                </div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default TicketDetail;
