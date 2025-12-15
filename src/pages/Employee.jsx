import { useEffect, useState } from "react";
import { api } from "../api";

export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: "", role: "", absent: false });

  const load = async () => {
    setEmployees(await api.getEmployees());
  };

  const submit = async (e) => {
    e.preventDefault();
    await api.addEmployee(form);
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Employees</h2>

      <form onSubmit={submit} className="form">
        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Role"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />
        <button type="submit">Add Employee</button>
      </form>

      <h3>Employee List</h3>
      <table className="emp-table">
        <thead>
          <tr>
            <td>Emp ID</td>
            <td>Emp Name</td>
            <td>Emp Role</td>
          </tr>
        </thead>
        {employees.map((emp)=>(
          <tbody>
            <tr className="row">
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.role}</td>
            </tr>
          </tbody>
        ))}
       </table>
      {/* <ul>
        {employees.map((emp) => (
          <li key={emp.id}>{emp.id}-{emp.name} – {emp.role}</li>
        ))}
      </ul> */}
    </div>
  );
}
