import { useEffect, useState } from "react";
import { api } from "../api";
import "./TestCases.css";
import PromptViewer from "./PromptViewer";
import TestResults from "./TestResults";

export default function TestCases() {
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState("ALL"); // ALL | DIFF | null
  const [showResults, setShowResults] = useState(false);

  const [lastRun, setLastRun] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  const [runLogs, setRunLogs] = useState("");

  // ================= RESTORE LAST RUN =================
  useEffect(() => {
    const saved = localStorage.getItem("tc_last_executed");
    if (saved) {
      setLastRun(saved);
      setHasRun(true);
    }
  }, []);

  // ================= RUN TEST CASES =================
  const runTC = async () => {
    try {
      setHasRun(false);
      setRunLogs("");
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

  // ================= FETCH ALL =================
  const fetchAll = async () => {
    setLoading(true);
    setShowResults(false);
    try {
      setData(await api.fetchAllTC());
      setMode("ALL");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH DIFF =================
  const fetchDiff = async () => {
    setLoading(true);
    setShowResults(false);
    try {
      setData(await api.fetchDiffTC());
      setMode("DIFF");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div>
      {/* ================= HEADER ================= */}
      <div className="tc-header">
        <h2>
          Test Cases{" "}
          {lastRun && (
            <span className="last-run">(Last Executed: {lastRun})</span>
          )}
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

          <button
            disabled={!hasRun}
            onClick={() => {
              setShowResults(true);
              setMode(null);
            }}
          >
            Results
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {hasRun && !loading && <p>{runLogs}</p>}

      {/* ================= PROMPT ================= */}
      {!showResults && <PromptViewer />}

      {/* ================= RESULTS ================= */}
      {showResults && (
        <TestResults
          onClose={() => {
            setShowResults(false);
            setMode("ALL");
          }}
        />
      )}

      {/* ================= ALL TEST CASES ================= */}
      {!showResults && mode === "ALL" && (
        <>
          <p>
            <strong>Total Test Cases:</strong> {data.length}
          </p>

          <div className={`table-lock ${loading ? "locked" : ""}`}>
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
                {Object.entries(
                  data.reduce((acc, tc) => {
                    const key =
                      tc["Controller Name"] || "UNKNOWN CONTROLLER";
                    acc[key] = acc[key] || [];
                    acc[key].push(tc);
                    return acc;
                  }, {})
                ).map(([controller, tcs]) => (
                  <>
                    <tr className="controller-row">
                      <td colSpan="4">
                        <strong>{controller}</strong>
                      </td>
                    </tr>

                    {tcs.map((tc) => (
                      <>
                        <tr
                          key={tc["Test Case ID"]}
                          onClick={() =>
                            toggleExpand(tc["Test Case ID"])
                          }
                        >
                          <td>{tc["Test Case ID"]}</td>
                          <td>{tc.Title}</td>
                          <td>{tc.Priority}</td>
                          <td>{tc.Type}</td>
                        </tr>

                        {expanded === tc["Test Case ID"] && (
                          <tr>
                            <td colSpan="4">
                              <pre>{JSON.stringify(tc, null, 2)}</pre>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ================= DIFF (FULL RESTORED) ================= */}
      {!showResults && mode === "DIFF" && (
        <div className={`table-lock ${loading ? "locked" : ""}`}>
          <table className="tc-table">
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Test Case ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(
                data.reduce((acc, d) => {
                  const key =
                    d.old?.["Controller Name"] ||
                    d.new?.["Controller Name"] ||
                    "UNKNOWN CONTROLLER";
                  acc[key] = acc[key] || [];
                  acc[key].push(d);
                  return acc;
                }, {})
              ).map(([controller, diffs]) => (
                <>
                  <tr className="controller-row">
                    <td colSpan="3">
                      <strong>{controller}</strong>
                    </td>
                  </tr>

                  {diffs.map((d, i) => {
                    const oldLines = d.old
                      ? JSON.stringify(d.old, null, 2).split("\n")
                      : [];
                    const newLines = d.new
                      ? JSON.stringify(d.new, null, 2).split("\n")
                      : [];

                    return (
                      <>
                        <tr
                          key={`${controller}-${i}`}
                          onClick={() =>
                            toggleExpand(`${controller}-${i}`)
                          }
                        >
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

                        {expanded === `${controller}-${i}` && (
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
                                      <div className="no-change">
                                        No old test case
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* NEW */}
                                <div className="diff-col">
                                  <h4>NEW</h4>
                                  <div className="diff-box">
                                    {newLines.length ? (
                                      newLines.map((line, idx) => (
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
                                      ))
                                    ) : (
                                      <div className="no-change">
                                        Only service logic changed
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
