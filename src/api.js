const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    })
  } catch {
    throw new Error(`Can't reach the LearnTwin backend at ${API_BASE}. Start FastAPI and try again.`)
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const detail = data.detail
    throw new Error(typeof detail === 'string' ? detail : 'The request could not be completed.')
  }
  return data
}

export const getHealth = () => request('/api/health')
export const getQuestions = () => request('/api/questions')
export const submitAssessment = (payload) => request('/api/assess', {
  method: 'POST',
  body: JSON.stringify(payload),
})
export const getHistory = () => request('/api/history?limit=6')
