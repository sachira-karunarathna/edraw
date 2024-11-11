import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import ExcalidrawApp from "../App";
import { isAuthenticated } from "../utils/auth";
import RecentProjects from "../components/RecentProjects";
import AuthCallback from "../components/AuthCallback";

const AppNav: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated() ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/app"
          element={
            isAuthenticated() ? (
              <ExcalidrawApp />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/recent-projects"
          element={
            isAuthenticated() ? (
              <RecentProjects />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/app/project/:projectId"
          element={
            isAuthenticated() ? (
              <ExcalidrawApp />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/app/new"
          element={
            isAuthenticated() ? (
              <ExcalidrawApp />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/recent-projects" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppNav;
