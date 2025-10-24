# ReplaceAndDownload

Chrome extension to intercept .xls/.xlsx file downloads, modify column U (21st column) header by appending "1", and re-download the modified file.

## 🚀 Quick Start

Get started in 5 minutes! See [QUICKSTART.md](QUICKSTART.md)

## Features

- ✅ Automatically intercepts .xls and .xlsx file downloads
- ✅ Modifies the header in column U (21st column) by appending "1" to the existing text
- ✅ Re-downloads the modified file with the same filename
- ✅ Works with all websites
- ✅ No data sent to external servers - all processing is local

## Example

**Before:**
```
Column U: "Sales Data"
```

**After:**
```
Column U: "Sales Data1"
```

## Installation

See [INSTALL.md](INSTALL.md) for detailed installation instructions.

**Quick Install:**
1. Clone this repository
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select this folder

## Usage

See [USAGE.md](USAGE.md) for detailed usage instructions and examples.

**Quick Usage:**
1. Install the extension
2. Download any .xls or .xlsx file
3. Extension automatically modifies column U header
4. Open the file to see the modification

## Testing

Use the included `test.html` file:
1. Open `test.html` in Chrome
2. Click "Download Test XLSX File"
3. Open the downloaded file
4. Verify column U header ends with "1"

## Documentation

- 📘 [QUICKSTART.md](QUICKSTART.md) - Get started in 5 minutes
- 📗 [INSTALL.md](INSTALL.md) - Detailed installation guide
- 📙 [USAGE.md](USAGE.md) - Usage examples and troubleshooting
- 📕 [TECHNICAL.md](TECHNICAL.md) - Technical architecture and development guide

## Project Structure

```
ReplaceAndDownload/
├── manifest.json         # Extension configuration
├── background.js         # Main logic (service worker)
├── xlsx.full.min.js      # SheetJS library
├── icon*.png            # Extension icons
├── test.html            # Testing page
├── verify.js            # Verification script
├── package.sh           # Build script
└── *.md                 # Documentation files
```

## Requirements

- Chrome 88+ (Manifest V3 support)
- SheetJS library (included)

## Building

Create a distribution package:
```bash
./package.sh
```

This creates `ReplaceAndDownload-v1.0.zip` ready for distribution.

## Development

1. Make changes to source files
2. Go to `chrome://extensions/`
3. Click refresh icon on extension card
4. Test by downloading an .xls/.xlsx file

See [TECHNICAL.md](TECHNICAL.md) for detailed development information.

## Troubleshooting

**Extension not working?**
- Verify it's enabled in `chrome://extensions/`
- Check Service Worker console for errors
- Test with `test.html` file first

See [USAGE.md](USAGE.md) for more troubleshooting tips.

## License

ISC

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

- 📖 Check the documentation files
- 🐛 Open an issue on GitHub
- 💬 Review [TECHNICAL.md](TECHNICAL.md) for architecture details