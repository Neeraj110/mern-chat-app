import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { lazy } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

function App() {
  const { user } = useSelector((state) => state.user);

  const GoogleWrapper = () => {
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <LoginPage />
      </GoogleOAuthProvider>
    );
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={user ? <ChatPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <GoogleWrapper />}
          />

          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <RegisterPage />}
          />
          <Route
            path="/reset-password"
            element={user ? <Navigate to="/" replace /> : <ResetPasswordPage />}
          />

          <Route
            path="*"
            element={<Navigate to={user ? "/" : "/login"} replace />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
