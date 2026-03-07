#!/bin/bash
# Build script for Stables MiniDapp
# Creates .mds.zip package for MinimaOS installation

echo "Building Stables MiniDapp..."

cd app

# Create the .mds.zip package
zip -r ../Stables.mds.zip *

cd ..

echo "✅ MiniDapp packaged successfully!"
echo "📦 File created: Stables.mds.zip"
echo ""
echo "To install:"
echo "1. Open MinimaOS in your browser"
echo "2. Navigate to MiniDapps section"
echo "3. Click 'Install MiniDapp'"
echo "4. Upload Stables.mds.zip"
echo "5. Run Stables!"



