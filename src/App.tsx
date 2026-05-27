import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Events from './pages/Events';
import Classes from './pages/Classes';
import ClassSignup from './pages/ClassSignup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import BuildingUsage from './pages/BuildingUsage';
import ClassPrices from './pages/ClassPrices';
import ContactUs from './pages/ContactUs';
import Directions from './pages/Directions';
import Forms from './pages/Forms';
import GiftCertificates from './pages/GiftCertificates';
import History from './pages/History';
import Membership from './pages/Membership';
import MembersOnly from './pages/MembersOnly';
import Newsletter from './pages/Newsletter';
import OfficersAndBoard from './pages/OfficersAndBoard';
import { UserDataProvider } from './context/UserDataContext';
import './App.css';

function App() {
  return (
    <Router>
      <UserDataProvider>
        <Navigation />
        <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/signup" element={<ClassSignup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/building-usage" element={<BuildingUsage />} />
            <Route path="/class-prices" element={<ClassPrices />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/directions" element={<Directions />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/gift-certificates" element={<GiftCertificates />} />
            <Route path="/history" element={<History />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/members-only" element={<MembersOnly />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/officers-and-board" element={<OfficersAndBoard />} />
          </Routes>
        </main>
        </div>
        <footer className="footer">
          <p>&copy; 2024 Keystone Canine Training Club. All rights reserved. 🐾</p>
        </footer>
      </UserDataProvider>
    </Router>
  );
}

export default App;
