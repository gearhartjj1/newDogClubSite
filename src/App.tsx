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
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <Navigation currentUser={currentUser} />
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
                <Profile username={currentUser} onLogout={handleLogout} />
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
