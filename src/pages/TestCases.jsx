import { useState } from "react";
import { api } from "../api";
import "./TestCases.css";

export default function TestCases() {
  const [tests, setTests] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState("");

  const fetchTests = async () => {
    setError("");
    try {
      const res = await api.getTestCases();
      setTests(res);
    } catch (e) {
      setError(e.message);
      setTests([]);
    }
  };

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div>
      <h2>Generated Test Cases</h2>

      <button onClick={fetchTests}>Fetch Test Cases</button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {tests.length === 0 ? (
        <p>No test cases found.</p>
      ) : (
        <table className="tc-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>PreConditions</th>
              <th>Priority</th>
              <th>Type</th>
              <th>Expected Result</th>
            </tr>
          </thead>

          <tbody>
            {tests.map((tc, index) => (
              <>
                <tr
                  key={index}
                  className="row"
                  onClick={() => toggleExpand(index)}
                >
                  <td>{tc["Test Case ID"]}</td>
                  <td>{tc["Title"]}</td>
                  <td>{tc["Description"]}</td>
                  <td>{tc["Pre-Conditions"]}</td>
                  <td>{tc["Priority"]}</td>
                  <td>{tc["Type"]}</td>
                  <td>{tc["Expected Result"]}</td>
                </tr>

                {expanded === index && (
                  <tr className="expand-row">
                    <td colSpan="6">
                      <div className="details-box">
                        <h4>Description</h4>
                        <p>{tc.Description}</p>

                        <h4>Pre-Conditions</h4>
                        <p>{tc["Pre-Conditions"]}</p>

                        <h4>Steps</h4>
                        <pre>{tc.Steps}</pre>

                        <h4>Input</h4>
                        <pre>{JSON.stringify(tc.Input, null, 2)}</pre>

                        <h4>Expected</h4>
                        <pre>{JSON.stringify(tc.Expected, null, 2)}</pre>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
