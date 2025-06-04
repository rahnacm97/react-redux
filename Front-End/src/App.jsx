import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserLogin from "./pages/UserLogin/UserLogin";
import UserHome from "./pages/UserHome/UserHome";
import UserSignup from "./pages/UserSignup/UserSignup";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import UserProfile from "./pages/UserProfile/UserProfile";
import AdminDashboard from "./pages/AdminDashboard/Dashboard";

const ProtectedUserRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const localUser = JSON.parse(localStorage.getItem("user"));
  return user || localUser ? children : <Navigate to="/" replace />;
};

const ProtectedAdminRoute = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  return admin ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/home"
          element={
            <ProtectedUserRoute>
              <UserHome />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedUserRoute>
              <UserProfile />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;