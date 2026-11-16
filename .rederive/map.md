# Decision map
repo: interviewIQ | built from: 1b947fe | date: 2026-11-14
root problem: Candidates preparing for technical and HR interviews need a realistic mock-interview workflow that adapts to their resume and role, gives instant feedback, and keeps their history and credit usage without requiring a human coach.

## D1. Personal identity and protected access
- Problem: the same user must stay logged in across pages, keep interview history, and make authenticated requests without re-entering credentials.
- Given: there is a web app with a Node API and a Google sign-in flow.
- Constraints, in order:
  1. Every interview call must know which user is acting -> breaks: anonymous or mixed-user interview records.
  2. Tokens must be valid across page loads without exposing them to the browser -> breaks: storing secrets in local storage or sending them on every request by hand.
- Decision: session-based identity. The server signs a JWT, stores it in an HttpOnly cookie, and a middleware reads that cookie to attach the user ID to each protected request; the client rehydrates the current user from Redux on startup.
- Options:
  - Browser-only state: simple, but not trusted by the server.
  - LocalStorage token: easy to implement, but less secure and harder to scope.
  - HttpOnly cookie + JWT: the chosen design; authenticated requests are automatic and safer.
- Evidence: commit a801141 "Ai interview agent", files server/index.js, server/config/token.js, server/middlewares/isAuth.js, client/src/App.jsx, client/src/redux/userSlice.js

## D2. Turn a resume into structured interview input
- Problem: a generic interview can be useful, but practicing for a real role means the questions should reflect the person’s background, projects, and skills.
- Given: resume uploads exist, and the system can accept a PDF and ask AI for structured data.
- Constraints, in order:
  1. The AI needs enough context to tailor questions without seeing a whole document dump -> breaks: feeding raw PDF text directly with no normalization.
  2. The extracted profile must be consistent enough to feed downstream prompts -> breaks: freeform text that makes question generation unreliable.
- Decision: a normalization pipeline. The server reads the uploaded PDF, extracts text page by page, strips whitespace, and asks a model to return JSON for role, experience, projects, and skills before generating interview questions.
- Options:
  - Ask AI on the raw PDF text: fast, but noisy and inconsistent.
  - Manual profile form only: predictable, but too much friction for real users.
  - PDF extraction + JSON schema: the chosen design; it preserves useful details and keeps prompts structured.
- Evidence: commit a801141 "Ai interview agent", files server/controllers/interview.controller.js, client/src/components/Step1SetUp.jsx, server/middlewares/multer.js

## D3. Generate a realistic interview, not a random prompt list
- Problem: the system must create a short but credible mock interview that ramps from simple to hard without producing messy output.
- Given: the user has a role, experience, mode, resume signals, and a requirement to practice.
- Constraints, in order:
  1. The output must be usable by the UI and by the evaluation system -> breaks: freeform AI text with no predictable shape.
  2. Questions must feel natural and vary by difficulty -> breaks: a flat list of generic prompts.
- Decision: constrained prompt generation. The model is asked for exactly five one-line questions, each a single sentence within a narrow word count, with difficulty progression from easy to hard.
- Options:
  - Freely generated questions: easier to write, but not consistent enough for a timed interview flow.
  - Human-curated question bank: reliable, but not personalized to each profile.
  - Structured AI generation with a fixed schema: the chosen design; it balances personalization and predictability.
- Evidence: commit a801141 "Ai interview agent", files server/controllers/interview.controller.js, server/services/openRouter.service.js, client/src/components/Step1SetUp.jsx

## D4. Keep the interview interactive and time-bounded
- Problem: the user needs a usable mock interview experience with natural speech, a timer, and answer capture, not just a static list of questions.
- Given: the UI can speak prompts, listen to spoken answers, and submit them after each question.
- Constraints, in order:
  1. The interview should feel like a real conversation, not a form -> breaks: text-only or static question screens.
  2. The system must cap each answer and still collect enough content for scoring -> breaks: no time pressure or no response tracking.
- Decision: a stateful interview loop. The front end speaks each question, turns on speech recognition, tracks time per question, and submits the transcript + timing to the backend for scoring.
- Options:
  - One-off text form for all answers: simpler, but not realistic.
  - Pure audio-only without time tracking: immersive, but hard to evaluate and compare.
  - Real-time answer capture + timed per-question loop: the chosen design; it matches salary-screening interview pressure while keeping evaluation tractable.
- Evidence: commit a801141 "Ai interview agent", files client/src/components/Step2Interview.jsx, server/controllers/interview.controller.js

## D5. Score each answer with a separate AI evaluation step
- Problem: once an answer exists, the system needs to judge clarity, correctness, and confidence; otherwise the interview is just a recording.
- Given: each question has a prompt and answer transcript, and the model can produce structured scores.
- Constraints, in order:
  1. The scoring must be consistent and usable in a report -> breaks: a freeform paragraph with no numbers.
  2. The system should not overstate confidence in weak answers -> breaks: giving generic high scores.
- Decision: per-question rubric scoring. The backend sends the question and answer to the AI with a scoring rubric and asks for a numeric confidence/communication/correctness breakdown plus a short feedback sentence; it then stores those values on the interview record.
- Options:
  - No scoring at all: easier, but not a useful practice tool.
  - Single overall score: faster, but hides what went wrong.
  - Multi-factor rubric + feedback: the chosen design; it explains both the outcome and the weak areas.
- Evidence: commit a801141 "Ai interview agent", files server/controllers/interview.controller.js

## D6. Control AI consumption with credits and paid plans
- Problem: generative question creation and answer evaluation are expensive operations, so the platform needs usage limits to avoid abuse and to fund the service.
- Given: the app has a user model, a database, and payment integration.
- Constraints, in order:
  1. Expensive AI calls must be gated before they happen -> breaks: unlimited usage from one user.
  2. Chargers and credit balances must remain consistent across payment verification and user state -> breaks: a wallet model with no durable records.
- Decision: a credits-based billing model. The user starts with credits, each interview generation consumes a batch, and Razorpay creates then verifies a payment order that increments credits on successful confirmation.
- Options:
  - Unlimited free access: easiest for users, but unsustainable.
  - Paywall only at sign-up: harsh and not tied to actual usage.
  - Usage-metered credits with payment verification: the chosen design; it matches AI cost and keeps the platform active.
- Evidence: commit a801141 "Ai interview agent", files server/controllers/payment.controller.js, server/models/user.model.js, server/services/razorpay.service.js, client/src/pages/Pricing.jsx

## D7. Preserve the interview as a reportable artifact
- Problem: users need to review their score over time and compare progress, not just see the latest interview.
- Given: interview records can store question-level metadata and aggregate scores.
- Constraints, in order:
  1. Results should remain available after a session ends -> breaks: only in-memory state.
  2. History should be queryable by user and by interview -> breaks: no durable storage for timeline and analytics.
- Decision: persistent interview records. Each interview saves the role, questions, answers, scores, and final averages; the API then exposes both a list endpoint and a report endpoint for the client to render history and scorecards.
- Options:
  - Only in-browser state: easy, but disappears on refresh.
  - Single flat log file: simple, but poor querying and security.
  - MongoDB-backed interview records: the chosen design; it supports history, retrieval, and long-term analysis.
- Evidence: commit a801141 "Ai interview agent", files server/models/interview.model.js, server/controllers/interview.controller.js, client/src/pages/InterviewHistory.jsx, client/src/pages/InterviewReport.jsx
