import { useEffect, useState } from "react";
import { loginFields } from "../constants/formFields";
import FormAction from "./FormAction";
import FormExtra from "./FormExtra";
import Input from "./Input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  arrayUnion,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Login() {
  const [loginState, setLoginState] = useState(fieldsState);

  const Navigate = useNavigate();

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(loginState);
    authenticateUser();
  };

  //Handle Login API Integration here
  const authenticateUser = async () => {
    signInWithEmailAndPassword(auth, loginState.email, loginState.password)
      .then((userCredential) => {
        updateData(userCredential);
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateData = async (userCredential) => {
    try {
      const docRef = await addDoc(collection(db, "session"), {
        user: userCredential.user.uid,
        createdTime: serverTimestamp(),
      });
      console.log(docRef);
      Navigate("/Dashboard",{ state: {user:userCredential.user.uid, docid: docRef.id }});
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // const fetchAllUsers = async () => {
  //   try {
  //     const usersCollection = collection(db, "LoginHistory");
  //     const usersSnapshot = await getDocs(usersCollection);
  //     const usersData = usersSnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching all users: ", error);
  //   }
  // };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={loginState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
      </div>

      <FormExtra />
      <FormAction handleSubmit={handleSubmit} text="Login" />
    </form>
  );
}
