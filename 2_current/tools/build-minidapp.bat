@echo off
REM Build script for Stablesworks MiniDapp (Windows)
REM Creates .mds.zip package for MinimaOS installation

echo Building Stablesworks MiniDapp...

cd app

REM Create the .mds.zip package using PowerShell
powershell Compress-Archive -Path * -DestinationPath ..\Stablesworks.mds.zip -Force

cd ..

echo.
echo ✅ MiniDapp packaged successfully!
echo 📦 File created: Stablesworks.mds.zip
echo.
echo To install:
echo 1. Open MinimaOS in your browser
echo 2. Navigate to MiniDapps section  
echo 3. Click 'Install MiniDapp'
echo 4. Upload Stablesworks.mds.zip
echo 5. Run Stablesworks!
echo.
pause



