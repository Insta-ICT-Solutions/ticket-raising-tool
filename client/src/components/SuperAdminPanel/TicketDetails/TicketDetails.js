// // // import React, { useState, useEffect, useRef } from 'react';
// // // import { useLocation, useParams } from 'react-router-dom';
// // // import { getAuth } from 'firebase/auth';
// // // import { db, storage } from '../../../firebase/firebaseconfig'; // Added storage for file handling
// // // import { updateDoc, collection, getDocs, query, orderBy, addDoc, doc, getDoc } from 'firebase/firestore';
// // // import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // For handling attachments
// // // import { Container, Paper, Typography, Button, Divider, Select, MenuItem, TextField, Grid } from '@mui/material';
// // // import SweetAlert from 'sweetalert2';
// // // import './TicketDetails.css';

// // // const TicketDetail = () => {
// // //   const { ticketId } = useParams();
// // //   const location = useLocation();
// // //   const ticket = location.state?.ticket;
// // //   const [admins, setAdmins] = useState([]);
// // //   const [priority, setPriority] = useState(ticket?.priority || 'Medium');
// // //   const [status, setStatus] = useState(ticket?.status || 'Raised');
// // //   const [attachment, setAttachment] = useState(null);
// // //   const [showAdminList, setShowAdminList] = useState(false);
// // //   const [messageInput, setMessageInput] = useState('');
// // //   const [messages, setMessages] = useState([]);
// // //   const [sendersMap, setSendersMap] = useState({});
// // //   const messagesEndRef = useRef(null); // Reference for auto-scrolling to new messages

// // //   useEffect(() => {
// // //     const fetchAdmins = async () => {
// // //       const usersRef = collection(db, 'users');
// // //       const userDocs = await getDocs(usersRef);
// // //       const adminList = userDocs.docs
// // //         .filter(doc => doc.data().role === 'Admin')
// // //         .map(doc => ({
// // //           id: doc.id,
// // //           name: `${doc.data().First_Name} ${doc.data().Last_Name}`,
// // //         }));
// // //       setAdmins(adminList);
// // //     };

// // //     const fetchMessages = async () => {
// // //       const messagesRef = collection(db, `ChatSection/${ticketId}/messages`);
// // //       const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
// // //       const messagesSnap = await getDocs(messagesQuery);
// // //       const fetchedMessages = messagesSnap.docs.map(doc => ({
// // //         id: doc.id,
// // //         ...doc.data(),
// // //       }));

// // //       const newSendersMap = { ...sendersMap };

// // //       await Promise.all(
// // //         fetchedMessages.map(async (msg) => {
// // //           if (!newSendersMap[msg.senderId]) {
// // //             const userDoc = await getDoc(doc(db, `users/${msg.senderId}`)); // Use getDoc instead of doc().get()
// // //             if (userDoc.exists()) {
// // //               newSendersMap[msg.senderId] = `${userDoc.data().First_Name} ${userDoc.data().Last_Name}` || 'Anonymous';
// // //             } else {
// // //               newSendersMap[msg.senderId] = 'Anonymous';
// // //             }
// // //           }
// // //         })
// // //       );

// // //       setSendersMap(newSendersMap);
// // //       setMessages(fetchedMessages);
// // //     };

// // //     fetchAdmins();
// // //     fetchMessages();
// // //   }, [ticketId, sendersMap]);

// // //   // Function to handle attachment selection
// // //   const handleFileChange = (event) => {
// // //     const file = event.target.files[0];
// // //     if (file) {
// // //       setAttachment(file);
// // //     }
// // //   };

// // //   const handlePriorityChange = async (event) => {
// // //     const newPriority = event.target.value;
// // //     setPriority(newPriority);
// // //     try {
// // //       await updateDoc(doc(db, `users/${getAuth().currentUser.uid}/TicketDetails/${ticketId}`), {
// // //         priority: newPriority,
// // //       });
// // //       SweetAlert.fire('Success', `You have selected ${newPriority} priority`, 'success');
// // //     } catch (err) {
// // //       SweetAlert.fire('Error', 'Could not update priority', 'error');
// // //     }
// // //   };

// // //   const handleStatusChange = async (event) => {
// // //     const newStatus = event.target.value;
// // //     setStatus(newStatus);
// // //     try {
// // //       await updateDoc(doc(db, `users/${getAuth().currentUser.uid}/TicketDetails/${ticketId}`), {
// // //         status: newStatus,
// // //       });
// // //       SweetAlert.fire('Success', `Status updated to ${newStatus}`, 'success');
// // //     } catch (err) {
// // //       SweetAlert.fire('Error', 'Could not update status', 'error');
// // //     }
// // //   };

