@echo off
REM Read the config file
set "file=config.txt"
set /A i=0

for /F "usebackq delims=" %%a in ("%file%") do (
set /A i+=1
call set array[%%i%%]=%%a
call set n=%%i%%
)

REM Start DB
%array[1]%
%array[2]%
start mongod %array[3]%