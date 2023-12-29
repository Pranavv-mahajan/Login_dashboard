import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "./DashBoard.css";
import { auth, db } from "../firebase";


const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [userSessions, setUserSessions] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserSessions();
    }
  }, [user]);

  const fetchUserSessions = async () => {
    try {
      const userSessionsRef = db
        .collection("userSessions")
        .doc(user.uid)
        .collection("sessions");
      const snapshot = await userSessionsRef.get();
      const sessionsData = snapshot.docs.map((doc) => doc.data());
      setUserSessions(sessionsData);
    } catch (error) {
      console.error("Error fetching user sessions:", error);
    }
  };

  const startSession = async () => {
    try {
      const userSessionsRef = db
        .collection("userSessions")
        .doc(user.uid)
        .collection("sessions");
      await userSessionsRef.add({
        startTime: new Date(),
        endTime: null,
        visitCount: 1,
      });
      fetchUserSessions();
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  const endSession = async () => {
    try {
      const lastSession = userSessions[userSessions.length - 1];
      if (lastSession && !lastSession.endTime) {
        const userSessionDocRef = db
          .collection("userSessions")
          .doc(user.uid)
          .collection("sessions")
          .doc(lastSession.id);
        await userSessionDocRef.update({
          endTime: new Date(),
          visitCount: lastSession.visitCount + 1,
        });
        fetchUserSessions();
      }
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  const calculateSessionDuration = (session) => {
    if (session.startTime && session.endTime) {
      const startTimestamp = session.startTime.toMillis();
      const endTimestamp = session.endTime.toMillis();
      const durationInSeconds = Math.floor(
        (endTimestamp - startTimestamp) / 1000
      );
      return durationInSeconds;
    }
    return 0;
  };


  return (
    <div>
      <h1>User Sessions Dashboard</h1>
      {/* <button onClick={startSession}>Start Session</button>
      <button onClick={endSession}>End Session</button> */}
      <table >
        <thead>
          <tr>
            <th>UserId</th>
            <th>Email</th>
            <th>StartTime</th>
            <th>visitCount</th>
            <th>TimeInSec</th>
          </tr>
        </thead>
        <tbody>
          {userSessions.map((session, index) => (
            <tr key={index}>
              <td>{session.startTime?.toDate().toLocaleString()}</td>
              <td>{session.endTime?.toDate().toLocaleString()}</td>
              <td>{calculateSessionDuration(session)}</td>
              <td>{session.visitCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;

// import React from "react";
// import { useState, useEffect } from "react";
// import { collection, getDocs, query, getFirestore } from "firebase/firestore";
// import { auth } from "../firebase";

// const db = getFirestore();

// const Dashboard = () => {
//   const [userDetails, setUserDetails] = useState([]);
//   const [loginEvents, setLoginEvents] = useState([]);
//   const [sessions, setSessions] = useState([]);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const user = auth.currentUser;
//         if (user) {
//           const userId = user.uid;

//           // Fetch user details
//           const userDocRef = collection(db, "users", userId);
//           const userDocSnapshot = await getDocs(userDocRef);
//           setUserDetails(userDocSnapshot.data());

//           // Fetch login events
//           const loginEventsQuery = query(
//             collection(db, "users", userId, "loginEvents")
//           );
//           const loginEventsSnapshot = await getDocs(loginEventsQuery);
//           setLoginEvents(loginEventsSnapshot.docs.map((doc) => doc.data()));

//           const sessionsQuery = query(
//             collection(db, "users", userId, "sessions")
//           );
//           const sessionsSnapshot = await getDocs(sessionsQuery);
//           setSessions(sessionsSnapshot.docs.map((doc) => doc.data()));
//         }
//       } catch (error) {
//         console.error("Error fetching user data: ", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   return (
//     <div className="container mx-auto mt-10">
//       <h1 className="text-3xl font-semibold mb-4">User Dashboard</h1>

//       {/*User Details */}
//       <div className="mb-8">
//         <h2 className="text-3x1 font-semibold mb-4">User Dashboard</h2>
//         <table className="table-auto">
//           <tbody>
//             {Object.entries(userDetails).map(([key, value]) => (
//               <tr key={key}>
//                 <td className="border px-4 py-2">{key}</td>
//                 <td className="border px-4 py-2">{value}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {/* Login Events */}
//       <div className="mb-8">
//         <h2 className="text-x1 font-semibold mb-2">Login Events</h2>
//         <table className="table-auto">
//           <thead>
//             <tr>z
//               <th className="border px-4 py-2">Timestamp</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loginEvents.map((event, index) => (
//               <tr key={index}>
//                 <td className="border px-4 py-2">{event.timestamp}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Sessions */}
//       <div>
//         <h2 className="text-xl font-semibold mb-2">Sessions</h2>
//         <table className="table-auto">
//           <thead>
//             <tr>
//               <th className="border px-4 py-2">Start Time</th>
//               <th className="border px-4 py-2">End Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sessions.map((session, index) => (
//               <tr key={index}>
//                 <td className="border px-4 py-2">{session.startTime}</td>
//                 <td className="border px-4 py-2">{session.endTime}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