// // //   const handleAdminSelect = async (adminName) => {
// // //     const user = getAuth().currentUser;
// // //     if (user) {
// // //       try {
// // //         await updateDoc(doc(db, `users/${user.uid}/TicketDetails/${ticketId}`), {
// // //           assignedTo: adminName,
// // //         });
// // //         setShowAdminList(false);
// // //         SweetAlert.fire('Success', `Assigned to ${adminName}`, 'success');
// // //       } catch (err) {
// // //         SweetAlert.fire('Error', 'Could not assign admin', 'error');
// // //       }
// // //     }
// // //   };

// // //   const handleSendMessage = async () => {
// // //     const auth = getAuth();
// // //     const user = auth.currentUser;
// // //     if (!user || !messageInput) return;

// // //     const newMessage = {
// // //       senderId: user.uid,
// // //       message: messageInput,
// // //       timestamp: new Date(),
// // //     };

// // //     try {
// // //       await db.collection("ChatSection");
// // //       setMessages(prevMessages => [...prevMessages, newMessage]);
// // //       setMessageInput('');
// // //     } catch (err) {
// // //       SweetAlert.fire('Error', 'Could not send message', 'error');
// // //     }
// // //   };

// // //   // Function to upload attachment to Firebase Storage
// // //   const handleFileUpload = async () => {
// // //     if (attachment) {
// // //       const storageRef = ref(storage, `attachments/${ticketId}/${attachment.name}`);
// // //       try {
// // //         await uploadBytes(storageRef, attachment);
// // //         const fileURL = await getDownloadURL(storageRef);
// // //         SweetAlert.fire('Success', 'File uploaded successfully!', 'success');
// // //         setAttachment(null); // Clear the attachment state after upload
// // //       } catch (err) {
// // //         SweetAlert.fire('Error', 'Failed to upload file', 'error');
// // //       }
// // //     }
// // //   };

// // //   const scrollToBottom = () => {
// // //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// // //   };

// // //   useEffect(() => {
// // //     scrollToBottom(); // Automatically scroll to the bottom when messages are updated
// // //   }, [messages]);

// // //   if (!ticket) {
// // //     return <Typography variant="h6" color="error">No ticket data available.</Typography>;
// // //   }

// // //   return (
// // //     <Container maxWidth="lg" className="ticket-details-container">
// // //       <Paper elevation={4} className="ticket-details-paper">
// // //         <Typography variant="h4" className="ticket-title" gutterBottom>
// // //           {ticket.subject}
// // //         </Typography>
// // //         <Divider className="divider-spacing" />
// // //         <div className="ticket-details-content">
// // //           <Grid container spacing={4}>
// // //             <Grid item xs={12} md={8}>
// // //               <Typography variant="h6">Description:</Typography>
// // //               <Typography className="ticket-description">{ticket.description}</Typography>
// // //               <Divider className="divider-spacing" />

// // //               {/* Chat Message Section */}
// // //               <div style={{ marginTop: '20px' }}>
// // //                 <Typography variant="h6">Messages:</Typography>
// // //                 <div className="message-list">
// // //                   {messages.map(msg => (
// // //                     <div key={msg.id} className="message-item">
// // //                       <strong>{sendersMap[msg.senderId] || 'Anonymous'}:</strong> {msg.message}
// // //                     </div>
// // //                   ))}
// // //                   <div ref={messagesEndRef} />
// // //                 </div>
// // //                 <TextField
// // //                   multiline
// // //                   rows={2}
// // //                   variant="outlined"
// // //                   fullWidth
// // //                   placeholder="Enter your message..."
// // //                   className="reply-input"
// // //                   value={messageInput}
// // //                   onChange={(e) => setMessageInput(e.target.value)}
// // //                 />
// // //                 <Button
// // //                   variant="contained"
// // //                   color="primary"
// // //                   className="send-button"
// // //                   onClick={handleSendMessage}
// // //                 >
// // //                   Send
// // //                 </Button>
// // //               </div>

