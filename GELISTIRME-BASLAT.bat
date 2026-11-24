@echo off
cd /d "%~dp0"
where npm >nul 2>&1
if errorlevel 1 (
 echo Node.js LTS kurulu degil. https://nodejs.org/ adresinden kurun.
 pause
 exit /b 1
)
if not exist node_modules\vite\package.json (
 call npm install
 if errorlevel 1 (pause & exit /b 1)
)
call npm run dev -- --open /gelistirme.html
pause
