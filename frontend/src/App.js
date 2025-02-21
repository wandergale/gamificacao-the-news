// Route
import { BrowserRouter, Routes, Route } from "react-router-dom";

// CSS
import "./App.css";

// pages
import Home from "./pages/Home/Home";
import UserDashboard from "./pages/Dashboard/User/UserDashboard";
import { ProtectedRoute } from "./pages/Dashboard/User/VerifyLogin";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
