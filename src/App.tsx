import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Events from './pages/Events';
import Classes from './pages/Classes';
import ClassSignup from './pages/ClassSignup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleLogin = (user: any) => {
    console.log("handle login called with user: ", user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <Navigation currentUser={currentUser?.Email} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/signup" element={<ClassSignup />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/profile"
            element={
              currentUser ? (
                <Profile user={currentUser} onLogout={handleLogout} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
        </Routes>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Keystone Canine Training Club. All rights reserved. 🐾</p>
      </footer>
    </Router>
  );
}

export default App;
