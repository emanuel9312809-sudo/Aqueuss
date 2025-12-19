@echo off
echo Aequus Launcher
echo ===============
echo.
echo 1. Checking for Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor instale o Node.js em: https://nodejs.org/
    pause
    exit
)

echo.
echo 2. Installing dependencies (this may take a minute)...
call npm install

echo.
echo 3. Starting Aequus...
echo O navegador deve abrir em breve.
echo Pressione CTRL+C para parar o servidor.
echo.
call npm run dev
pause
