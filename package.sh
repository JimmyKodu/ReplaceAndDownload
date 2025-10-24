#!/bin/bash

# Package Chrome Extension
# This script creates a zip file of the extension ready for distribution

echo "=== Packaging ReplaceAndDownload Chrome Extension ==="

# Define the extension name and version
EXTENSION_NAME="ReplaceAndDownload"
VERSION="1.0"
OUTPUT_FILE="${EXTENSION_NAME}-v${VERSION}.zip"

# Files to include in the package
FILES=(
    "manifest.json"
    "background.js"
    "xlsx.full.min.js"
    "icon16.png"
    "icon48.png"
    "icon128.png"
    "README.md"
    "INSTALL.md"
    "USAGE.md"
)

# Check if all required files exist
echo "Checking required files..."
MISSING_FILES=0
for file in "${FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "ERROR: Missing required file: $file"
        MISSING_FILES=$((MISSING_FILES + 1))
    else
        echo "  ✓ $file"
    fi
done

if [ $MISSING_FILES -gt 0 ]; then
    echo ""
    echo "ERROR: $MISSING_FILES required file(s) missing. Cannot package."
    exit 1
fi

# Remove old package if it exists
if [ -f "$OUTPUT_FILE" ]; then
    echo ""
    echo "Removing old package: $OUTPUT_FILE"
    rm "$OUTPUT_FILE"
fi

# Create the zip package
echo ""
echo "Creating package: $OUTPUT_FILE"
zip -r "$OUTPUT_FILE" "${FILES[@]}"

# Check if packaging was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Package created successfully!"
    echo ""
    echo "Package details:"
    ls -lh "$OUTPUT_FILE"
    echo ""
    echo "Contents:"
    unzip -l "$OUTPUT_FILE"
    echo ""
    echo "To install:"
    echo "1. Go to chrome://extensions/"
    echo "2. Enable Developer mode"
    echo "3. Extract $OUTPUT_FILE"
    echo "4. Click 'Load unpacked' and select the extracted folder"
else
    echo ""
    echo "ERROR: Failed to create package"
    exit 1
fi
