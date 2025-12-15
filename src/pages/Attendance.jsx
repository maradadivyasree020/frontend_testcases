import { useState } from "react";
import { api } from "../api";

export default function Attendance() {
  const [req, setReq] = useState({
    employeeId: "",
    absent: false,
    date: ""
  });
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.markAttendance(req);
    setResult(res);
  };

  return (
    <div>
      <h2>Mark Attendance</h2>

      <form className="form" onSubmit={submit}>
        <input
          placeholder="Employee ID"
          onChange={(e) => setReq({ ...req, employeeId: e.target.value })}
        />
        <select onChange={(e) => setReq({ ...req, absent: e.target.value === "true" })}>
          <option value="false">Present</option>
          <option value="true">Absent</option>
        </select>
        <input
          type="date"
          onChange={(e) => setReq({ ...req, date: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>

      {result && (
        <pre className="result-box">
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
