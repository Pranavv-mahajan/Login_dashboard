import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { useCollectionData } from "react-firebase-hooks/firestore";
import "./DashBoard.css";
import { db } from "../firebase";
import {
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
  getDoc,
  collection,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();

  const [user, setUser] = useState("");
  const [docid, setdocid] = useState("");
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    setUser(location.state.user);
    console.log(user);
    setdocid(location.state.docid);
    getData();
  }, []);

  const Navigate = useNavigate();

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "session"));

    const sessionData = [];
    const promises = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const createdTime = new Date(data.createdTime.seconds * 1000);
      const endTime = data.endTime
        ? new Date(data.endTime.seconds * 1000)
        : null;
      const email = await getUserfromId(data.user);

      const timeSpent = endTime ? endTime - createdTime : 0;

      sessionData.push({
        id: doc.id,
        email,
        user: data.user,
        createdTime,
        endTime,
        timeSpent,
      });
    });

    await Promise.all(promises);

    setSessions(sessionData);
    console.log("session", sessions);
  };

  const calculateUserStats = () => {
    const userStats = {};

    sessions.forEach((session) => {
      const { email, endTime, timeSpent } = session;

      // Calculate frequency
      userStats[email] = userStats[email] ? userStats[email] + 1 : 1;

      // Accumulate time spent
      if (endTime) {
        userStats[`${email}_timeSpent`] = userStats[`${email}_timeSpent`]
          ? userStats[`${email}_timeSpent`] + timeSpent
          : timeSpent;
      }
    });

    return userStats;
  };

  const getUserfromId = async (id) => {
    const docRef = doc(db, "users", id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const email = docSnap.data().email;
        return email;
      } else {
        console.log("No such document!");
        return "Unknown";
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      return "Unknown";
    }
  };

  // const getUserfromId = async (id) => {
  //   const docRef = doc(db, "users", id);
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     console.log("Document data:", docSnap.data());
  //     const email = await docSnap.data().email;
  //     return email;
  //     // return docSnap.data().email;
  //   } else {
  //     // docSnap.data() will be undefined in this case
  //     console.log("No such document!");
  //   }
  // };

  const HandleSubmit = async (userCredential) => {
    try {
      await updateDoc(doc(db, "session", docid), {
        endTime: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    Navigate("/");
  };

  const userStats = calculateUserStats();

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Created Time</th>
            <th>End Time</th>
            <th>Time Spent (milliseconds)</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id}>
              <td>{session.email}</td>
              <td>{session.createdTime.toString()}</td>
              <td>{session.endTime ? session.endTime.toString() : ""}</td>
              <td>{session.timeSpent}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>User Statistics:</h2>
        {Object.keys(userStats).map((key) => (
          <p key={key}>
            {key}: {userStats[key]}
          </p>
        ))}
      </div>
      <button onClick={HandleSubmit}> LogOut</button>
    </div>
  );
};

export default Dashboard;
