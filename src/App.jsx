import { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowLeft, ArrowRight, Award, BookOpen, BrainCircuit, Check,
  CheckCircle2, ChevronRight, CircleHelp, Clock3, Compass, Download,
  FileSearch, GraduationCap, Lightbulb, LockKeyhole, RotateCcw, ShieldCheck,
  Sparkles, Target, TrendingUp, TriangleAlert, XCircle, Zap
} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getHealth, getHistory, getQuestions, submitAssessment } from './api'

const shortDate = (value) => {
  try { return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }
  catch { return '' }
}

function Brand() {
  return <div className="brand">
    <div className="brand-mark"><BrainCircuit size={22} strokeWidth={2.1} /></div>
    <div><div className="brand-name">LearnTwin<span> AI</span></div><div className="brand-caption">PERSONALIZED LEARNING</div></div>
  </div>
}

function Header({ view, onHome }) {
  return <header className="topbar">
    <Brand />
    <nav className="topnav">
      <button className={`nav-link ${view === 'dashboard' ? 'active' : ''}`} onClick={onHome}>Overview</button>
      <span className="nav-pill"><span className="live-dot" /> Prototype</span>
      <div className="avatar">LT</div>
    </nav>
  </header>
}

function Metric({ icon: Icon, label, value, note, tone = 'blue' }) {
  return <div className="metric-card">
    <div className={`metric-icon ${tone}`}><Icon size={19} /></div>
    <div className="metric-label">{label}</div>
    <div className="metric-value">{value}</div>
    <div className="metric-note">{note}</div>
  </div>
}

