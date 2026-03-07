@echo off
REM Build script for Stables MiniDapp (Windows)
REM Creates .mds.zip package for MinimaOS installation

echo Building Stables MiniDapp...

cd app

REM Create the .mds.zip package using PowerShell
powershell Compress-Archive -Path * -DestinationPath ..\Stables.mds.zip -Force

cd ..

echo.
echo ✅ MiniDapp packaged successfully!
echo 📦 File created: Stables.mds.zip
echo.
echo To install:
echo 1. Open MinimaOS in your browser
echo 2. Navigate to MiniDapps section  
echo 3. Click 'Install MiniDapp'
echo 4. Upload Stables.mds.zip
echo 5. Run Stables!
echo.
pause



