const BASE_URL = "http://localhost:8080/api";

export const api = {
  getEmployees: async () => {
    const res = await fetch(`${BASE_URL}/employe`);
    return res.json();
  },

  addEmployee: async (body) => {
    const res = await fetch(`${BASE_URL}/employee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.text();
  },

  updateEmployee: async (id, body) => {
    const res = await fetch(`${BASE_URL}/employee/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  markAttendance: async (body) => {
    const res = await fetch(`${BASE_URL}/attendance/mark`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  getTestCases: async () => {
    const res = await fetch(`${BASE_URL}/testcases`);
    return res.json();
  }
};
