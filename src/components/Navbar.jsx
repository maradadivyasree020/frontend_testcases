import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="nav">
      <h2 className="nav-title">College System</h2>
      <div className="nav-links">
        <Link to="/">Employee</Link>
        <Link to="/attendance">Attendance</Link>
        <Link to="/testcases">Test Cases</Link>
      </div>
    </nav>
  );
}
