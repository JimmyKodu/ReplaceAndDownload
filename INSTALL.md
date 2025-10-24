# Installation Guide

## Prerequisites

- Google Chrome browser (version 88 or later)
- Basic understanding of Chrome extensions

## Step-by-Step Installation

### 1. Download the Extension

Clone or download this repository to your local machine:

```bash
git clone https://github.com/JimmyKodu/ReplaceAndDownload.git
cd ReplaceAndDownload
```

### 2. Open Chrome Extensions Page

1. Open Google Chrome
2. Navigate to `chrome://extensions/` or:
   - Click the three-dot menu (⋮) in the top-right corner
   - Select "More tools" → "Extensions"

### 3. Enable Developer Mode

1. In the Extensions page, look for the "Developer mode" toggle in the top-right corner
2. Turn it **ON** (it will turn blue)

### 4. Load the Extension

1. Click the "Load unpacked" button that appears after enabling Developer mode
2. Navigate to the directory where you cloned/downloaded this extension
3. Select the folder containing `manifest.json`
4. Click "Select Folder" (or "Open" on some systems)

### 5. Verify Installation

After loading, you should see the extension card appear with:
- Name: "Replace and Download XLS"
- Version: 1.0
- Icon: A blue square with white border
- Status: Enabled (toggle should be ON)

## Testing the Extension

### Method 1: Using the Test Page

1. Open the `test.html` file in Chrome (drag and drop into browser)
2. Click either "Download Test XLS File" or "Download Test XLSX File"
3. The file will be generated and downloaded
4. Open the downloaded file in Excel or similar
5. Check column U (21st column) - the header should end with "1"

### Method 2: Download Any Excel File

1. Find any website that offers .xls or .xlsx file downloads
2. Click the download link
3. The extension will automatically:
   - Intercept the download
   - Modify column U header (append "1")
   - Download the modified file

## Troubleshooting

### Extension Not Working

1. Check if the extension is enabled in `chrome://extensions/`
2. Look for errors by clicking "Details" → "Inspect views: Service worker"
3. Check the Console for error messages

### Downloads Not Being Intercepted

1. Make sure the file extension is `.xls` or `.xlsx`
2. Check Chrome's download settings (should not be set to "Ask where to save each file")
3. Try refreshing the extension (click refresh icon on extension card)

### Column U Not Modified

1. Verify the Excel file has at least 21 columns
2. Check if column U has a header in row 1
3. Review the service worker console for error messages

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "Replace and Download XLS"
3. Click "Remove"
4. Confirm the removal

## Permissions Explained

This extension requires the following permissions:

- **webRequest**: To monitor download requests
- **downloads**: To intercept, cancel, and initiate downloads
- **host_permissions (all_urls)**: To access download URLs from any website

## Privacy

This extension:
- Only processes files locally in your browser
- Does not send any data to external servers
- Does not collect or store any personal information
- Only activates when downloading .xls or .xlsx files

## Support

If you encounter issues:
1. Check the Console in the Service Worker inspector
2. Verify the file format is compatible
3. Try with the provided test.html file first
4. Open an issue on GitHub with details about the problem
