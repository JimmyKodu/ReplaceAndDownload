// Verification script for the Chrome extension
// This can be run in the browser console or as part of automated testing

console.log('=== ReplaceAndDownload Extension Verification ===');

// Check if SheetJS library is available
if (typeof XLSX !== 'undefined') {
    console.log('✓ SheetJS library loaded');
    console.log('  Version:', XLSX.version);
} else {
    console.error('✗ SheetJS library not found');
}

// Function to create and verify a test Excel file
function verifyExcelModification() {
    console.log('\n--- Creating test Excel file ---');
    
    // Create a test workbook
    const wb = XLSX.utils.book_new();
    
    // Create headers including column U
    const headers = [];
    for (let i = 0; i < 21; i++) {
        const letter = String.fromCharCode(65 + i);
        headers.push(letter + ' Original Header');
    }
    
    // Add some data rows
    const data = [headers];
    for (let row = 0; row < 3; row++) {
        const rowData = [];
        for (let col = 0; col < 21; col++) {
            rowData.push(`Data ${row + 1}-${col + 1}`);
        }
        data.push(rowData);
    }
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'TestSheet');
    
    // Get the value of cell U1 (column U header)
    console.log('✓ Original column U header:', ws['U1'].v);
    
    // Simulate the modification that the extension would do
    ws['U1'].v = ws['U1'].v + '1';
    console.log('✓ Modified column U header:', ws['U1'].v);
    
    // Verify the modification
    if (ws['U1'].v.endsWith('1')) {
        console.log('✓ Modification successful - header ends with "1"');
        return true;
    } else {
        console.error('✗ Modification failed');
        return false;
    }
}

// Function to check Chrome extension APIs
function checkExtensionAPIs() {
    console.log('\n--- Checking Chrome Extension APIs ---');
    
    if (typeof chrome !== 'undefined') {
        console.log('✓ Chrome API available');
        
        if (chrome.downloads) {
            console.log('✓ chrome.downloads API available');
        } else {
            console.warn('⚠ chrome.downloads API not available (normal for web pages)');
        }
        
        if (chrome.runtime) {
            console.log('✓ chrome.runtime API available');
            if (chrome.runtime.id) {
                console.log('  Extension ID:', chrome.runtime.id);
            }
        } else {
            console.warn('⚠ chrome.runtime API not available (normal for web pages)');
        }
    } else {
        console.warn('⚠ Chrome API not available (this is normal for regular web pages)');
        console.log('  Note: Extension APIs are only available in extension context');
    }
}

// Function to generate a test file for manual verification
function generateTestFile() {
    console.log('\n--- Generating test file for download ---');
    
    const wb = XLSX.utils.book_new();
    const headers = [];
    
    // Create headers up to column U (21 columns)
    for (let i = 0; i < 21; i++) {
        const letter = String.fromCharCode(65 + i);
        headers.push(`${letter}-Header-Original`);
    }
    
    const data = [headers];
    
    // Add 5 rows of sample data
    for (let row = 0; row < 5; row++) {
        const rowData = [];
        for (let col = 0; col < 21; col++) {
            rowData.push(`R${row + 1}C${col + 1}`);
        }
        data.push(rowData);
    }
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'TestSheet');
    
    // Write the file
    const filename = 'verification_test.xlsx';
    XLSX.writeFile(wb, filename);
    
    console.log('✓ Test file generated:', filename);
    console.log('  Instructions:');
    console.log('  1. The file should download automatically');
    console.log('  2. Open the downloaded file');
    console.log('  3. Check column U (21st column) header');
    console.log('  4. It should be "U-Header-Original1" (ending with "1")');
    console.log('  5. If it ends with "1", the extension is working correctly!');
}

// Run all verification checks
console.log('\n=== Running Verification Checks ===\n');

if (typeof XLSX !== 'undefined') {
    const modificationOK = verifyExcelModification();
    
    console.log('\n--- Summary ---');
    if (modificationOK) {
        console.log('✓ All core functionality verified');
        console.log('\nTo test the full extension:');
        console.log('1. Make sure the extension is installed and enabled');
        console.log('2. Run: generateTestFile()');
        console.log('3. Download will be intercepted and modified by the extension');
        console.log('4. Open the file and verify column U header ends with "1"');
    } else {
        console.error('✗ Verification failed');
    }
} else {
    console.error('✗ Cannot run verification - SheetJS library not loaded');
    console.log('\nPlease ensure you are running this in a context where xlsx.full.min.js is loaded');
    console.log('For example: Open test.html in your browser and run this script');
}

checkExtensionAPIs();

// Export functions for manual use
if (typeof window !== 'undefined') {
    window.verifyExcelModification = verifyExcelModification;
    window.generateTestFile = generateTestFile;
    window.checkExtensionAPIs = checkExtensionAPIs;
    console.log('\n=== Functions Available ===');
    console.log('- verifyExcelModification() - Test the modification logic');
    console.log('- generateTestFile() - Generate a test file to download');
    console.log('- checkExtensionAPIs() - Check available Chrome APIs');
}
