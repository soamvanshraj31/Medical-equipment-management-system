import './Navbar.css';

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-left">
      <span className="navbar-logo">🩺</span>
      <span className="navbar-title">MediBridge</span>
    </div>
    <div className="navbar-center">
      <span className="navbar-link active">Devices</span>
      {/* Future: <span className="navbar-link">Reports</span> */}
    </div>
    <div className="navbar-right">
      <span className="navbar-avatar" title="Profile">👤</span>
    </div>
  </nav>
);

export default Navbar; 