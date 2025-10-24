// Import the xlsx library
importScripts('xlsx.full.min.js');

// Track downloads that we've already processed to avoid infinite loops
const processedDownloads = new Set();

// Listen for download events
chrome.downloads.onCreated.addListener((downloadItem) => {
  // Check if this is an XLS or XLSX file
  if (!downloadItem.filename) return;
  
  const filename = downloadItem.filename.toLowerCase();
  if (!filename.endsWith('.xls') && !filename.endsWith('.xlsx')) {
    return;
  }
  
  // Check if we've already processed this download
  if (processedDownloads.has(downloadItem.id)) {
    return;
  }
  
  console.log('Intercepting Excel file download:', downloadItem.filename);
  
  // Cancel the original download
  chrome.downloads.cancel(downloadItem.id, () => {
    // Fetch the file
    fetch(downloadItem.url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        // Parse the Excel file
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Column U is the 21st column (index 20 in 0-based, U in Excel notation)
        const columnU = 'U';
        const headerCell = columnU + '1'; // U1 is the header cell
        
        // Get the current value of the header cell
        if (worksheet[headerCell]) {
          const currentValue = worksheet[headerCell].v || '';
          // Add "1" to the end of the header
          worksheet[headerCell].v = currentValue + '1';
          console.log('Modified header in column U:', worksheet[headerCell].v);
        } else {
          // If the cell doesn't exist, create it with "1"
          worksheet[headerCell] = { t: 's', v: '1' };
          console.log('Created header in column U with value: 1');
        }
        
        // Convert back to binary
        const modifiedArrayBuffer = XLSX.write(workbook, {
          type: 'array',
          bookType: filename.endsWith('.xlsx') ? 'xlsx' : 'xls'
        });
        
        // Create a blob from the modified data
        const blob = new Blob([modifiedArrayBuffer], {
          type: filename.endsWith('.xlsx') 
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'application/vnd.ms-excel'
        });
        
        // Create a data URL
        const reader = new FileReader();
        reader.onload = function() {
          const dataUrl = reader.result;
          
          // Trigger the download with the modified file
          chrome.downloads.download({
            url: dataUrl,
            filename: downloadItem.filename,
            saveAs: downloadItem.saveAs
          }, (newDownloadId) => {
            if (newDownloadId) {
              // Mark this download as processed
              processedDownloads.add(newDownloadId);
              console.log('Successfully downloaded modified file with ID:', newDownloadId);
              
              // Clean up after some time to prevent memory leaks
              setTimeout(() => {
                processedDownloads.delete(newDownloadId);
              }, 60000); // Clean up after 1 minute
            }
          });
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        console.error('Error processing Excel file:', error);
        // If there's an error, allow the original download to proceed
        chrome.downloads.resume(downloadItem.id);
      });
  });
});

console.log('Replace and Download XLS extension loaded');
