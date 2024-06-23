import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Profile from "./pages/Profile.jsx";
import Booking from "./pages/Booking.jsx";
import Favorites from "./pages/Favorites.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}

export default App;