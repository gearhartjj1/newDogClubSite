import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Events from './pages/Events';
import Classes from './pages/Classes';
import ClassSignup from './pages/ClassSignup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { UserDataProvider } from './context/UserDataContext';
import './App.css';

function App() {
  return (
    <Router>
      <UserDataProvider>
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/signup" element={<ClassSignup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; 2024 Keystone Canine Training Club. All rights reserved. 🐾</p>
        </footer>
      </UserDataProvider>
    </Router>
  );
}

export default App;
