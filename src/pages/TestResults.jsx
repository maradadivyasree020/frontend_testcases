import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import "./TestCases.css";

export default function TestResults({ onClose }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [controllerFilter, setControllerFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");
  
  const [expanded, setExpanded] = useState(null);
  const [onlyUserController, setOnlyUserController] = useState(false);
  const [onlyFailedEndpoints, setOnlyFailedEndpoints] = useState(false);

  // ================= FETCH RESULTS =================
  useEffect(() => {
    api.fetchTestResults()
      .then(setResults)
      .finally(() => setLoading(false));
  }, []);

  // ================= HELPERS =================
  const getController = (id) => id.split("_")[0];
  const getMethod = (id) => id.split("_")[1];
  const getEndpoint = (id) =>
    id.split("__")[1]?.split("-")[0] || "UNKNOWN";

  // ================= FILTER OPTIONS =================
  const controllers = useMemo(() => {
    return ["ALL", ...new Set(results.map(r => getController(r.testCaseId)))];
  }, [results]);

  const methods = useMemo(() => {
    return ["ALL", ...new Set(results.map(r => getMethod(r.testCaseId)))];
  }, [results]);

  // ================= FILTERED RESULTS =================
  const filteredResults = useMemo(() => {
    return results.filter(r => {
      const controller = getController(r.testCaseId);
      const method = getMethod(r.testCaseId);
      const endpoint = getEndpoint(r.testCaseId);

      if (controllerFilter !== "ALL" && controller !== controllerFilter)
        return false;

      if (methodFilter !== "ALL" && method !== methodFilter)
        return false;

      if (onlyUserController && controller !== "USERACCOUNTCONTROLLER")
        return false;

      if (onlyFailedEndpoints) {
        const endpointHasFail = results.some(
          x =>
            getEndpoint(x.testCaseId) === endpoint &&
            x.result === "FAIL"
        );
        if (!endpointHasFail) return false;
      }

      return true;
    });
  }, [
    results,
    controllerFilter,
    methodFilter,
    onlyUserController,
    onlyFailedEndpoints
  ]);

  // ================= SUMMARY =================
  const summary = useMemo(() => {
    const pass = filteredResults.filter(r => r.result === "PASS").length;
    const fail = filteredResults.filter(r => r.result === "FAIL").length;
    return {
      total: filteredResults.length,
      pass,
      fail
    };
  }, [filteredResults]);

  if (loading) return <p>Loading test results...</p>;

  return (
    <div>
      {/* HEADER */}
      {/* <h3>
        Test Results
        <button onClick={onClose} style={{ float: "right" }}>✖</button>
      </h3> */}

      {/* SUMMARY */}
      <p>
        <strong>Total:</strong> {summary.total}
        {/* <strong style={{ color: "green" }}>PASS:</strong> {summary.pass} |{" "} */}
        {/* <strong style={{ color: "red" }}>FAIL:</strong> {summary.fail} */}
      </p>

      {/* FILTERS */}
      <div style={{ marginBottom: "12px" }}>
        <select
          value={controllerFilter}
          onChange={e => setControllerFilter(e.target.value)}
        >
          {controllers.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={methodFilter}
          onChange={e => setMethodFilter(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          {methods.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* <label style={{ marginLeft: "15px" }}> */}
          {/* <input
            type="checkbox"
            checked={onlyUserController}
            onChange={e => setOnlyUserController(e.target.checked)}
          />{" "}
          Only UserController
        </label> */}

        {/* <label style={{ marginLeft: "15px" }}>
          <input
            type="checkbox"
            checked={onlyFailedEndpoints}
            onChange={e => setOnlyFailedEndpoints(e.target.checked)}
          />{" "}
          Remaining (Failed) Endpoints
        </label> */}
      </div>

      {/* TABLE */}
      <table className="tc-table">
        <thead>
          <tr>
            <th>Test Case ID</th>
            <th>Title</th>
            <th>Expected</th>
            <th>Actual</th>
            <th>Status</th>
          </tr>
        </thead>
        {/* <tbody>
          {filteredResults.map((r, i) => (
            <tr key={i}>
              <td>{r.testCaseId}</td>
              <td>{r.title}</td>
              <td>{r.expectedStatus}</td>
              <td>{r.actualStatus}</td>
              <td
                style={{
                  color: r.status === "PASS" ? "green" : "red",
                  fontWeight: "bold"
                }}
              >
                {r.status}
              </td>
            </tr>
          ))}
        </tbody> */}
        <tbody>
  {filteredResults.map((r, i) => (
    <>
      <tr
        key={i}
        className="row"
        onClick={() => setExpanded(expanded === i ? null : i)}
      >
        <td>{r.testCaseId}</td>
        <td>{r.title}</td>
        <td>{r.expectedStatus}</td>
        <td>{r.actualStatus}</td>
        <td
          style={{
            color: r.status === "PASS" ? "green" : "red",
            fontWeight: "bold"
          }}
        >
          {r.status}
        </td>
      </tr>

      {expanded === i && (
        <tr className="expand-row">
          <td colSpan="5">
            <div className="details-box">
              <strong> Message</strong>
              <pre>{r.message || "No details available"}</pre>
            </div>
          </td>
        </tr>
      )}
    </>
  ))}
</tbody>

        
      </table>
    </div>
  );
}
