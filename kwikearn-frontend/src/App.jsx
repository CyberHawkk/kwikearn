import React, { useEffect, useState } from "react";
import Registration from "./pages/Registration";
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "./firebase";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sora flex flex-col items-center justify-center p-4">
      {!user ? (
        <div className="text-center space-y-4">
          <h1 className="text-2xl">Sign in with Google</h1>
          <button
            onClick={handleLogin}
            className="bg-green-500 px-6 py-2 rounded hover:bg-green-600"
          >
            Sign In with Google
          </button>
        </div>
      ) : (
        <>
          <div className="text-center mb-6 space-y-2">
            <p className="text-xl">Welcome, {user.displayName}</p>
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-16 h-16 rounded-full mx-auto"
            />
            <button
              className="bg-red-500 px-4 py-1 mt-2 rounded hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          {/* 🔒 Only show after login */}
          <Registration />
        </>
      )}
    </div>
  );
}

export default App;