// // //               <div style={{ marginTop: '20px' }}>
// // //                 <input
// // //                   id="file-input"
// // //                   type="file"
// // //                   className="file-input"
// // //                   onChange={handleFileChange}
// // //                   title="Attach files"
// // //                   style={{ display: 'none' }}
// // //                 />
// // //                 <label htmlFor="file-input">
// // //                   <Button variant="contained" component="span">Attach File</Button>
// // //                 </label>
// // //                 {attachment && (
// // //                   <div>
// // //                     <span className="file-name">{attachment.name}</span>
// // //                     <Button variant="contained" onClick={handleFileUpload}>Upload</Button>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </Grid>
// // //             <Grid item xs={12} md={4}>
// // //               <Paper className="ticket-info">
// // //                 <Typography variant="h6">Ticket Info</Typography>
// // //                 <Divider className="divider-spacing" />
// // //                 <Typography><strong>Priority:</strong> {priority}</Typography>
// // //                 <Select value={priority} onChange={handlePriorityChange}>
// // //                   <MenuItem value="Low">Low</MenuItem>
// // //                   <MenuItem value="Medium">Medium</MenuItem>
// // //                   <MenuItem value="High">High</MenuItem>
// // //                 </Select>

// // //                 <Divider className="divider-spacing" />
// // //                 <Typography><strong>Status:</strong> {status}</Typography>
// // //                 <Select value={status} onChange={handleStatusChange}>
// // //                   <MenuItem value="Raised">Raised</MenuItem>
// // //                   <MenuItem value="In Progress">In Progress</MenuItem>
// // //                   <MenuItem value="Resolved">Resolved</MenuItem>
// // //                   <MenuItem value="Closed">Closed</MenuItem>
// // //                 </Select>

// // //                 <Divider className="divider-spacing" />
// // //                 <Typography><strong>Assigned To:</strong> {ticket.assignedTo || 'Not Assigned'}</Typography>
// // //                 {showAdminList && (
// // //                   <div>
// // //                     {admins.map(admin => (
// // //                       <Button key={admin.id} onClick={() => handleAdminSelect(admin.name)}>{admin.name}</Button>
// // //                     ))}
// // //                   </div>
// // //                 )}
// // //                 <Button variant="outlined" onClick={() => setShowAdminList(!showAdminList)}>
// // //                   {showAdminList ? 'Hide Admin List' : 'Show Admin List'}
// // //                 </Button>
// // //               </Paper>
// // //             </Grid>
// // //           </Grid>
// // //         </div>
// // //       </Paper>
// // //     </Container>
// // //   );
// // // };

// // // export default TicketDetail;



// import React, { useState, useEffect, useRef } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import {
//   Container,
//   Paper,
//   Typography,
//   Button,
//   Divider,
//   Select,
//   MenuItem,
//   TextField,
//   Grid,
//   InputAdornment,
// } from "@mui/material";
// import { Send as SendIcon } from "@mui/icons-material"; // Importing Send Icon from Material UI
// import { db, storage } from "../../../firebase/firebaseconfig";
// import {
//   updateDoc,
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   addDoc,
//   getDoc,
//   doc,
//   serverTimestamp,
//   onSnapshot,
// } from "firebase/firestore";
// import { ref, uploadBytes } from "firebase/storage";
// import SweetAlert from "sweetalert2";
// import "./TicketDetails.css";

// const TicketDetail = () => {
//   const { ticketId } = useParams();
//   const location = useLocation();
//   const ticket = location.state?.ticket;

