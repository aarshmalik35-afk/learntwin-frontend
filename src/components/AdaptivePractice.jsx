import { useCallback, useEffect, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

const CONCEPTS = [
  { id: "https_tls", label: "HTTPS and TLS" },
  { id: "phishing_detection", label: "Phishing Detection" },
  { id: "iam_least_privilege", label: "Identity and Least Privilege" },
  { id: "security_log_investigation", label: "Security Log Investigation" },
  { id: "dns_fundamentals", label: "DNS Fundamentals" },
  { id: "incident_response", label: "Incident Response" },
];

function getQuestionText(data) {
  return data?.question ?? data?.prompt ?? data?.question_text ?? data?.text ?? "";
}

function getOptions(data) {
  const raw = data?.options ?? data?.choices ?? data?.answers ?? {};
  if (Array.isArray(raw)) {
    return raw.map((option, index) => {
      if (typeof option === "string") {
        return { key: String.fromCharCode(65 + index), text: option };
      }
      const key = String(option.id ?? option.key ?? option.value ?? String.fromCharCode(65 + index));
      return { key, text: String(option.text ?? option.label ?? option.option ?? option.value ?? "") };
    }).filter((option) => option.text);
  }
  if (raw && typeof raw === "object") {
    return Object.entries(raw).map(([key, value]) => ({
      key: String(key),
      text: typeof value === "string" ? value : String(value?.text ?? value?.label ?? ""),
    })).filter((option) => option.text);
  }
  return [];
}

function readField(data, ...keys) {
  for (const key of keys) {
    if (data?.[key] !== undefined && data?.[key] !== null && data?.[key] !== "") {
      return data[key];
    }
  }
  return "Not provided by the API.";
}

export default function AdaptivePractice() {
  const [conceptId, setConceptId] = useState("https_tls");
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState("");
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadQuestion = useCallback(async (id = conceptId) => {
    setLoading(true);
    setError("");
    setQuestion(null);
    setSelected("");
    setDiagnosis(null);

    try {
      const response = await fetch(
        `${API_BASE}/api/adaptive/question/${encodeURIComponent(id)}`,
        { headers: { Accept: "application/json" } }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.detail || data.message || `Could not load question (${response.status}).`);
      }

      // Accept either a direct question object or { question: {...} } API response.
      const payload = data.question && typeof data.question === "object" ? data.question : data;
      const options = getOptions(payload);
      if (!getQuestionText(payload) || options.length === 0) {
        throw new Error("The API responded, but its question/options format was not recognised. Check the response from /api/adaptive/question/.");
      }
      setQuestion({
        ...payload,
        question: getQuestionText(payload),
        options,
        concept_id: payload.concept_id ?? id,
        question_id: payload.question_id ?? payload.id ?? id,
        concept_name: payload.concept_name ?? payload.concept ?? CONCEPTS.find((item) => item.id === id)?.label ?? id,
        difficulty: payload.difficulty ?? "Practice",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }, [conceptId]);

  useEffect(() => {
    loadQuestion(conceptId);
  }, [conceptId, loadQuestion]);

  async function submitAnswer() {
    if (!question || !selected || loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/adaptive/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          concept_id: question.concept_id,
          question_id: question.question_id,
          selected_option: selected,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.detail || data.message || `Unable to evaluate your answer (${response.status}).`);
      }
      setDiagnosis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit your answer.");
    } finally {
      setLoading(false);
    }
  }

  const panel = {
    background: "var(--panel-bg, #ffffff)",
    color: "var(--text-color, #172033)",
    border: "1px solid var(--border-color, #e5e7eb)",
    borderRadius: 16,
    padding: 22,
    marginTop: 18,
  };
  const muted = { color: "var(--muted-color, #64748b)", lineHeight: 1.65 };
  const buttonStyle = {
    marginTop: 18,
    padding: "12px 18px",
    border: 0,
    borderRadius: 9,
    background: "#4f46e5",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  };

  return (
    <section style={{ maxWidth: 850, margin: "0 auto", padding: 20 }}>
      <div style={{ marginBottom: 22 }}>
        <p style={{ color: "#6366f1", fontWeight: 700, fontSize: 12 }}>LEARNTWIN INTELLIGENCE</p>
        <h2 style={{ marginBottom: 8 }}>Adaptive Practice</h2>
        <p style={muted}>Test your understanding with a targeted cybersecurity question. Review the evidence behind your result and discover what to practise next.</p>
      </div>

      <div style={panel}>
        <label htmlFor="adaptive-concept" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Select a knowledge area</label>
        <select
          id="adaptive-concept"
          value={conceptId}
          onChange={(event) => setConceptId(event.target.value)}
          disabled={loading}
          style={{ width: "100%", padding: 12, borderRadius: 9, border: "1px solid var(--border-color, #d1d5db)", background: "var(--input-bg, #fff)", color: "var(--text-color, #172033)" }}
        >
          {CONCEPTS.map((concept) => <option key={concept.id} value={concept.id}>{concept.label}</option>)}
        </select>
      </div>

      {loading && <div style={panel} role="status">Loading your assessment…</div>}
      {error && (
        <div role="alert" style={{ ...panel, borderColor: "#dc2626", color: "#b91c1c" }}>
          <strong>Something went wrong</strong>
          <p>{error}</p>
          <button type="button" style={buttonStyle} onClick={() => loadQuestion(conceptId)} disabled={loading}>Retry</button>
        </div>
      )}

      {question && !loading && (
        <div style={panel}>
          <p style={{ ...muted, fontSize: 13 }}>{question.concept_name} · {question.difficulty}</p>
          <h3 style={{ lineHeight: 1.5 }}>{question.question}</h3>
          <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
            {question.options.map(({ key, text }) => (
              <label key={key} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 14, border: `1px solid ${selected === key ? "#6366f1" : "var(--border-color, #e5e7eb)"}`, borderRadius: 10, cursor: diagnosis || loading ? "default" : "pointer", background: selected === key ? "var(--selected-bg, #eef2ff)" : "transparent" }}>
                <input type="radio" name="adaptive-answer" value={key} checked={selected === key} onChange={() => setSelected(key)} disabled={Boolean(diagnosis) || loading} style={{ marginTop: 4 }} />
                <span><strong>{key}.</strong> {text}</span>
              </label>
            ))}
          </div>
          {!diagnosis && <button type="button" onClick={submitAnswer} disabled={!selected || loading} style={{ ...buttonStyle, opacity: !selected || loading ? 0.6 : 1, cursor: !selected || loading ? "not-allowed" : "pointer" }}>Evaluate my answer</button>}
        </div>
      )}

      {diagnosis && (
        <div style={panel} aria-live="polite">
          <p style={{ fontWeight: 700, color: diagnosis.is_correct ? "#15803d" : "#b91c1c" }}>
            {diagnosis.is_correct === true ? "Correct answer" : diagnosis.is_correct === false ? "A knowledge gap may need attention" : "Answer evaluated"}
          </p>
          <h3>Evidence &amp; Diagnosis</h3>
          <p style={muted}><strong>What you selected</strong><br />{readField(diagnosis, "evidence", "selected_evidence", "explanation")}</p>
          <p style={muted}><strong>Cybersecurity principle</strong><br />{readField(diagnosis, "principle", "security_principle")}</p>
          <p style={muted}><strong>Rule applied</strong><br />{readField(diagnosis, "rule_applied", "rule")}</p>
          <div style={{ padding: 14, borderRadius: 10, background: "var(--subtle-bg, #f8fafc)", marginTop: 16 }}>
            <strong>Diagnostic confidence: {readField(diagnosis, "confidence")}</strong>
            <p style={muted}>{readField(diagnosis, "confidence_note", "confidence_explanation")}</p>
          </div>
          <h4>Recommended next step</h4>
          <p style={muted}>{readField(diagnosis, "recommendation", "recommended_action", "remedy")}</p>
          <p style={muted}><strong>What to demonstrate next</strong><br />{readField(diagnosis, "next_test", "next_step")}</p>
          <button type="button" onClick={() => loadQuestion(conceptId)} disabled={loading} style={buttonStyle}>Reload this practice question</button>
          <p style={{ ...muted, fontSize: 12 }}>This endpoint reloads the selected concept's question. It does not guarantee a new question unless the backend supplies a question bank.</p>
        </div>
      )}
    </section>
  );
}
