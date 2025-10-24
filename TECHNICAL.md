# Technical Documentation

## Architecture

### Overview

This Chrome extension uses Manifest V3 architecture with a service worker (background script) that intercepts download events and modifies Excel files before they are saved to disk.

```
┌─────────────────┐
│   User Action   │
│ (Download .xls) │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Chrome Downloads   │
│   API (onCreated)   │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Background Service  │
│     Worker          │
│  (background.js)    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Cancel Original    │
│    Download         │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Fetch File from    │
│     URL             │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Parse with XLSX    │
│   (SheetJS lib)     │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Modify Column U    │
│    Header (+1)      │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Write Modified     │
│   Excel File        │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Convert to Blob    │
│   & Data URL        │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  Trigger New        │
│   Download          │
└─────────────────────┘
```

## Components

### 1. manifest.json

**Purpose**: Extension configuration and permissions declaration

**Key Configurations**:
- `manifest_version: 3` - Uses the latest Chrome extension API
- `permissions`: `["webRequest", "downloads"]`
- `host_permissions`: `["<all_urls>"]` - Required to access download URLs
- `background.service_worker`: Defines the background script

**Permissions Explained**:
- `webRequest`: Monitor and intercept network requests
- `downloads`: Access download events and manage downloads
- `<all_urls>`: Access files from any domain (required for fetching download URLs)

### 2. background.js

**Purpose**: Main logic for intercepting and modifying downloads

**Key Functions**:

#### Event Listener: `chrome.downloads.onCreated`
```javascript
chrome.downloads.onCreated.addListener((downloadItem) => { ... })
```
- Fires when a new download is created
- Receives downloadItem object with filename, URL, etc.

#### Processing Flow:

1. **Detection** (lines 8-20):
   - Check if file is .xls or .xlsx
   - Verify not already processed (prevent infinite loops)

2. **Cancellation** (line 25):
   ```javascript
   chrome.downloads.cancel(downloadItem.id)
   ```

3. **Fetching** (lines 27-28):
   ```javascript
   fetch(downloadItem.url)
     .then(response => response.arrayBuffer())
   ```

4. **Parsing** (lines 30-31):
   ```javascript
   const workbook = XLSX.read(arrayBuffer, { type: 'array' })
   ```

5. **Modification** (lines 38-51):
   ```javascript
   if (worksheet[headerCell]) {
     worksheet[headerCell].v = currentValue + '1'
   }
   ```

6. **Writing** (lines 54-57):
   ```javascript
   const modifiedArrayBuffer = XLSX.write(workbook, {
     type: 'array',
     bookType: 'xlsx'
   })
   ```

7. **Re-downloading** (lines 72-76):
   ```javascript
   chrome.downloads.download({
     url: dataUrl,
     filename: downloadItem.filename
   })
   ```

### 3. xlsx.full.min.js

**Purpose**: SheetJS library for Excel file manipulation

**Capabilities**:
- Parse .xls (BIFF8) and .xlsx (OOXML) formats
- Read/write cell values
- Handle formulas, formatting, and multiple sheets
- Convert between different Excel formats

**Key APIs Used**:
- `XLSX.read(data, options)` - Parse Excel file
- `XLSX.write(workbook, options)` - Generate Excel file
- `XLSX.utils.*` - Utility functions for data manipulation

**Version**: 0.20.1 (included)

### 4. Icons (icon16.png, icon48.png, icon128.png)

**Purpose**: Visual representation in Chrome UI

**Specifications**:
- 16x16px: Toolbar icon
- 48x48px: Extensions page
- 128x128px: Chrome Web Store (if published)

**Format**: PNG with transparency support

## Data Flow

### Input Data
```
Download URL → ArrayBuffer → XLSX Workbook → Worksheet → Cell U1
```

### Modification
```
Cell U1.value → Append "1" → Cell U1.value + "1"
```

### Output Data
```
Modified Worksheet → XLSX Workbook → ArrayBuffer → Blob → Data URL → Download
```

## Cell Addressing

Excel uses A1 notation:
- **A** = Column 1
- **B** = Column 2
- ...
- **U** = Column 21 (target column)

Cell reference format: `[Column Letter][Row Number]`
- Example: `U1` = Column U, Row 1 (header row)

## Error Handling

### Scenarios Handled:

1. **File doesn't exist** (line 42):
   ```javascript
   if (worksheet[headerCell]) { ... } else { ... }
   ```

2. **Processing error** (lines 91-95):
   ```javascript
   .catch(error => {
     console.error('Error processing Excel file:', error)
     chrome.downloads.resume(downloadItem.id)
   })
   ```

3. **Infinite loop prevention** (lines 17-20):
   ```javascript
   if (processedDownloads.has(downloadItem.id)) {
     return
   }
   ```

