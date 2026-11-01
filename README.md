# LearnTwin AI 3.0

### An AI-Powered Personalized Learning Diagnostic Platform

## Overview

LearnTwin AI 3.0 is a prototype designed to help learners understand their knowledge gaps and identify areas where they need improvement.

The platform assesses a learner's understanding through a quiz and uses AI-generated insights to highlight weaknesses, suggest remedies, and recommend next steps. The goal is to make learning more personalized by turning assessment results into actionable feedback.

The current prototype focuses on cybersecurity education and combines rule-based assessment logic with Google's Gemini API to generate explanations and learning recommendations.

## Live Demo

- **Frontend:** https://aarshmalik35-afk.github.io/learntwin-frontend/
- **Backend API:** https://learntwin-backend.onrender.com/
- **API Documentation:** https://learntwin-backend.onrender.com/docs

## Key Features

- **Knowledge Assessment:** Evaluates learners through topic-based questions.
- **Knowledge Gap Identification:** Highlights areas where a learner may need further practice.
- **AI-Generated Insights:** Uses Gemini to provide explanations and personalized recommendations.
- **Learning Remedies:** Suggests ways to improve understanding of weaker topics.
- **Recommended Next Steps:** Provides guidance on what learners can study or practise next.
- **Assessment History:** Stores previous assessment results using SQLite.
- **Interactive Dashboard:** Presents assessment results and AI-generated feedback through a React-based interface.
- **Cloud Deployment:** Frontend and backend are deployed separately, making the application accessible online.

## How It Works

1. The learner completes a cybersecurity assessment.
2. The frontend sends the responses to the FastAPI backend.
3. The backend evaluates the submitted answers and identifies potential knowledge gaps.
4. The assessment results are used to generate additional insights through Google's Gemini API.
5. The learner receives a summary of their performance, areas for improvement, suggested remedies, and recommended next steps.
6. Assessment records can be stored and retrieved through the application's history functionality.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- GitHub Pages

### Backend
- Python
- FastAPI
- REST API
- SQLite

### AI Integration
- Google Gemini API
- Rule-based assessment logic
- AI-generated explanations and recommendations

### Deployment
- GitHub Pages for the frontend
- Render for the backend

## System Architecture

The application follows a frontend-backend architecture.

**Frontend:** Provides the assessment interface and displays the learner's results.

**Backend:** Handles API requests, processes assessment responses, calculates results, and manages assessment history.

**AI Layer:** Uses Gemini to generate contextual explanations and learning recommendations based on assessment results.

**Database:** SQLite stores assessment history for retrieval.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Root endpoint |
| GET | `/api/health` | Checks backend availability |
| GET | `/api/questions` | Retrieves assessment questions |
| POST | `/api/assess` | Processes an assessment and generates results |
| GET | `/api/history` | Retrieves previous assessment records |

The complete API documentation is available through the live backend's `/docs` endpoint.

## Running the Project Locally

### Backend Setup

1. Clone the backend repository: https://github.com/aarshmalik35-afk/learntwin-backend
2. Install the Python dependencies listed in `requirements.txt`.
3. Create a `.env` file containing the required environment variables:
   - `GEMINI_API_KEY` — your Google Gemini API key.
   - `FRONTEND_ORIGIN` — the frontend origin, such as `http://localhost:5173` during local development.
4. Start the FastAPI application using Uvicorn.
5. Open the backend API documentation to explore and test the available endpoints.

### Frontend Setup

1. Clone the frontend repository: https://github.com/aarshmalik35-afk/learntwin-frontend
2. Install the dependencies listed in `package.json`.
3. Configure `VITE_API_BASE_URL` to point to the running backend, such as `http://127.0.0.1:8000` during local development.
4. Start the Vite development server.
5. Open the local frontend URL in your browser.

## Deployment

The frontend is hosted on GitHub Pages, while the backend runs on Render.

The frontend communicates with the deployed backend through the configured API base URL. Cross-origin resource sharing (CORS) is configured to allow requests from the deployed frontend.

The Gemini API key is configured on the backend rather than exposed in the frontend code.

## What I Learned

Building LearnTwin AI 3.0 gave me practical experience with:

- Integrating a React frontend with a Python backend.
- Designing and testing REST API endpoints.
- Connecting an application to a generative AI service.
- Combining rule-based logic with AI-generated explanations.
- Storing and retrieving assessment history using SQLite.
- Deploying a full-stack application using GitHub Pages and Render.
- Debugging API communication, environment variables, and CORS configuration.

## Future Improvements

- Introduce adaptive assessments that adjust question difficulty based on learner performance.
- Track progress across multiple assessments.
- Add more cybersecurity topics and learning resources.
- Improve explainability by showing how assessment rules contribute to identified knowledge gaps.
- Develop a more structured learner profile using repeated assessment results.
- Add authentication and individual learner accounts.
- Evaluate the consistency and educational usefulness of AI-generated recommendations.

## Limitations

LearnTwin AI 3.0 is an early-stage prototype. Its assessment results and AI-generated recommendations are intended to support learning and self-evaluation. They have not been independently validated as a measure of overall learning ability or future academic performance.

The quality of generated insights may vary depending on the assessment responses and the availability of the Gemini API.

## Author

**Aarsh Malik**

GitHub: https://github.com/aarshmalik35-afk

## Project Status

The application is deployed and functional as a prototype. Further work will focus on improving assessment quality, learner progress tracking, explainability, and personalization.
