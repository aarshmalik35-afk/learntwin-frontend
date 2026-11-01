
import { useEffect, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

const CONCEPTS = [
  { id: "https_tls", label: "HTTPS and TLS" },
  { id: "phishing_detection", label: "Phishing Detection" },
  { id: "iam_least_privilege", label: "Identity and Least Privilege" },
  { id: "security_log_investigation", label: "Security Log Investigation" },
  { id: "dns_fundamentals", label: "DNS Fundamentals" },
  { id: "incident_response", label: "Incident Response" },
];

export default function AdaptivePractice() {
  const [conceptId, setConceptId] = useState("https_tls");
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState("");
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadQuestion(id = conceptId) {
    setLoading(true);
    setError("");
    setQuestion(null);
    setSelected("");
    setDiagnosis(null);

    try {
      const response = await fetch(
        `${API_BASE}/api/adaptive/question/${encodeURIComponent(id)}`
      );

      if (!response.ok) {
        throw new Error(`Could not load question (${response.status}).`);
      }

      const data = await response.json();
      setQuestion(data);
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuestion(conceptId);
  }, [conceptId]);

  async function submitAnswer() {
    if (!question || !selected || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/api/adaptive/answer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            concept_id: question.concept_id,
            question_id: question.question_id,
            selected_option: selected,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to evaluate your answer."
        );
      }

      setDiagnosis(data);
    } catch (err) {
      setError(err.message || "Unable to submit your answer.");
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

  const muted = {
    color: "var(--muted-color, #64748b)",
    lineHeight: 1.65,
  };

  return (
    <section style={{ maxWidth: 850, margin: "0 auto", padding: 20 }}>
      <div style={{ marginBottom: 22 }}>
        <p style={{ color: "#6366f1", fontWeight: 700, fontSize: 12 }}>
          LEARNTWIN INTELLIGENCE
        </p>

        <h2 style={{ marginBottom: 8 }}>
          Adaptive Practice
        </h2>

        <p style={muted}>
          Test your understanding with a targeted cybersecurity
          question. Review the evidence behind your result and
          discover what to practise next.
        </p>
      </div>

      <div style={panel}>
        <label
          htmlFor="adaptive-concept"
          style={{ display: "block", fontWeight: 600, marginBottom: 8 }}
        >
          Select a knowledge area
        </label>

        <select
          id="adaptive-concept"
          value={conceptId}
          onChange={(e) => setConceptId(e.target.value)}
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 9,
            border: "1px solid var(--border-color, #d1d5db)",
            background: "var(--input-bg, #fff)",
            color: "var(--text-color, #172033)",
          }}
        >
          {CONCEPTS.map((concept) => (
            <option key={concept.id} value={concept.id}>
              {concept.label}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div style={panel} role="status">
          Loading your assessment...
        </div>
      )}

      {error && (
        <div
          role="alert"
          style={{
            ...panel,
            borderColor: "#dc2626",
            color: "#b91c1c",
          }}
        >
          <strong>Something went wrong</strong>
          <p>{error}</p>
          <button onClick={() => loadQuestion()}>
            Retry
          </button>
        </div>
      )}

      {question && !loading && (
        <div style={panel}>
          <p style={{ ...muted, fontSize: 13 }}>
            {question.concept_name} · {question.difficulty}
          </p>

          <h3 style={{ lineHeight: 1.5 }}>
            {question.question}
          </h3>

          <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
            {Object.entries(question.options).map(([key, value]) => (
              <label
                key={key}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: 14,
                  border: `1px solid ${
                    selected === key ? "#6366f1" : "var(--border-color, #e5e7eb)"
                  }`,
                  borderRadius: 10,
                  cursor: diagnosis ? "default" : "pointer",
                  background:
                    selected === key
                      ? "var(--selected-bg, #eef2ff)"
                      : "transparent",
                }}
              >
                <input
                  type="radio"
                  name="adaptive-answer"
                  value={key}
                  checked={selected === key}
                  onChange={() => setSelected(key)}
                  disabled={Boolean(diagnosis) || loading}
                  style={{ marginTop: 4 }}
                />

                <span>
                  <strong>{key}.</strong> {value}
                </span>
              </label>
            ))}
          </div>

          {!diagnosis && (
            <button
              onClick={submitAnswer}
              disabled={!selected || loading}
              style={{
                marginTop: 20,
                padding: "12px 18px",
                border: 0,
                borderRadius: 9,
                background: "#4f46e5",
                color: "#fff",
                fontWeight: 600,
                cursor: !selected || loading ? "not-allowed" : "pointer",
                opacity: !selected || loading ? 0.6 : 1,
              }}
            >
              Evaluate my answer
            </button>
          )}
        </div>
      )}

      {diagnosis && (
        <div style={panel} aria-live="polite">
          <p
            style={{
              fontWeight: 700,
              color: diagnosis.is_correct ? "#15803d" : "#b91c1c",
            }}
          >
            {diagnosis.is_correct
              ? "Correct answer"
              : "A knowledge gap may need attention"}
          </p>

          <h3>Evidence & Diagnosis</h3>

          <p style={muted}>
            <strong>What you selected</strong>
            <br />
            {diagnosis.evidence}
          </p>

          <p style={muted}>
            <strong>Cybersecurity principle</strong>
            <br />
            {diagnosis.principle}
          </p>

          <p style={muted}>
            <strong>Rule applied</strong>
            <br />
            {diagnosis.rule_applied}
          </p>

          <div
            style={{
              padding: 14,
              borderRadius: 10,
              background: "var(--subtle-bg, #f8fafc)",
              marginTop: 16,
            }}
          >
            <strong>
              Diagnostic confidence: {diagnosis.confidence}
            </strong>
            <p style={muted}>{diagnosis.confidence_note}</p>
          </div>

          <h4>Recommended next step</h4>
          <p style={muted}>{diagnosis.recommendation}</p>

          <p style={muted}>
            <strong>What to demonstrate next</strong>
            <br />
            {diagnosis.next_test}
          </p>

          <button
            onClick={() => loadQuestion()}
            style={{
              padding: "12px 18px",
              border: 0,
              borderRadius: 9,
              background: "#4f46e5",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            Try another question
          </button>
        </div>
      )}
    </section>
  );
}