//   const [admins, setAdmins] = useState([]);
//   const [priority, setPriority] = useState(ticket?.priority || "Medium");
//   const [status, setStatus] = useState(ticket?.status || "Raised");
//   const [attachment, setAttachment] = useState(null);
//   const [showAdminList, setShowAdminList] = useState(false);
//   const [messageInput, setMessageInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [sendersMap, setSendersMap] = useState({});
//   const [assignedAdmin, setAssignedAdmin] = useState(ticket?.assignedTo || "");
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const fetchAdmins = async () => {
//       const userDocs = await getDocs(collection(db, "users"));
//       const adminData = userDocs.docs
//         .filter((doc) => doc.data().role === "Admin")
//         .map((doc) => ({
//           id: doc.id,
//           name: `${doc.data().First_Name} ${doc.data().Last_Name}`,
//           employeeId: doc.data().Employee_ID,
//         }));
//       setAdmins(adminData);
//     };

//     const unsubscribe = onSnapshot(
//       query(
//         collection(db, `ChatSection/${ticketId}/messages`),
//         orderBy("timestamp", "asc")
//       ),
//       async (snapshot) => {
//         const fetchedMessages = snapshot.docs.map((msgDoc) => ({
//           id: msgDoc.id,
//           ...msgDoc.data(),
//         }));
//         setMessages(fetchedMessages);

//         const senderIds = [
//           ...new Set(fetchedMessages.map((msg) => msg.senderId)),
//         ];
//         const senderDocs = await Promise.all(
//           senderIds.map((id) => getDoc(doc(db, "users", id)))
//         );
//         const newSendersMap = {};
//         senderDocs.forEach((userDoc, index) => {
//           newSendersMap[senderIds[index]] = userDoc.exists()
//             ? `${userDoc.data().First_Name} ${userDoc.data().Last_Name}`
//             : "Anonymous";
//         });
//         setSendersMap(newSendersMap);
//       }
//     );

//     fetchAdmins();
//     return () => unsubscribe();
//   }, [ticketId]);

//   const handleFileChange = (event) =>
//     setAttachment(event.target.files[0] || null);

//   // Separate function to update priority in both collections
//   const updatePriority = async (newPriority) => {
//     try {
//       const ticketDoc = doc(
//         db,
//         `users/${ticket.createdBy}/TicketDetails/${ticketId}`
//       );
//       const listDoc = doc(db, `TicketList/${ticketId}`);
//       await updateDoc(ticketDoc, { priority: newPriority });
//       await updateDoc(listDoc, { priority: newPriority });
//       SweetAlert.fire("Success", `Priority set to ${newPriority}`, "success");
//     } catch (err) {
//       SweetAlert.fire("Error", "Could not update priority", "error");
//     }
//   };

//   const handlePriorityChange = (event) => {
//     const newPriority = event.target.value;
//     if (newPriority !== priority) {
//       setPriority(newPriority);
//       updatePriority(newPriority);
//     }
//   };

//   // Separate function to update status in both collections
//   const updateStatus = async (newStatus) => {
//     try {
//       const ticketDoc = doc(
//         db,
//         `users/${ticket.createdBy}/TicketDetails/${ticketId}`
//       );
//       const listDoc = doc(db, `TicketList/${ticketId}`);
//       await updateDoc(ticketDoc, { status: newStatus });
//       await updateDoc(listDoc, { status: newStatus });
//       SweetAlert.fire("Success", `Status updated to ${newStatus}`, "success");
//     } catch (err) {
//       SweetAlert.fire("Error", "Could not update status", "error");
//     }
//   };

//   const handleStatusChange = (event) => {
//     const newStatus = event.target.value;
//     if (newStatus !== status) {
//       setStatus(newStatus);
//       updateStatus(newStatus);
//     }
//   };

//   //   // Separate function to update assigned admin in both collections
//   const updateAssignedAdmin = async (adminName) => {
//     try {
//       // Find the selected admin's Employee_Id
//       // const selectedAdmin = admins.find((admin) => admin.name === adminName);
//       // const employeeId = selectedAdmin ? selectedAdmin.employeeId : '';
//       // console.log("Admin Employee ID:", employeeId);
//       console.log("Selected Admin Name:", adminName); // Log the admin name being passed
//       const selectedAdmin = admins.find(
//         (admin) => admin.name.toLowerCase() === adminName.toLowerCase()
//       );
//       console.log("Selected Admin:", selectedAdmin); // Log the selected admin object
//       const employeeId = selectedAdmin ? selectedAdmin.employeeId : "";
//       console.log("Admin Employee ID:", employeeId);
//       if (employeeId) {
//         // Update the assigned admin name and Employee_Id in both collections
//         const ticketDoc = doc(
//           db,
//           `users/${ticket.createdBy}/TicketDetails/${ticketId}`
//         );
//         const listDoc = doc(db, `TicketList/${ticketId}`);
//         await updateDoc(ticketDoc, {
//           assignedTo: adminName,
//           assignedId: employeeId,
//         });
//         await updateDoc(listDoc, {
//           assignedTo: adminName,
//           assignedId: employeeId,
//         });

//         // Update the local state

//         SweetAlert.fire(
//           "Success",
//           `Assigned to ${adminName} (ID: ${employeeId})`,
//           "success"
//         );
//       } else {
//         SweetAlert.fire("Error", "Admin Employee ID not found", "error");
//       }
//     } catch (err) {
//       SweetAlert.fire("Error", "Could not assign admin", "error");
//     }
//   };

//   const handleAdminSelect = (adminName) => {
//     setAssignedAdmin(adminName);
//     setShowAdminList(false);
//     updateAssignedAdmin(adminName);
//   };

//   const handleSendMessage = async () => {
//     const user = getAuth().currentUser;
//     if (user && messageInput) {
//       const newMessage = {
//         senderId: user.uid,
//         message: messageInput,
//         timestamp: serverTimestamp(),
//       };
//       try {
//         await addDoc(
//           collection(db, `ChatSection/${ticketId}/messages`),
//           newMessage
//         );
//         setMessageInput("");
//       } catch (err) {
//         SweetAlert.fire("Error", "Could not send message", "error");
//       }
//     }
//   };

//   const handleFileUpload = async () => {
//     if (attachment) {
//       try {
//         const fileRef = ref(
//           storage,
//           `attachments/${ticketId}/${attachment.name}`
//         );
//         await uploadBytes(fileRef, attachment);
//         SweetAlert.fire("Success", "File uploaded successfully!", "success");
//         setAttachment(null);
//       } catch (err) {
//         SweetAlert.fire("Error", "Failed to upload file", "error");
//       }
//     }
//   };

//   const scrollToBottom = () =>
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   useEffect(scrollToBottom, [messages]);

//   return (
//     <Container maxWidth="lg" className="ticket-details-container">
//       <Paper elevation={4} className="ticket-details-paper">
//         <Typography variant="h4" className="ticket-title" gutterBottom>
//           {ticket.subject}
//         </Typography>
//         <Divider className="divider-spacing" />

//         <Grid container spacing={4}>
//           <Grid item xs={12} md={8}>
//             <Typography variant="h6">Description:</Typography>
//             <Typography className="ticket-description">
//               {ticket.description}
//             </Typography>
//             <Divider className="divider-spacing" />

//             <div>
//               <Typography variant="h6">Messages:</Typography>
//               {/* <div className="message-list">
//                 {messages.map((msg) => (
//                   <div key={msg.id} className="message-item">
//                     <strong>{sendersMap[msg.senderId] || 'Anonymous'}:</strong> {msg.message}
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div> */}
//               <div className="message-list">
//                 {messages.map((msg) => (
//                   <div
//                     key={msg.id}
//                     className={`message-item ${
//                       msg.senderId === getAuth().currentUser.uid
//                         ? "sent"
//                         : "received"
//                     }`}
//                   >
//                     <span className="sender">
//                       {sendersMap[msg.senderId] || "Anonymous"}:
//                     </span>{" "}
//                     {msg.message}
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div>

