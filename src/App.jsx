// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Provider, useDispatch } from "react-redux";
import appStore from "./utils/appStore";

import Navbar from "./components/Navbar";
import HomePage from "./Pages/HomePage";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage";
import ProfilePage from "./Pages/ProfilePage";
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import ConnectionsPage from "./Pages/Connections";
import RequestsPage from "./Pages/Request";

import { BASE_URL } from "./utils/config";
import { addUser } from "./utils/userSlice";

// ✅ Import Toaster
import { Toaster } from "./components/Toaster";

// ✅ Separate component that has access to Redux store
function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await fetch(`${BASE_URL}/profile/view`, {
        credentials: "include",
      });
      const data = await response.json();
      dispatch(addUser(data)); // ✅ use dispatch, not appStore.dispatch
    } catch (err) {
      if (
        location.pathname !== "/login" &&
        location.pathname !== "/signup"
      ) {
        navigate("/login");
      }
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {/* ✅ Put Toaster here so it's always available */}
      <Toaster />

      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <Provider store={appStore}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}
