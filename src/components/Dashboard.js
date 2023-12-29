import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "./DashBoard.css";
import { auth, db } from "../firebase";
import { updateDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";

const Dashboard = () => {
  const location = useLocation();

  const [user, setUser] = useState("");
  const [docid, setdocid] = useState("");

  useEffect(() => {
    setUser(location.state.user);
    console.log(user);
    setdocid(location.state.docid);
  }, []);

  const HandleSubmit = async (userCredential) => {
    try {
      await updateDoc(doc(db, "session", docid), {
        endTime: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <button onClick={HandleSubmit}> LogOut</button>
    </div>
  );
};

export default Dashboard;
