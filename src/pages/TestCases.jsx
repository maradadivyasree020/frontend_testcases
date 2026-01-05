import { useEffect, useState } from "react";
import { api } from "../api";
import "./TestCases.css";

export default function TestCases() {
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("ALL");

  const [lastRun, setLastRun] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  const [runLogs, setRunLogs] = useState("");

  // Restore last run
  useEffect(() => {
    const saved = localStorage.getItem("tc_last_executed");
    if (saved) {
      setLastRun(saved);
      setHasRun(true);
    }
  }, []);

  const runTC = async () => {
    try {
      setLoading(true);
      const logs = await api.runTC();
      const time = new Date().toLocaleString();
      localStorage.setItem("tc_last_executed", time);
      setLastRun(time);
      setHasRun(true);
      setRunLogs(logs);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      setData(await api.fetchAllTC());
      setMode("ALL");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiff = async () => {
    setLoading(true);
    try {
      setData(await api.fetchDiffTC());
      setMode("DIFF");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (i) => {
    setExpanded(expanded === i ? null : i);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="tc-header">
        <h2>
          Test Cases{" "}
          {lastRun && <span className="last-run">(Last Executed: {lastRun})</span>}
        </h2>

        <div className="tc-actions">
          <button onClick={fetchAll}>Show All TC</button>
          <button className="green" onClick={fetchDiff}>
            Show Old vs New
          </button>
          <button onClick={runTC} disabled={hasRun}>
            {hasRun ? "TC Executed" : "Run TC"}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("tc_last_executed");
              setHasRun(false);
              setLastRun(null);
            }}
          >
            Reset TC
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {runLogs && <pre className="logs-box">{runLogs}</pre>}

      {/* ================= ALL ================= */}
      {mode === "ALL" &&(
        <table className="tc-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tc, i) => (
              <>
                <tr key={i} onClick={() => toggleExpand(i)}>
                  <td>{tc["Test Case ID"]}</td>
                  <td>{tc.Title}</td>
                  <td>{tc.Priority}</td>
                  <td>{tc.Type}</td>
                </tr>

                {expanded === i && (
                  <tr>
                    <td colSpan="4">
                      <pre>{JSON.stringify(tc, null, 2)}</pre>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= DIFF ================= */}
      {mode === "DIFF" &&(
        <table className="tc-table">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Test Case ID</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d, i) => {
              const oldLines = d.old
                ? JSON.stringify(d.old, null, 2).split("\n")
                : [];
              const newLines = d.new
                ? JSON.stringify(d.new, null, 2).split("\n")
                : [];

              return (
                <>
                  <tr key={i} onClick={() => toggleExpand(i)}>
                    <td>{d.endpoint}</td>
                    <td>{d.testCaseId}</td>
                    <td>
                      {d.old && d.new
                        ? "Test case updated"
                        : d.old && !d.new
                        ? "Only logic changed – test again"
                        : "New test case"}
                    </td>
                  </tr>

                  {expanded === i && (
                    <tr>
                      <td colSpan="3">
                        <div className="diff-grid">

                          {/* OLD */}
                          <div className="diff-col">
                            <h4>OLD</h4>
                            <div className="diff-box">
                              {oldLines.length ? (
                                oldLines.map((line, idx) => (
                                  <div
                                    key={idx}
                                    className={
                                      newLines[idx] !== line
                                        ? "line-changed"
                                        : ""
                                    }
                                  >
                                    {line}
                                  </div>
                                ))
                              ) : (
                                <div className="no-change">No old test case</div>
                              )}
                            </div>
                          </div>

                          {/* NEW */}
                          <div className="diff-col">
                            <h4>NEW</h4>
                            {newLines.length ? (
                              <div className="diff-box">
                                {newLines.map((line, idx) => (
                                  <div
                                    key={idx}
                                    className={
                                      oldLines[idx] !== line
                                        ? "line-changed"
                                        : ""
                                    }
                                  >
                                    {line}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="no-change diff-box">
                                 Only service logic changed
                              </div>
                            )}
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
