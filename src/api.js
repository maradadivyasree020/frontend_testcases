const BASE_URL = "http://localhost:8080/api";

export const api = {
  // ================= EMPLOYEE =================
  getEmployees: async () => {
    const res = await fetch(`${BASE_URL}/employee`);
    if (!res.ok) throw new Error("Failed to fetch employees");
    return res.json();
  },

  addEmployee: async (body) => {
    const res = await fetch(`${BASE_URL}/employee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to add employee");
    return res.text();
  },

  // ================= ATTENDANCE =================
  markAttendance: async (body) => {
    const res = await fetch(`${BASE_URL}/attendance/mark`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to mark attendance");
    return res.json();
  },

  // ================= TEST CASES =================
  fetchAllTC: async () => {
    const res = await fetch(`${BASE_URL}/testcases/all`);
    if (!res.ok) throw new Error("Failed to fetch all test cases");
    return res.json();
  },

  // SHOW OLD VS NEW
  fetchDiffTC: async () => {
    const res = await fetch(`${BASE_URL}/testcases/diff`);
    if (!res.ok) throw new Error("Failed to fetch diff");
    return res.json();
  },

  // RUN TC (with logs)
  runTC: async () => {
    const res = await fetch(`${BASE_URL}/testcases/run`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to run test cases");
    return res.text(); 
  },
};
