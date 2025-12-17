import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DocumentView from "./pages/DocumentView";
import ChatPage from "./pages/ChatPage";
import StudyPage from "./pages/StudyPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/common/PrivateRoute";

export default function Router() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={<PrivateRoute><Dashboard /></PrivateRoute>}
      />
      <Route
        path="/document/:id"
        element={<PrivateRoute><DocumentView /></PrivateRoute>}
      />
      <Route
        path="/chat/:id"
        element={<PrivateRoute><ChatPage /></PrivateRoute>}
      />
      <Route
        path="/study/:id"
        element={<PrivateRoute><StudyPage /></PrivateRoute>}
      />
    </Routes>
  );
}
