# ReplaceAndDownload

Chrome extension to intercept .xls/.xlsx file downloads, modify column U (21st column) header by appending "1", and re-download the modified file.

## Features

- Automatically intercepts .xls and .xlsx file downloads
- Modifies the header in column U (21st column) by appending "1" to the existing text
- Re-downloads the modified file with the same filename

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the directory containing this extension

## Usage

Once installed, the extension will automatically intercept all .xls and .xlsx file downloads. When you download an Excel file:

1. The original download will be cancelled
2. The file will be fetched and parsed
3. The header in column U (cell U1) will be modified by appending "1"
4. The modified file will be downloaded automatically

## Files

- `manifest.json` - Extension configuration
- `background.js` - Service worker that handles download interception and file modification
- `xlsx.full.min.js` - SheetJS library for parsing and writing Excel files
- `icon*.png` - Extension icons

## Requirements

- Chrome browser (Manifest V3 compatible)
- SheetJS library (included)

## Development

To modify the extension:

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test by downloading an .xls or .xlsx file

## License

ISC