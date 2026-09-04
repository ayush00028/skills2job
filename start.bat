@echo off
echo ===================================================
echo Starting Skills2Job Full-Stack Platform...
echo ===================================================

echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "Skills2Job Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo Starting Next.js Frontend on http://localhost:3000 ...
start "Skills2Job Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo ===================================================
echo Both servers launched in separate windows!
echo Web App: http://localhost:3000
echo API Docs: http://127.0.0.1:8000/docs
echo ===================================================
