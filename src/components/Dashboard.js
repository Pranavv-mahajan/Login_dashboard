import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { getDocs, collection, where, query } from "firebase/firestore";
import { updateDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import YesterdayDetails from "./YesterdayDetails";
import OverallDetails from "./OverallDetails";
import { QuerySnapshot } from "firebase/firestore";
import "./DashBoard.css";
import YesterdayTable from "./YesterdayDetails";
import OverallTable from "./OverallDetails";

const Dashboard = () => {
  const location = useLocation();
  const Navigate = useNavigate();

  const [user] = useState(location.state.user);
  const [docid] = useState(location.state.docid);
  const [sessions, setSessions] = useState([]);
  const [showUserStats, setShowUserStats] = useState(false);

  const toggleUserStats = () => {
    setShowUserStats(!showUserStats);
  };
  const updateSessions = (updatedSessions) => {
    setSessions(updatedSessions);
  };


  useEffect(() => {
    getData(false); // Fetch overall data by default
  }, [docid]);

  const getData = async (getYesterday) => {
    if (getYesterday) {
      await getYesterdaysData();
    } else {
      await getOverallData();
    }
  };

  const getOverallData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "session"));
      const sessionData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const createdTime = new Date(data.createdTime.seconds * 1000);
          const endTime = data.endTime
            ? new Date(data.endTime.seconds * 1000)
            : null;

          const email = await getUserfromId(data.user); // Wait for the Promise to resolve

          const timeSpent = endTime ? endTime - createdTime : 0;

          return {
            id: doc.id,
            email: await email,
            user: data.user,
            createdTime,
            endTime,
            timeSpent,
          };
        })
      );

      setSessions(sessionData);
      console.log("session", sessions);
    } catch (error) {
      console.error("Error fetching overall data:", error);
    }
  };

  const getYesterdaysData = async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
  
    const startOfYesterday = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
      0,
      0,
      0
    );
    const endOfYesterday = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate() + 1,
      0,
      0,
      0
    );
  
    const querySnapshot = await getDocs(
      query(
        collection(db, "session"),
        where("createdTime", ">=", startOfYesterday),
        where("createdTime", "<", endOfYesterday)
      )
    );
  
    const resolvedSessions = [];
  
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      const createdTime = new Date(data.createdTime.seconds * 1000);
      const endTime = data.endTime ? new Date(data.endTime.seconds * 1000) : null;
  
      const emailPromise = getUserfromId(data.user);
      const email = await emailPromise;
  
      const timeSpent = endTime ? endTime - createdTime : 0;
  
      resolvedSessions.push({
        id: doc.id,
        email,
        user: data.user,
        createdTime,
        endTime,
        timeSpent,
      });
    }
  
    updateSessions(resolvedSessions);
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
  const HandleSubmit = async () => {
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
      <div className="user-stats-container">
        <h2 onClick={toggleUserStats}>User Statistics:</h2>
        <ul>
          {Object.keys(userStats).map((key) => (
            <li key={key}>
              <strong>{key}:</strong> {userStats[key]}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={() => getYesterdaysData(true)}>
        Get Yesterday's Details
      </button>
      
      {/* {!showUserStats && <YesterdayDetails sessions={sessions} />} */}
      {!showUserStats && <OverallDetails sessions={sessions} />}
      {/* {showUserStats ? (
        <YesterdayTable sessions={sessions} />
      ) : (
        <OverallTable sessions={sessions} />
      )} */}
      <button onClick={HandleSubmit}>LogOut</button>
    </div>
  );
};

export default Dashboard;
