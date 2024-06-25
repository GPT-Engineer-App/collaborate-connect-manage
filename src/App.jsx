import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Profile from "./pages/Profile.jsx";
import Booking from "./pages/Booking.jsx";
import Favorites from "./pages/Favorites.jsx";
import Messages from "./pages/Messages.jsx";
import Settings from "./pages/Settings.jsx";
import NavigationBar from "./components/NavigationBar.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UploadPng from "./pages/UploadPng.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload-png" element={<ProtectedRoute><UploadPng /></ProtectedRoute>} />
      </Routes>
      <NavigationBar />
    </Router>
  );
}

export default App;