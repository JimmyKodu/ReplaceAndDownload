# Quick Start Guide

Get the ReplaceAndDownload extension running in 5 minutes!

## Step 1: Get the Code

```bash
# Clone the repository
git clone <repository-url>
cd ReplaceAndDownload
```

Or download the ZIP and extract it.

## Step 2: Load Extension

1. Open Chrome
2. Go to `chrome://extensions/`
3. Toggle "Developer mode" ON (top-right)
4. Click "Load unpacked"
5. Select the `ReplaceAndDownload` folder

✅ Extension is now installed!

## Step 3: Test It

### Quick Test with Test Page

1. Open `test.html` in Chrome (double-click or drag to browser)
2. Click "Download Test XLSX File"
3. File downloads automatically
4. Open the downloaded file
5. Check column U (21st column) - header should end with "1" ✨

### Test with Real Files

Download any .xls or .xlsx file from the internet - the extension will automatically:
- Intercept the download
- Add "1" to column U header
- Save the modified file

## What It Does

**Before:**
```
Column U Header: "Sales Data"
```

**After:**
```
Column U Header: "Sales Data1"
```

## Troubleshooting

**Extension not working?**
- Check it's enabled in `chrome://extensions/`
- Click the refresh icon on the extension card
- Try the test.html file first

**Not seeing the modification?**
- Make sure the file has at least 21 columns
- Check column U (21st column from the left)
- Look in row 1 (the header row)

## Next Steps

- 📖 Read [USAGE.md](USAGE.md) for detailed usage examples
- 🔧 Read [TECHNICAL.md](TECHNICAL.md) to understand how it works
- 📦 Run `./package.sh` to create a distribution package

## Need Help?

1. Check the Service Worker console (click "Service worker" in extension details)
2. Look for error messages
3. Open an issue on GitHub

---

**That's it! You're ready to use ReplaceAndDownload!** 🎉
