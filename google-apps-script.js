/*
 SAVE REGISTRATIONS IN A GOOGLE SHEET (free)

 1. Go to sheets.google.com and create a new Sheet named "SP Sports Registrations".
 2. In the Sheet: Extensions > Apps Script. Delete the sample code and paste ALL of this file.
 3. Click Save, then Deploy > New deployment.
 4. Click the gear icon, choose "Web app".
    - Execute as: Me
    - Who has access: Anyone
 5. Click Deploy, allow permissions, then copy the "Web app URL".
 6. In src/App.jsx set:  const SHEET_URL = "PASTE_THE_URL_HERE";
 7. Save, push to GitHub. Submissions now appear as new rows in the Sheet.

 If you change this script later, use Deploy > Manage deployments > Edit > New version.
*/
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var d = JSON.parse(e.postData.contents);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Time", "Name", "Mobile", "Email", "Program", "Age", "Gender", "Batch", "Message"]);
  }
  sheet.appendRow([new Date(), d.name, d.phone, d.email, d.program, d.age, d.gender, d.batch, d.message]);
  return ContentService.createTextOutput("ok");
}