function ProgressBar({ value, color = 'blue' }) {
  return <div className="progress-track"><div className={`progress-fill ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
}

function EmptyState({ onStart }) {
  return <div className="empty-state">
    <div className="empty-art"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="brain-orb"><BrainCircuit size={48} /></div><span className="orbit-dot dot-a" /><span className="orbit-dot dot-b" /><span className="orbit-dot dot-c" /></div>
    <div className="eyebrow"><span className="eyebrow-line" /> YOUR LEARNING, UNDERSTOOD</div>
    <h1>Learn what you need.<br /><span>Not just what's next.</span></h1>
    <p className="hero-copy">A quick cybersecurity diagnostic that turns your answers into a learning profile, clear explanations, and a practical plan to improve.</p>
    <div className="hero-actions">
      <button className="btn-primary" onClick={onStart}>Start 6-question diagnostic <ArrowRight size={17} /></button>
      <div className="duration"><Clock3 size={15} /> About 3 minutes</div>
    </div>
    <div className="feature-strip">
      <div><span className="feature-icon violet"><BrainCircuit size={17} /></span><span><b>Learning twin</b><small>Concept-level profile</small></span></div>
      <div><span className="feature-icon teal"><Target size={17} /></span><span><b>Gap detection</b><small>Evidence-based insights</small></span></div>
      <div><span className="feature-icon amber"><Compass size={17} /></span><span><b>Next steps</b><small>A plan built for you</small></span></div>
    </div>
  </div>
}

function Dashboard({ onStart, history, health, onShowHistory }) {
  return <>
    <div className="welcome-row">
      <div><div className="eyebrow">LEARNING WORKSPACE <span className="eyebrow-line" /></div><h1>Your knowledge, <span>in focus.</span></h1><p className="subhead">Understand your cybersecurity strengths, uncover gaps, and know exactly what to practise next.</p></div>
      <button className="btn-primary" onClick={onStart}><Zap size={16} /> Take diagnostic <ArrowRight size={16} /></button>
    </div>
    <div className="hero-banner">
      <div className="banner-copy"><div className="banner-label"><Sparkles size={14} /> YOUR PERSONAL LEARNING TWIN</div><h2>Build understanding.<br />Make better security decisions.</h2><p>Six carefully selected questions map your current understanding across core cybersecurity concepts.</p><button className="btn-white" onClick={onStart}>Start assessment <ArrowRight size={16} /></button></div>
      <div className="banner-visual"><div className="banner-ring ring-a" /><div className="banner-ring ring-b" /><div className="banner-ring ring-c" /><div className="banner-core"><BrainCircuit size={42} /></div><div className="float-chip chip-top"><ShieldCheck size={15} /> Secure thinking</div><div className="float-chip chip-bottom"><Activity size={15} /> Learning signals</div></div>
    </div>
    <div className="section-heading"><div><h2>How LearnTwin works</h2><p>From a quick check-in to a focused learning plan.</p></div><span className="section-tag">3 steps</span></div>
    <div className="steps-grid">
      <div className="step-card"><div className="step-num">01</div><div className="step-icon lavender"><FileSearch size={20} /></div><h3>Check your understanding</h3><p>Answer short, realistic questions spanning phishing, networking, identity, and incident response.</p></div>
      <div className="step-card"><div className="step-num">02</div><div className="step-icon mint"><BrainCircuit size={20} /></div><h3>See your learning twin</h3><p>Review concept-level signals and the evidence behind each identified learning gap.</p></div>
      <div className="step-card"><div className="step-num">03</div><div className="step-icon peach"><Compass size={20} /></div><h3>Follow your next steps</h3><p>Get targeted remedies, reasoning tips, and practical activities for your priority areas.</p></div>
    </div>
    <div className="section-heading history-heading"><div><h2>Recent learning sessions</h2><p>Your latest diagnostic snapshots on this device.</p></div><button className="text-button" onClick={onShowHistory}>View details <ChevronRight size={16} /></button></div>
    <div className="history-card">
      {history.length ? history.slice(0, 4).map((item) => <div className="history-row" key={item.id}><div className="history-symbol"><GraduationCap size={18} /></div><div className="history-main"><b>Cybersecurity diagnostic</b><span>{shortDate(item.created_at)} · {item.student_name}</span></div><div className="history-score">{item.score}%</div><div className="history-track"><ProgressBar value={item.score} /></div><span className="history-chevron"><ChevronRight size={17} /></span></div>) : <div className="history-empty"><div className="history-symbol"><BookOpen size={19} /></div><div><b>Your learning history starts here</b><span>Complete the diagnostic to see your first snapshot.</span></div><span className="history-empty-tag">No sessions yet</span></div>}
    </div>
    <div className="bottom-note"><LockKeyhole size={15} /><span><b>Designed for responsible learning.</b> This short diagnostic is a starting point, not a label or a definitive measure of ability.</span></div>
    <div className="health-line"><span className={`status-dot ${health ? 'ok' : 'warn'}`} /> {health ? 'Assessment engine connected' : 'Checking assessment engine…'} <span className="muted">· Rules-based assessment with optional AI coaching</span></div>
  </>
}

function Quiz({ questions, onSubmit, onCancel, busy, error }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [name, setName] = useState('')
  const current = questions[index]
  const selected = current ? answers[current.id] : undefined
  const answeredCount = Object.keys(answers).length
  const choose = (optionId) => setAnswers(prev => ({ ...prev, [current.id]: optionId }))
  const next = () => setIndex(i => Math.min(questions.length - 1, i + 1))
  const back = () => setIndex(i => Math.max(0, i - 1))
  const finish = () => onSubmit({ student_name: name.trim() || 'Learner', answers: questions.map(q => ({ question_id: q.id, selected_option_id: answers[q.id] })) })
  if (!current) return <div className="loading-panel">Loading your diagnostic…</div>
  return <div className="quiz-shell">
    <div className="quiz-topline"><button className="back-link" onClick={onCancel}><ArrowLeft size={16} /> Back to overview</button><span className="quiz-tag"><ShieldCheck size={14} /> Cybersecurity diagnostic</span></div>
    <div className="quiz-layout">
      <section className="quiz-main">
        <div className="quiz-progress-label"><span>QUESTION {String(index + 1).padStart(2, '0')} <span className="slash">/</span> {String(questions.length).padStart(2, '0')}</span><span>{answeredCount} of {questions.length} answered</span></div>
        <ProgressBar value={(index / questions.length) * 100 + (selected ? 100 / questions.length : 0)} />
        <div className="question-meta"><span className="concept-chip">{current.short_concept || current.concept}</span><span className="difficulty">{current.difficulty}</span></div>
        <h1 className="question-title">{current.prompt}</h1>
        <p className="question-hint"><CircleHelp size={16} /> Choose the best answer based on the evidence in the scenario.</p>
        <div className="options-list">
          {current.options.map((option, i) => <button key={option.id} onClick={() => choose(option.id)} className={`option-card ${selected === option.id ? 'selected' : ''}`}>
            <span className="option-letter">{String.fromCharCode(65 + i)}</span><span className="option-text">{option.text}</span><span className="option-check">{selected === option.id && <Check size={16} />}</span>
          </button>)}
        </div>
        {index === 0 && <label className="name-field">Name for your learning report <span>Optional</span><input value={name} onChange={e => setName(e.target.value)} maxLength={60} placeholder="e.g. Learner" /></label>}
        {error && <div className="inline-error"><TriangleAlert size={16} /> {error}</div>}
        <div className="quiz-footer"><button className="btn-secondary" onClick={back} disabled={index === 0}><ArrowLeft size={16} /> Previous</button>{index < questions.length - 1 ? <button className="btn-primary" onClick={next} disabled={!selected}>Next question <ArrowRight size={16} /></button> : <button className="btn-primary" onClick={finish} disabled={answeredCount !== questions.length || busy}>{busy ? <span className="spinner" /> : <Sparkles size={16} />}{busy ? 'Building your twin…' : 'Generate my learning twin'} <ArrowRight size={16} /></button>}</div>
      </section>
      <aside className="quiz-aside">
        <div className="aside-icon"><BrainCircuit size={24} /></div><h3>Your answers build a learning profile</h3><p>Each response gives a small signal about how you understand a security concept. Your results will show both the answer evidence and what to practise next.</p>
        <div className="aside-divider" />
        <div className="aside-stat"><ShieldCheck size={17} /><span><b>6 concepts</b><small>Foundations to applied reasoning</small></span></div>
        <div className="aside-stat"><Target size={17} /><span><b>Clear next steps</b><small>Specific, actionable practice</small></span></div>
        <div className="aside-stat"><LockKeyhole size={17} /><span><b>Demo-safe scenarios</b><small>No live system access</small></span></div>
        <div className="aside-disclaimer">There are no trick questions. Answer based on what you currently understand.</div>
      </aside>
    </div>
  </div>
}

function ScoreRing({ score }) {
  return <div className="score-ring" style={{ '--score': `${score * 3.6}deg` }}><div className="score-ring-inner"><strong>{score}%</strong><span>DIAGNOSTIC</span></div></div>
}

function Results({ result, onRestart, onHome }) {
  const [tab, setTab] = useState('gaps')
  const chartData = useMemo(() => result.concepts.map(c => ({ concept: c.short_concept, mastery: c.mastery, correct: c.correct })), [result])
  const downloadReport = () => {
    const text = [
      `LearnTwin AI — Personal Learning Report`,
      `Learner: ${result.student_name}`,
      `Diagnostic score: ${result.score}% (${result.correct_count}/${result.total_questions})`,
      `Learning level: ${result.level}`,
      '',
      'CONCEPT PROFILE',
      ...result.concepts.map(c => `${c.concept}: ${c.mastery}% — ${c.status}`),
      '',
      'LEARNING GAPS',
      ...(result.gaps.length ? result.gaps.flatMap(g => [`${g.concept}: ${g.misconception}`, `Remedy: ${g.remedy}`, `Next step: ${g.next_step}`, '']) : ['No incorrect answers in this diagnostic. Continue with applied practice.']),
      'COGNITIVE COACHING',
      ...result.cognitive_coaching.map(c => `${c.title}: ${c.description}`),
      '',
      result.disclaimer
    ].join('\n')
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a'); a.href = url; a.download = 'learntwin-learning-report.txt'; a.click(); URL.revokeObjectURL(url)
  }
  return <div className="results-shell">
    <div className="results-topline"><button className="back-link" onClick={onHome}><ArrowLeft size={16} /> Overview</button><div className="report-actions"><span className="quiz-tag"><CheckCircle2 size={14} /> Diagnostic complete</span><button className="btn-secondary compact" onClick={downloadReport}><Download size={15} /> Export report</button></div></div>
    <div className="results-title-row"><div><div className="eyebrow">YOUR PERSONAL LEARNING TWIN <span className="eyebrow-line" /></div><h1>Your learning profile, <span>decoded.</span></h1><p className="subhead">Here is what your answers suggest today — and how to turn that insight into progress.</p></div><button className="btn-secondary" onClick={onRestart}><RotateCcw size={16} /> Retake quiz</button></div>
    <div className="results-hero">
      <div className="score-block"><ScoreRing score={result.score} /><div><span className="result-kicker">CURRENT SNAPSHOT</span><h2>{result.level}</h2><p>{result.correct_count} of {result.total_questions} answers correct</p></div></div>
      <div className="result-divider" />
      <div className="result-insight"><div className="insight-label"><Sparkles size={15} /> YOUR NEXT MILESTONE</div><h2>{result.headline}</h2><p>{result.ai_feedback || result.summary}</p><span className="evidence-note"><CheckCircle2 size={14} /> Recommendations are linked to your answer evidence</span></div>
    </div>
    <div className="results-metrics">
      <Metric icon={Target} label="Concepts assessed" value={result.total_questions} note="Across six skill areas" tone="blue" />
      <Metric icon={TrendingUp} label="Strength signals" value={result.strengths.length} note="Correct responses" tone="green" />
      <Metric icon={Lightbulb} label="Priority gaps" value={result.gaps.length} note="Areas to practise" tone="amber" />
      <Metric icon={Activity} label="Next actions" value={result.learning_plan.length} note="Personalized steps" tone="purple" />
    </div>
    <div className="results-grid">
      <section className="panel mastery-panel">
        <div className="panel-heading"><div><h2>Learning twin</h2><p>Concept-level mastery signals</p></div><span className="panel-badge"><BrainCircuit size={14} /> LIVE PROFILE</span></div>
        <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 14, left: 2, bottom: 0 }} barCategoryGap={13}>
          <CartesianGrid strokeDasharray="3 4" horizontal={false} stroke="#e9edf3" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#8892a3' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <YAxis type="category" dataKey="concept" width={94} tick={{ fontSize: 11, fill: '#667085' }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: '#f6f8fb' }} formatter={(v) => [`${v}%`, 'Mastery signal']} />
          <Bar dataKey="mastery" radius={[0, 5, 5, 0]} barSize={13}>{chartData.map((entry, i) => <Cell key={entry.concept} fill={entry.correct ? '#4a9d8d' : '#d8a45c'} />)}</Bar>
        </BarChart></ResponsiveContainer></div>
        <div className="chart-legend"><span><i className="legend-dot green" /> Correct response · 100</span><span><i className="legend-dot amber" /> Practice signal · 35</span></div>
        <div className="mastery-footnote"><CircleHelp size={14} /> Estimates are illustrative: one question per concept is not enough to establish true mastery.</div>
      </section>
      <section className="panel gap-panel">
        <div className="panel-heading"><div><h2>What to focus on</h2><p>Based on the answers you selected</p></div><span className="count-badge">{result.gaps.length} gaps</span></div>
        {result.gaps.length ? <div className="gap-list">{result.gaps.slice(0, 4).map((gap, i) => <div className="gap-item" key={gap.concept}><div className="gap-number">{String(i + 1).padStart(2, '0')}</div><div className="gap-item-copy"><b>{gap.concept}</b><span>{gap.misconception}</span></div><span className={`priority-tag ${gap.severity.toLowerCase()}`}>{gap.severity}</span></div>)}</div> : <div className="all-clear"><div className="all-clear-icon"><Award size={23} /></div><b>No gaps flagged in this snapshot</b><p>Move to scenario-based practice to check how well your knowledge transfers.</p></div>}
      </section>
    </div>
    <section className="panel action-panel">
      <div className="panel-heading action-heading"><div><h2>Your improvement roadmap</h2><p>Small, focused actions are easier to apply and reassess.</p></div><span className="panel-badge"><Compass size={14} /> PERSONALIZED</span></div>
      <div className="tabs"><button className={tab === 'gaps' ? 'tab active' : 'tab'} onClick={() => setTab('gaps')}>Remedies & next steps</button><button className={tab === 'thinking' ? 'tab active' : 'tab'} onClick={() => setTab('thinking')}>Improve your thinking</button><button className={tab === 'answers' ? 'tab active' : 'tab'} onClick={() => setTab('answers')}>Answer review</button></div>
      {tab === 'gaps' && <div className="roadmap">
        {result.learning_plan.map((step) => <div className="roadmap-step" key={step.step}><div className="roadmap-number">{String(step.step).padStart(2, '0')}</div><div className="roadmap-content"><span className="roadmap-label">FOCUS AREA</span><h3>{step.focus}</h3><p>{step.action}</p><div className="remedy-box"><Lightbulb size={16} /><span><b>Why this helps</b>{step.purpose}</span></div></div></div>)}
        {result.gaps.map(gap => <details className="gap-detail" key={gap.concept}><summary><span>{gap.concept}</span><span>View practice guidance <ChevronRight size={15} /></span></summary><div className="gap-detail-body"><p><b>Learning signal:</b> {gap.evidence}</p><p><b>Remedy:</b> {gap.remedy}</p><p><b>Try next:</b> {gap.next_step}</p><div className="thinking-tip"><Lightbulb size={15} /><span>{gap.thinking_tip}</span></div></div></details>)}
        {!result.gaps.length && <div className="success-note"><CheckCircle2 size={18} /><span><b>Keep stretching your understanding.</b> Try explaining each concept aloud, then complete a realistic scenario where the answer is not obvious.</span></div>}
      </div>}
      {tab === 'thinking' && <div className="thinking-grid">{result.cognitive_coaching.map((tip, i) => <div className="thinking-card" key={tip.title}><div className="thinking-card-icon">{[<FileSearch size={18} />, <BrainCircuit size={18} />, <ShieldCheck size={18} />, <RotateCcw size={18} />][i]}</div><h3>{tip.title}</h3><p>{tip.description}</p></div>)}</div>}
      {tab === 'answers' && <div className="answer-review">{result.question_results.map((q, i) => <details className="answer-item" key={q.question_id}><summary><span className={`answer-status ${q.correct ? 'correct' : 'incorrect'}`}>{q.correct ? <Check size={14} /> : <XCircle size={14} />}</span><span className="answer-title"><b>{q.concept}</b><small>{q.correct ? 'Correct response' : 'Review recommended'}</small></span><ChevronRight size={16} /></summary><div className="answer-body"><p><b>Your answer:</b> {q.selected_option_text}</p>{!q.correct && <p><b>Expected answer:</b> {q.correct_option_text}</p>}<p><b>Explanation:</b> {q.explanation}</p>{!q.correct && <p><b>Practice:</b> {q.remedy}</p>}</div></details>)}</div>}
    </section>
    {result.prerequisite_flags?.length > 0 && <section className="panel prereq-panel"><div className="panel-heading"><div><h2>Prerequisite signals</h2><p>Rule-based learning dependencies, not a trained prediction.</p></div><span className="panel-badge"><Activity size={14} /> RULE-BASED</span></div>{result.prerequisite_flags.map(flag => <div className="prereq-row" key={flag.concept}><TriangleAlert size={17} /><p><b>{flag.concept}</b> — {flag.reason}</p></div>)}</section>}
    <div className="bottom-note"><LockKeyhole size={15} /><span><b>Use this as a guide, not a label.</b> A six-question snapshot cannot fully measure ability. Reassess after practice to see whether your understanding changes.</span></div>
    <div className="results-bottom-actions"><button className="btn-secondary" onClick={onHome}><ArrowLeft size={16} /> Back to overview</button><button className="btn-primary" onClick={onRestart}><RotateCcw size={16} /> Practise again <ArrowRight size={16} /></button></div>
  </div>
}

function HistoryModal({ history, onClose }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal-card" onClick={e => e.stopPropagation()}><div className="modal-head"><div><h2>Learning session history</h2><p>Recent assessment snapshots saved on this backend.</p></div><button className="icon-button" onClick={onClose}><XCircle size={20} /></button></div>{history.length ? <div className="modal-history">{history.map(item => <div className="history-row" key={item.id}><div className="history-symbol"><GraduationCap size={18} /></div><div className="history-main"><b>{item.student_name}</b><span>{new Date(item.created_at).toLocaleString()}</span></div><div className="history-score">{item.score}%</div><div className="modal-score-track"><ProgressBar value={item.score} /></div></div>)}</div> : <div className="empty-modal">No sessions saved yet. Complete a diagnostic to create a learning snapshot.</div>}<button className="btn-primary modal-close" onClick={onClose}>Done <Check size={16} /></button></div></div>
}

export default function App() {
  const [view, setView] = useState('dashboard')
  const [questions, setQuestions] = useState([])
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [health, setHealth] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [error, setError] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const refreshData = async () => {
    try { const [h, hist] = await Promise.all([getHealth(), getHistory()]); setHealth(h.status === 'ok'); setHistory(hist.history || []) }
    catch { setHealth(false) }
  }
  useEffect(() => { refreshData() }, [])

  const startQuiz = async () => {
    setError(''); setLoadingQuestions(true)
    try {
      const data = await getQuestions()
      setQuestions(data.questions || [])
      setView('quiz')
    } catch (e) { setError(e.message) }
    finally { setLoadingQuestions(false) }
  }
  const submit = async (payload) => {
    setBusy(true); setError('')
    try {
      const data = await submitAssessment(payload)
      setResult(data); setView('results'); await refreshData()
    } catch (e) { setError(e.message) }
    finally { setBusy(false) }
  }
  const home = () => { setView('dashboard'); setError('') }
  const restart = () => { setResult(null); startQuiz() }

  return <div className="app-shell">
    <Header view={view} onHome={home} />
    <main className="page-content">
      {view === 'dashboard' && <>{error && <div className="global-error"><TriangleAlert size={16} />{error}<button onClick={() => setError('')}><XCircle size={15} /></button></div>}<Dashboard onStart={startQuiz} history={history} health={health} onShowHistory={() => setShowHistory(true)} />{loadingQuestions && <div className="loading-overlay"><div className="loading-card"><span className="spinner dark" /><b>Preparing your diagnostic…</b></div></div>}</>}
      {view === 'quiz' && <Quiz questions={questions} onSubmit={submit} onCancel={home} busy={busy} error={error} />}
      {view === 'results' && result && <Results result={result} onRestart={restart} onHome={home} />}
    </main>
    <footer className="footer"><Brand /><div>LearnTwin AI <span>·</span> Understand learning. Improve with evidence.</div><span className="footer-right">Prototype v1.0</span></footer>
    {showHistory && <HistoryModal history={history} onClose={() => setShowHistory(false)} />}
  </div>
}