//               <TextField
//                 multiline
//                 rows={2}
//                 variant="outlined"
//                 fullWidth
//                 placeholder="Enter your message..."
//                 value={messageInput}
//                 onChange={(e) => setMessageInput(e.target.value)}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <SendIcon
//                         onClick={handleSendMessage}
//                         style={{ cursor: "pointer" }}
//                       />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//               {/* <Button variant="contained" color="primary" onClick={handleSendMessage}>Send</Button> */}
//               {/* <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSendMessage}
//                 className="send-button"
//               >
//                 Send
//               </Button> */}
//             </div>

//             <div>
//               <input
//                 type="file"
//                 onChange={handleFileChange}
//                 style={{ display: "none" }}
//                 id="file-input"
//               />
//               <label htmlFor="file-input">
//                 <Button variant="contained" component="span">
//                   Attach File
//                 </Button>
//               </label>
//               {attachment && (
//                 <Button variant="contained" onClick={handleFileUpload}>
//                   Upload
//                 </Button>
//               )}
//             </div>
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <Paper className="ticket-info">
//               <Typography variant="h6">Ticket Info</Typography>
//               <Divider className="divider-spacing" />
//               <Typography>
//                 <strong>Ticket ID:</strong> {ticketId}
//               </Typography>
//               <Typography>
//                 <strong>Device Type:</strong> {ticket.deviceType || "N/A"}
//               </Typography>
//               <Typography>
//                 <strong>Issue Type:</strong> {ticket.issueType || "N/A"}
//               </Typography>
//               <Typography>
//                 <strong>Priority:</strong> {priority}
//               </Typography>
//               <Select value={priority} onChange={handlePriorityChange}>
//                 <MenuItem value="Low">Low</MenuItem>
//                 <MenuItem value="Medium">Medium</MenuItem>
//                 <MenuItem value="High">High</MenuItem>
//               </Select>
//               <Typography>
//                 <strong>Status:</strong> {status}
//               </Typography>
//               <Select value={status} onChange={handleStatusChange}>
//                 <MenuItem value="Raised">Raised</MenuItem>
//                 <MenuItem value="In Progress">In Progress</MenuItem>
//                 <MenuItem value="Resolved">Resolved</MenuItem>
//                 <MenuItem value="Closed">Closed</MenuItem>
//               </Select>
//               <Typography>
//                 <strong>Assigned Admin:</strong> {assignedAdmin}
//               </Typography>
//               <Button onClick={() => setShowAdminList(!showAdminList)}>
//                 Change Admin
//               </Button>
//               {showAdminList && (
//                 <div className="admin-list">
//                   {admins.map((admin) => (
//                     <Button
//                       key={admin.id}
//                       onClick={() => handleAdminSelect(admin.name)}
//                     >
//                       {admin.name}
//                     </Button>
//                   ))}
//                 </div>
//               )}
//             </Paper>
//           </Grid>
//         </Grid>
//       </Paper>
//     </Container>
//   );
// };

