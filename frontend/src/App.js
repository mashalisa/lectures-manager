import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login.tsx";
import Lectures from "./components/Lectures.tsx";
import './App.css';

function App() {
  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public route for login */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected route for lectures */}
          <Route
            path="/lectures"
            element={
              <ProtectedRoute>
                <Lectures />
              </ProtectedRoute>
            }
          />
          
          {/* Protected route for home page */}
          <Route
            path="/"
            element={
              <ProtectedRoute> 
                <div className="content">
                  <h1>Lectures Manager</h1>
                  <p>Welcome to the Lectures Manager application!</p>
                  <button 
                    onClick={() => window.location.href = '/lectures'}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                  >
                    View Lectures
                  </button>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
