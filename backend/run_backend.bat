@echo off
REM Change directory to script folder, then start backend using venv python
cd /d "%~dp0"
if exist venv\Scripts\python.exe (
  venv\Scripts\python.exe app.py
) else (
  echo venv Python not found. Please create the virtualenv at backend\venv
)