// export default TicketDetail;

// // import React, { useState, useEffect, useRef } from "react";
// // import { useLocation, useParams } from "react-router-dom";
// // import { getAuth } from "firebase/auth";
// // import {
// //   Container,
// //   Paper,
// //   Typography,
// //   Button,
// //   Divider,
// //   Select,
// //   MenuItem,
// //   TextField,
// //   Grid,
// //   InputAdornment,
// // } from "@mui/material";
// // import { Send as SendIcon } from "@mui/icons-material"; 
// // import { db, storage } from "../../../firebase/firebaseconfig";
// // import {
// //   updateDoc,
// //   collection,
// //   getDocs,
// //   query,
// //   orderBy,
// //   addDoc,
// //   getDoc,
// //   doc,
// //   serverTimestamp,
// //   onSnapshot,
// // } from "firebase/firestore";
// // import { ref, uploadBytes } from "firebase/storage";
// // import SweetAlert from "sweetalert2";
// // import "./TicketDetails.css";

// // const TicketDetail = () => {
// //   const { ticketId } = useParams();
// //   const location = useLocation();
// //   const ticket = location.state?.ticket;

// //   const [admins, setAdmins] = useState([]);
// //   const [filteredAdmins, setFilteredAdmins] = useState([]);
// //   const [priority, setPriority] = useState(ticket?.priority || "Medium");
// //   const [status, setStatus] = useState(ticket?.status || "Raised");
// //   const [attachment, setAttachment] = useState(null);
// //   const [showAdminList, setShowAdminList] = useState(false);
// //   const [messageInput, setMessageInput] = useState("");
// //   const [messages, setMessages] = useState([]);
// //   const [sendersMap, setSendersMap] = useState({});
// //   const [assignedAdmin, setAssignedAdmin] = useState(ticket?.assignedTo || "");
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const messagesEndRef = useRef(null);

// //   useEffect(() => {
// //     const fetchAdmins = async () => {
// //       const userDocs = await getDocs(collection(db, "users"));
// //       const adminData = userDocs.docs
// //         .filter((doc) => doc.data().role === "Admin")
// //         .map((doc) => ({
// //           id: doc.id,
// //           name: `${doc.data().First_Name} ${doc.data().Last_Name}`,
// //           employeeId: doc.data().Employee_ID,
// //         }));
// //       setAdmins(adminData);
// //       setFilteredAdmins(adminData); // Initialize filteredAdmins with all admins
// //     };

// //     const unsubscribe = onSnapshot(
// //       query(
// //         collection(db, `ChatSection/${ticketId}/messages`),
// //         orderBy("timestamp", "asc")
// //       ),
// //       async (snapshot) => {
// //         const fetchedMessages = snapshot.docs.map((msgDoc) => ({
// //           id: msgDoc.id,
// //           ...msgDoc.data(),
// //         }));
// //         setMessages(fetchedMessages);

// //         const senderIds = [
// //           ...new Set(fetchedMessages.map((msg) => msg.senderId)),
// //         ];
// //         const senderDocs = await Promise.all(
// //           senderIds.map((id) => getDoc(doc(db, "users", id)))
// //         );
// //         const newSendersMap = {};
// //         senderDocs.forEach((userDoc, index) => {
// //           newSendersMap[senderIds[index]] = userDoc.exists()
// //             ? `${userDoc.data().First_Name} ${userDoc.data().Last_Name}`
// //             : "Anonymous";
// //         });
// //         setSendersMap(newSendersMap);
// //       }
// //     );

// //     fetchAdmins();
// //     return () => unsubscribe();
// //   }, [ticketId]);

// //   const handleSearchChange = (event) => {
// //     const query = event.target.value.toLowerCase();
// //     setSearchQuery(query);
// //     setFilteredAdmins(
// //       admins.filter((admin) =>
// //         admin.name.toLowerCase().includes(query)
// //       )
// //     );
// //   };

