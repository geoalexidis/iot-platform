REM Start node-red-sandbox on port 1881

cd..
set mypath=%cd%
@echo %mypath%
node-red %mypath%\src\sandbox.json	-s %mypath%\src\settings.js -u %mypath%\dir -v -p 1881
pause
