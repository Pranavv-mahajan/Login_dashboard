import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../firebase"; // Update the path accordingly

export default function FormExtra() {
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check if the user is already authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        // You can redirect or perform other actions here.
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe);
  };

  useEffect(() => {
    // Set persistence based on the "Remember me" checkbox
    const persistence = rememberMe
      ? browserLocalPersistence
      : browserSessionPersistence;

    setPersistence(auth, persistence);
  }, [rememberMe]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          checked={rememberMe}
          onChange={handleCheckboxChange}
        />
        <label
          htmlFor="remember-me"
          className="ml-2 block text-sm text-gray-900"
        >
          Remember me
        </label>
      </div>

      <div className="text-sm">
        <a
          href="#"
          className="font-medium text-purple-600 hover:text-purple-500"
        >
          Forgot your password?
        </a>
      </div>
    </div>
  );
}

// export default function FormExtra() {
//   return (
//     <div className="flex items-center justify-between ">
//       <div className="flex items-center">
//         <input
//           id="remember-me"
//           name="remember-me"
//           type="checkbox"
//           className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//         />
//         <label
//           htmlFor="remember-me"
//           className="ml-2 block text-sm text-gray-900"
//         >
//           Remember me
//         </label>
//       </div>

//       <div className="text-sm">
//         <a
//           href="#"
//           className="font-medium text-purple-600 hover:text-purple-500"
//         >
//           Forgot your password?
//         </a>
//       </div>
//     </div>
//   );
// }