### Memory Management

```javascript
setTimeout(() => {
  processedDownloads.delete(newDownloadId)
}, 60000) // Clean up after 1 minute
```

## Performance Considerations

### Memory Usage
- Files are loaded entirely into memory (ArrayBuffer)
- Large files (>100MB) may cause performance issues
- Service workers have limited memory available

### Processing Time
- Small files (<1MB): <1 second
- Medium files (1-10MB): 1-5 seconds
- Large files (>10MB): 5+ seconds

### Optimization Opportunities
1. Stream processing for large files
2. Web Worker for heavy computation
3. Caching for frequently modified files

## Security Considerations

### Data Privacy
- All processing happens locally in the browser
- No data sent to external servers
- Files are not stored persistently

### Permissions
- `<all_urls>` is broad but necessary for fetching download URLs
- Could be restricted if only specific domains are targeted

### Potential Risks
1. **CORS issues**: Some URLs may block fetch requests
2. **Malicious files**: No validation of Excel file content
3. **Memory exhaustion**: Very large files could crash the extension

### Recommendations
1. Add file size limit checking
2. Validate Excel file structure before processing
3. Implement timeout for processing
4. Restrict host_permissions to specific domains if possible

## Browser Compatibility

### Minimum Requirements
- Chrome 88+ (Manifest V3 support)
- Edge 88+ (Chromium-based)

### API Support
- `chrome.downloads.onCreated` - Chrome 31+
- `chrome.downloads.download` - Chrome 31+
- Service Workers - Chrome 40+

### Not Compatible With
- Firefox (different extension API)
- Safari (different extension API)
- Opera (may need testing)

## Testing

### Unit Testing
Currently no automated tests. To add:
1. Use Jest or Mocha for JavaScript testing
2. Mock Chrome APIs with sinon-chrome
3. Test file modification logic separately

### Integration Testing
1. Load extension in Chrome
2. Download test files from test.html
3. Verify modifications manually

### Manual Testing Checklist
- [ ] Download .xls file - verify modification
- [ ] Download .xlsx file - verify modification
- [ ] Download file with empty column U - verify creation
- [ ] Download file with <21 columns - verify behavior
- [ ] Download file with multiple sheets - verify first sheet
- [ ] Test with large file (>10MB) - verify performance
- [ ] Test with password-protected file - verify error handling

## Development Workflow

### Setup
```bash
git clone <repository-url>
cd ReplaceAndDownload
npm install  # Install dependencies for development
```

### Making Changes
1. Edit source files (background.js, manifest.json, etc.)
2. Go to chrome://extensions/
3. Click refresh icon on extension card
4. Test changes

### Debugging
1. Click "Service worker" link in extension details
2. Open DevTools console
3. Add console.log statements in background.js
4. Monitor logs during file downloads

### Building
```bash
./package.sh  # Creates ReplaceAndDownload-v1.0.zip
```

## Future Enhancements

### Potential Features
1. **Configuration UI**: Allow users to specify:
   - Target column (currently hardcoded to U)
   - Text to append (currently hardcoded to "1")
   - Which sheets to process
   - File size limits

2. **Multiple Column Support**: Modify multiple columns simultaneously

3. **Advanced Modifications**:
   - Replace text patterns
   - Add formulas
   - Format cells
   - Add/remove rows or columns

4. **Progress Indication**: Show processing status in browser action popup

5. **Error Reporting**: User-friendly error messages

6. **Statistics**: Track number of files processed

### Code Improvements
1. Add TypeScript for type safety
2. Implement comprehensive test suite
3. Add build system (webpack/rollup)
4. Modularize code into separate files
5. Add linting (ESLint) and formatting (Prettier)

## Known Limitations

1. **Single Sheet**: Only processes the first sheet in workbook
2. **Header Row**: Assumes row 1 is the header row
3. **Column U Only**: Hardcoded to modify column U
4. **No Configuration**: All behavior is hardcoded
5. **File Size**: May struggle with very large files (>50MB)
6. **CORS**: May fail on URLs with restrictive CORS policies
7. **Download Manager**: May interfere with other download extensions

## References

### External Documentation
- [Chrome Extension API](https://developer.chrome.com/docs/extensions/reference/)
- [chrome.downloads API](https://developer.chrome.com/docs/extensions/reference/downloads/)
- [SheetJS Documentation](https://docs.sheetjs.com/)
- [Manifest V3 Migration](https://developer.chrome.com/docs/extensions/mv3/intro/)

### Related Projects
- [SheetJS](https://github.com/SheetJS/sheetjs) - Excel file processing
- [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples)

## License

ISC License - See package.json for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use 2 spaces for indentation
- Use single quotes for strings
- Add comments for complex logic
- Follow existing code patterns
