import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Employee from "./pages/Employee";
import Attendance from "./pages/Attendance";
import TestCases from "./pages/TestCases";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Employee />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/testcases" element={<TestCases />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
