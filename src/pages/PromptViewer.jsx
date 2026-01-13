import { useState } from "react";
import { api } from "../api";

export default function PromptViewer() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  const toggle = async () => {
    if (!open) {
      const p = await api.fetchPrompt();
      setPrompt(p);
    }
    setOpen(!open);
  };

  return (
    <div style={{ marginTop: 16 }}>
      <button onClick={toggle}>
        {open ? "Hide Prompt" : "Show Prompt"}
      </button>

      {open && <pre className="prompt-box">{prompt}</pre>}
    </div>
  );
}