// //   const handleFileChange = (event) => setAttachment(event.target.files[0] || null);

// //   const updatePriority = async (newPriority) => {
// //     try {
// //       const ticketDoc = doc(
// //         db,
// //         `users/${ticket.createdBy}/TicketDetails/${ticketId}`
// //       );
// //       const listDoc = doc(db, `TicketList/${ticketId}`);
// //       await updateDoc(ticketDoc, { priority: newPriority });
// //       await updateDoc(listDoc, { priority: newPriority });
// //       SweetAlert.fire("Success", `Priority set to ${newPriority}`, "success");
// //     } catch (err) {
// //       SweetAlert.fire("Error", "Could not update priority", "error");
// //     }
// //   };

// //   const handlePriorityChange = (event) => {
// //     const newPriority = event.target.value;
// //     if (newPriority !== priority) {
// //       setPriority(newPriority);
// //       updatePriority(newPriority);
// //     }
// //   };

// //   const updateStatus = async (newStatus) => {
// //     try {
// //       const ticketDoc = doc(
// //         db,
// //         `users/${ticket.createdBy}/TicketDetails/${ticketId}`
// //       );
// //       const listDoc = doc(db, `TicketList/${ticketId}`);
// //       await updateDoc(ticketDoc, { status: newStatus });
// //       await updateDoc(listDoc, { status: newStatus });
// //       SweetAlert.fire("Success", `Status updated to ${newStatus}`, "success");
// //     } catch (err) {
// //       SweetAlert.fire("Error", "Could not update status", "error");
// //     }
// //   };

// //   const handleStatusChange = (event) => {
// //     const newStatus = event.target.value;
// //     if (newStatus !== status) {
// //       setStatus(newStatus);
// //       updateStatus(newStatus);
// //     }
// //   };

// //   const updateAssignedAdmin = async (adminName) => {
// //     try {
// //       const selectedAdmin = admins.find(
// //         (admin) => admin.name.toLowerCase() === adminName.toLowerCase()
// //       );
// //       const employeeId = selectedAdmin ? selectedAdmin.employeeId : "";
// //       if (employeeId) {
// //         const ticketDoc = doc(
// //           db,
// //           `users/${ticket.createdBy}/TicketDetails/${ticketId}`
// //         );
// //         const listDoc = doc(db, `TicketList/${ticketId}`);
// //         await updateDoc(ticketDoc, {
// //           assignedTo: adminName,
// //           assignedId: employeeId,
// //         });
// //         await updateDoc(listDoc, {
// //           assignedTo: adminName,
// //           assignedId: employeeId,
// //         });
// //         SweetAlert.fire(
// //           "Success",
// //           `Assigned to ${adminName} (ID: ${employeeId})`,
// //           "success"
// //         );
// //       } else {
// //         SweetAlert.fire("Error", "Admin Employee ID not found", "error");
// //       }
// //     } catch (err) {
// //       SweetAlert.fire("Error", "Could not assign admin", "error");
// //     }
// //   };

// //   const handleAdminSelect = (adminName) => {
// //     setAssignedAdmin(adminName);
// //     setShowAdminList(false);
// //     updateAssignedAdmin(adminName);
// //   };

// //   const handleSendMessage = async () => {
// //     const user = getAuth().currentUser;
// //     if (user && messageInput) {
// //       const newMessage = {
// //         senderId: user.uid,
// //         message: messageInput,
// //         timestamp: serverTimestamp(),
// //       };
// //       try {
// //         await addDoc(
// //           collection(db, `ChatSection/${ticketId}/messages`),
// //           newMessage
// //         );
// //         setMessageInput("");
// //       } catch (err) {
// //         SweetAlert.fire("Error", "Could not send message", "error");
// //       }
// //     }
// //   };

// //   const handleFileUpload = async () => {
// //     if (attachment) {
// //       try {
// //         const fileRef = ref(
// //           storage,
// //           `attachments/${ticketId}/${attachment.name}`
// //         );
// //         await uploadBytes(fileRef, attachment);
// //         SweetAlert.fire("Success", "File uploaded successfully!", "success");
// //         setAttachment(null);
// //       } catch (err) {
// //         SweetAlert.fire("Error", "Failed to upload file", "error");
// //       }
// //     }
// //   };

// //   const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   useEffect(scrollToBottom, [messages]);

