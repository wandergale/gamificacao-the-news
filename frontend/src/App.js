// Route
import { BrowserRouter, Routes, Route } from "react-router-dom";

// CSS
import "./App.css";

// pages
import Home from "./pages/Home/Home";
import UserDashboard from "./pages/Dashboard/User/UserDashboard";
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import {
  ProtectedRoute,
  VerifyLogin,
  ProtectAdminRoute,
} from "./pages/Dashboard/User/VerifyLogin";
// import Modal from "./components/Modal";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verify-login" element={<VerifyLogin />} />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectAdminRoute>
                <AdminDashboard />
              </ProtectAdminRoute>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
