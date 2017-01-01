REM Start node-red-webserver port 1880

cd..
set mypath=%cd%
@echo %mypath%
node-red %mypath%\src\webserver.json -s %mypath%\src\settings.js -u %mypath%\dir -v -p 1880
pause