
// import admin from "firebase-admin";
// import serviceAccount from "./ticket-raiser-a3891-firebase-adminsdk-ruv27-463c3e36e6.json";

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://ticket-raiser-a3891-default-rtdb.asia-southeast1.firebasedatabase.app"
// });

// // export default admin;
// import admin from "firebase-admin";
// import firebaseConfig from './ticket-raiser-a3891-firebase-adminsdk-ruv27-463c3e36e6.json' assert { type: 'json' };

// // Use firebaseConfig directly as the service account
// admin.initializeApp({
//   credential: admin.credential.cert(firebaseConfig),
//   databaseURL: "https://ticket-raiser-a3891-default-rtdb.asia-southeast1.firebasedatabase.app"
// });

// export default admin;


// import fs from 'fs';
// import admin from "firebase-admin";

// // Read the JSON file using fs module
// const firebaseConfig = JSON.parse(fs.readFileSync('./adminKey.json', 'utf8'));

// // Use firebaseConfig directly as the service account
// admin.initializeApp({
//   credential: admin.credential.cert(firebaseConfig),
//   databaseURL: "https://ticket-raiser-a3891-default-rtdb.asia-southeast1.firebasedatabase.app"
// });

// export default admin;

import admin from "firebase-admin";
import firebaseConfig from './adminKey.json'   assert { type: 'json' };

// Use firebaseConfig directly as the service account
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: "https://trt-new-f11b3-default-rtdb.asia-southeast1.firebasedatabase.app"
});

export default admin;