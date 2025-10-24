# Usage Guide

## Overview

This Chrome extension automatically intercepts downloads of Excel files (.xls and .xlsx) and modifies them before saving to your computer. Specifically, it appends the character "1" to the header in column U (the 21st column).

## How It Works

### Automatic Processing

1. **Detection**: When you initiate a download of an .xls or .xlsx file, the extension detects it
2. **Interception**: The original download is cancelled automatically
3. **Processing**: The file is fetched and parsed using the SheetJS library
4. **Modification**: The header in cell U1 (column U, row 1) has "1" appended to it
5. **Download**: The modified file is downloaded with the same filename

### Example

**Before modification:**
```
Column U header: "Sales Data"
```

**After modification:**
```
Column U header: "Sales Data1"
```

## Quick Start

### 1. Install the Extension

Follow the instructions in [INSTALL.md](INSTALL.md) to install the extension.

### 2. Test with Sample File

1. Open `test.html` in Chrome
2. Click "Download Test XLSX File"
3. The file will download automatically
4. Open the file in Excel
5. Check column U (21st column) - the header should end with "1"

### 3. Use with Real Files

Simply download any .xls or .xlsx file from any website. The extension will automatically process it.

## Detailed Examples

### Example 1: Downloading from a Website

1. Navigate to a website with Excel file downloads
2. Click a link to download an .xls or .xlsx file
3. The extension intercepts the download (you may briefly see "Canceled" status)
4. The modified file downloads automatically
5. Open the file to verify column U header has "1" appended

### Example 2: Checking the Modification

To verify the extension is working:

1. Before installing the extension, download an Excel file and note column U's header
2. Install the extension
3. Download the same file again
4. Compare the two files:
   - Original file: Column U header remains unchanged
   - Modified file: Column U header has "1" appended

### Example 3: Using the Test Page

The `test.html` file provides an easy way to test:

```html
<!-- Open test.html in Chrome -->
```

1. Click "Download Test XLSX File" button
2. Open the downloaded file
3. Navigate to column U (21st column)
4. Verify the header shows "U-Header-Original1" (with "1" at the end)

## Console Verification

Open Chrome DevTools (F12) while on test.html to run verification commands:

```javascript
// Test the modification logic
verifyExcelModification()

// Generate and download a test file
generateTestFile()

// Check extension API availability
checkExtensionAPIs()
```

## Troubleshooting

### The header doesn't have "1" appended

**Possible causes:**
- The Excel file doesn't have 21 columns
- Column U doesn't exist or is empty
- The extension is disabled

**Solutions:**
1. Check if the file has at least 21 columns
2. Verify the extension is enabled in chrome://extensions/
3. Check the Service Worker console for errors

### Download doesn't seem to be intercepted

**Possible causes:**
- File extension is not .xls or .xlsx
- Extension permissions are not granted
- Download is from a blob URL or data URL

**Solutions:**
1. Verify the file has .xls or .xlsx extension
2. Check extension permissions in chrome://extensions/
3. Try with the test.html file first

### Multiple downloads of the same file

**Possible causes:**
- Extension is processing the same file multiple times
- Browser cache issues

**Solutions:**
1. Reload the extension (click refresh in chrome://extensions/)
2. Clear browser cache
3. Try in an incognito window

## Advanced Usage

### Modifying the Extension

If you want to change what the extension does:

1. Edit `background.js`
2. Find the section that modifies the header (around line 44-46)
3. Change the modification logic
4. Reload the extension in chrome://extensions/

Example modification to add "MODIFIED" instead of "1":

```javascript
// Change this:
worksheet[headerCell].v = currentValue + '1';

// To this:
worksheet[headerCell].v = currentValue + 'MODIFIED';
```

### Changing the Target Column

To modify a different column instead of U:

1. Edit `background.js`
2. Find line 38: `const columnU = 'U';`
3. Change to your desired column (e.g., `const columnU = 'Z';` for column Z)
4. Reload the extension

### Processing Multiple Sheets

Currently, the extension only modifies the first sheet. To process all sheets:

1. Edit `background.js`
2. Modify the processing logic to loop through all sheets
3. Example code:

```javascript
// Instead of just the first sheet:
workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    if (worksheet['U1']) {
        worksheet['U1'].v = worksheet['U1'].v + '1';
    }
});
```

## Performance Considerations

- **File Size**: Large Excel files (>10MB) may take longer to process
- **Complex Files**: Files with many sheets or complex formulas may require more processing time
- **Memory**: Very large files are processed in memory; ensure sufficient RAM is available

## Privacy and Security

- All processing happens locally in your browser
- No data is sent to external servers
- The extension only activates for .xls and .xlsx downloads
- Original files are not modified on the server

## Frequently Asked Questions

### Q: Can I modify a different column?
A: Yes, edit the `columnU` variable in `background.js` to target a different column.

### Q: What if column U doesn't exist?
A: The extension will create cell U1 with value "1" if it doesn't exist.

### Q: Does this work with password-protected files?
A: No, encrypted/password-protected Excel files cannot be modified without the password.

### Q: Can I append something other than "1"?
A: Yes, edit the modification logic in `background.js` to append any text you want.

### Q: Does this work with Google Sheets exports?
A: Yes, if the file is exported as .xls or .xlsx format.

## Support

For issues or questions:
1. Check the Service Worker console for error messages
2. Try the test.html file to isolate the issue
3. Review the troubleshooting section above
4. Open an issue on GitHub with detailed information
