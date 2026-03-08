import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Events from './pages/Events';
import Classes from './pages/Classes';
import ClassSignup from './pages/ClassSignup';
import './App.css';

function App() {
  return (
    <Router>
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/signup" element={<ClassSignup />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Pawsome Dogs Club. All rights reserved. 🐾</p>
      </footer>
    </Router>
  );
}

export default App;