// //   return (
// //     <Container maxWidth="lg" className="ticket-details-container">
// //       <Paper elevation={4} className="ticket-details-paper">
// //         <Typography variant="h4" className="ticket-title" gutterBottom>
// //           {ticket.subject}
// //         </Typography>
// //         <Divider className="divider-spacing" />

// //         <Grid container spacing={4}>
// //           <Grid item xs={12} md={8}>
// //             <Typography variant="h6">Description:</Typography>
// //             <Typography className="ticket-description">
// //               {ticket.description}
// //             </Typography>
// //             <Divider className="divider-spacing" />

// //             <div>
// //               <Typography variant="h6">Messages:</Typography>
// //               <div className="message-list">
// //                 {messages.map((msg) => (
// //                   <div
// //                     key={msg.id}
// //                     className={`message-item ${
// //                       msg.senderId === getAuth().currentUser.uid
// //                         ? "sent"
// //                         : "received"
// //                     }`}
// //                   >
// //                     <span className="sender">
// //                       {sendersMap[msg.senderId] || "Anonymous"}:
// //                     </span>{" "}
// //                     {msg.message}
// //                   </div>
// //                 ))}
// //                 <div ref={messagesEndRef} />
// //               </div>
// //               <TextField
// //                 fullWidth
// //                 variant="outlined"
// //                 label="Write a message"
// //                 value={messageInput}
// //                 onChange={(e) => setMessageInput(e.target.value)}
// //                 className="message-input"
// //                 multiline
// //                 rows={2}
// //               />
// //               <Button
// //                 variant="contained"
// //                 color="primary"
// //                 onClick={handleSendMessage}
// //                 className="send-message-btn"
// //                 startIcon={<SendIcon />}
// //               >
// //                 Send
// //               </Button>
// //             </div>
// //           </Grid>

// //           <Grid item xs={12} md={4}>
// //             <Typography variant="h6">Ticket Information</Typography>
// //             <div className="ticket-info">
// //               <Select value={priority} onChange={handlePriorityChange} fullWidth>
// //                 <MenuItem value="High">High</MenuItem>
// //                 <MenuItem value="Medium">Medium</MenuItem>
// //                 <MenuItem value="Low">Low</MenuItem>
// //               </Select>
// //               <Select value={status} onChange={handleStatusChange} fullWidth>
// //                 <MenuItem value="Raised">Raised</MenuItem>
// //                 <MenuItem value="In Progress">In Progress</MenuItem>
// //                 <MenuItem value="Resolved">Resolved</MenuItem>
// //               </Select>
// //               <TextField
// //                 label="Assigned Admin"
// //                 value={assignedAdmin}
// //                 onClick={() => setShowAdminList(!showAdminList)}
// //                 fullWidth
// //                 variant="outlined"
// //                 inputProps={{
// //                   readOnly: true,
// //                 }}
// //               />
// //               {showAdminList && (
// //                 <div className="admin-list">
// //                   <TextField
// //                     label="Search Admins"
// //                     value={searchQuery}
// //                     onChange={handleSearchChange}
// //                     fullWidth
// //                     variant="outlined"
// //                   />
// //                   {filteredAdmins.map((admin) => (
// //                     <MenuItem
// //                       key={admin.id}
// //                       onClick={() => handleAdminSelect(admin.name)}
// //                     >
// //                       {admin.name} ({admin.employeeId})
// //                     </MenuItem>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           </Grid>
// //         </Grid>
// //       </Paper>
// //     </Container>
// //   );
// // };

// // export default TicketDetail;



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
      const ticketDoc = doc(
        db,
        `users/${ticket.createdBy}/TicketDetails/${ticketId}`
      );
      const listDoc = doc(db, `TicketList/${ticketId}`);
      await updateDoc(ticketDoc, { priority: newPriority });
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
  const updateStatus = async (newStatus) => {
    try {
      const ticketDoc = doc(
        db,
        `users/${ticket.createdBy}/TicketDetails/${ticketId}`
      );
      const listDoc = doc(db, `TicketList/${ticketId}`);
      await updateDoc(ticketDoc, { status: newStatus });
      await updateDoc(listDoc, { status: newStatus });
      SweetAlert.fire("Success", `Status updated to ${newStatus}`, "success");
    } catch (err) {
      SweetAlert.fire("Error", "Could not update status", "error");
    }
  };

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
                <MenuItem value="Raised">Raised</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>

              <Typography>
  <Attachment fontSize="small" /> <strong>Attached File:</strong>
  {ticket.attachmentURL && (
    <a href={ticket.attachmentURL} target="_blank" rel="noopener noreferrer">
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