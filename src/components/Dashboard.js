import React from "react";
import { useState, useEffect } from "react";
import { collection, getDocs, query, getFirestore } from "firebase/firestore";
import { auth } from "../firebase";

const db = getFirestore();

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [loginEvents, setLoginEvents] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;

          // Fetch user details
          const userDocRef = collection(db, "users", userId);
          const userDocSnapshot = await getDocs(userDocRef);
          setUserDetails(userDocSnapshot.data());

          // Fetch login events
          const loginEventsQuery = query(
            collection(db, "users", userId, "loginEvents")
          );
          const loginEventsSnapshot = await getDocs(loginEventsQuery);
          setLoginEvents(loginEventsSnapshot.docs.map((doc) => doc.data()));

          const sessionsQuery = query(
            collection(db, "users", userId, "sessions")
          );
          const sessionsSnapshot = await getDocs(sessionsQuery);
          setSessions(sessionsSnapshot.docs.map((doc) => doc.data()));
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-4">User Dashboard</h1>

      {/*User Details */}
      <div className="mb-8">
        <h2 className="text-3x1 font-semibold mb-4">User Dashboard</h2>
        <table className="table-auto">
          <tbody>
            {Object.entries(userDetails).map(([key, value]) => (
              <tr key={key}>
                <td className="border px-4 py-2">{key}</td>
                <td className="border px-4 py-2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Login Events */}
      <div className="mb-8">
        <h2 className="text-x1 font-semibold mb-2">Login Events</h2>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loginEvents.map((event, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{event.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sessions */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Sessions</h2>
        <table className="table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Start Time</th>
              <th className="border px-4 py-2">End Time</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{session.startTime}</td>
                <td className="border px-4 py-2">{session.endTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

{
  /* <div>
          <p>Email: {userDetails.email}</p>
          <p>Username: {userDetails.username}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Login Events</h2>
        <ul>
          {loginEvents.map((event, index) => (
            <li key={index}>{event.timestamp}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Sessions</h2>
        <ul>
          {sessions.map((session, index) => (
            <li key={index}>
              <p>Start Time: {session.startTime}</p>
              <p>End Time: {session.endTime}</p>
            </li>
          ))}
        </ul>
      </div> */
}
