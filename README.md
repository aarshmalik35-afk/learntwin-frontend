# LearnTwin AI 3.0
### An AI-powered digital twin for personalized learning

LearnTwin AI is a project built around a simple idea: students should understand more than just their marks. They should know what they're good at, where they're struggling, and what they can do to improve.

The project explores how AI and digital twin technology can make learning more personalized. The current prototype focuses on cybersecurity education, where students can take an assessment, identify gaps in their knowledge, and receive personalized insights and recommendations.

## What does it do?

Instead of stopping at a score, LearnTwin AI tries to explain what that score actually means.

- **Cybersecurity assessments:** Students answer questions to evaluate their understanding of cybersecurity concepts.
- **Knowledge gap analysis:** The system identifies strengths and areas that need more attention based on assessment responses.
- **AI-generated insights:** Google Gemini helps explain the results in a clear, understandable way.
- **Personalized recommendations:** Students receive suggestions for what to revise and how to improve.
- **Learning history:** Assessment results can be saved and reviewed later.
- **Digital twin approach:** The assessment results form a representation of the student's current learning profile, providing a foundation for tracking progress over time.

## How it works

The application follows a straightforward workflow:

1. The student completes a cybersecurity assessment.
2. The backend evaluates their answers and identifies strengths and knowledge gaps.
3. The assessment results are passed to Google Gemini to generate contextual feedback.
4. The student receives insights, explanations, and recommended next steps.
5. Assessment history can be used to review previous results.

The assessment engine handles the structured evaluation, while Gemini helps turn those findings into more useful feedback.

## Tech Stack

| Technology | Purpose |
|---|---|
| React and Vite | Frontend and user interface |
| Python and FastAPI | Backend and API development |
| SQLite | Storing assessment history |
| Google Gemini API | Generating personalized insights |
| REST API | Communication between frontend and backend |
| GitHub Pages | Frontend hosting |
| Render | Backend hosting |

## System Architecture

```text
Student
   |
   v
React + Vite Frontend
   |
   v
FastAPI Backend
   |
   +---- Assessment Engine
   |          |
   |          v
   |     Score and Knowledge Gaps
   |          |
   |          v
   |     Google Gemini
   |          |
   |          v
   |     Personalized Insights
   |
   v
SQLite Assessment History
```

## Live Demo

Try the deployed application:

- **Frontend:** https://aarshmalik35-afk.github.io/learntwin-frontend/
- **Backend API:** https://learntwin-backend.onrender.com/
- **API Documentation:** https://learntwin-backend.onrender.com/docs

The backend may take a little time to respond if the hosted service has been idle.

## Running Locally

### Prerequisites

- Python 3.11 or a compatible version
- Node.js and npm
- A Google Gemini API key for AI-generated feedback

### 1. Clone the repositories

```bash
git clone https://github.com/aarshmalik35-afk/learntwin-frontend.git
git clone https://github.com/aarshmalik35-afk/learntwin-backend.git
```

### 2. Start the backend

```bash
cd learntwin-backend
python -m venv .venv
```

Activate the virtual environment.

**Windows:**

```bash
.venv\Scripts\activate
```

**macOS/Linux:**

```bash
source .venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the backend repository root:

```env
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_ORIGIN=http://localhost:5173
```

Start the API:

```bash
uvicorn app.main:app --reload
```

The backend will run at `http://127.0.0.1:8000`.

You can access the interactive API documentation at `http://127.0.0.1:8000/docs`.

### 3. Start the frontend

Open a separate terminal:

```bash
cd learntwin-frontend
npm install
```

Create a `.env` file in the frontend repository root:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Run the development server:

```bash
npm run dev
```

Open the local URL provided by Vite, usually `http://localhost:5173`.

Make sure the backend's CORS configuration allows the frontend's local origin.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Basic API information |
| GET | `/api/health` | Checks whether the backend is running |
| GET | `/api/questions` | Returns assessment questions |
| POST | `/api/assess` | Evaluates answers and returns assessment insights |
| GET | `/api/history` | Retrieves saved assessment history |

You can explore these endpoints through the FastAPI documentation at `/docs`.

## Deployment

The frontend is hosted on GitHub Pages, while the backend runs on Render. GitHub Actions builds and deploys the frontend when changes are pushed to the configured branch.

The frontend uses this production API URL:

```env
VITE_API_BASE_URL=https://learntwin-backend.onrender.com
```

For the Vite configuration, the GitHub Pages project path should match the repository name:

```javascript
base: "/learntwin-frontend/",
```

The backend uses the following Render start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## What I learned from building this

This project brought together frontend development, backend APIs, database integration, cloud deployment, and generative AI in one application.

It also involved working through practical deployment issues, including connecting a separately hosted frontend and backend and configuring CORS correctly.

More importantly, it gave me an opportunity to explore how AI-generated explanations can make assessment results more useful than a score alone.

## What's next?

There is plenty of room to build on the current prototype. Some improvements I'd like to explore include:

- Tracking changes in a student's knowledge profile across multiple assessments.
- Adjusting question difficulty based on performance.
- Adding visualizations for learning progress.
- Expanding the platform to cover more cybersecurity topics.
- Evaluating how accurate and useful the recommendations are over time.

## A note on the current version

LearnTwin AI is a working prototype. Its learning profile is based on assessment evidence, and its AI-generated recommendations are intended to support learning rather than replace formal evaluation. The effectiveness of its recommendations and any predictive capabilities would need further testing.

---

**LearnTwin AI 3.0** is an exploration of how AI and digital twin concepts can help make learning more personal, understandable, and actionable.

Built by Aarsh Malik.
