@echo off
REM deploy.bat — Build and deploy Autonomaton to the-grove.ai/autonomaton
REM
REM Usage: deploy.bat [commit message]
REM
REM What it does:
REM   1. Builds the Vite project
REM   2. Copies dist/ to ..\the-grove-foundation\autonomaton\
REM   3. Commits and pushes grove-foundation (triggers Cloud Build)

setlocal enabledelayedexpansion

set GROVE_FOUNDATION=..\the-grove-foundation
set AUTONOMATON_DIR=%GROVE_FOUNDATION%\autonomaton

echo [1/4] Building Autonomaton...
call npm run build
if errorlevel 1 (
    echo Build failed!
    exit /b 1
)

echo [2/4] Copying to grove-foundation...
if exist "%AUTONOMATON_DIR%" rmdir /s /q "%AUTONOMATON_DIR%"
mkdir "%AUTONOMATON_DIR%"
xcopy /s /e /q dist\* "%AUTONOMATON_DIR%\"

echo [3/4] Committing changes...
cd "%GROVE_FOUNDATION%"

git add autonomaton/

REM Use provided message or default
set COMMIT_MSG=%~1
if "%COMMIT_MSG%"=="" set COMMIT_MSG=chore: Update Autonomaton demo

git commit -m "%COMMIT_MSG%" -m "" -m "Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
if errorlevel 1 (
    echo No changes to commit or commit failed
    exit /b 0
)

echo [4/4] Pushing to trigger Cloud Build...
git push origin main

echo.
echo Done! Cloud Build will deploy in ~3-5 minutes.
echo View at: https://the-grove.ai/autonomaton
