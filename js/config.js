/* ===== SINGLE-WORKSHEET DATA SOURCE ==============================
   Keep ALL graduates and current students in ONE worksheet named
   "Directory". Every row must have a "Current Status" value:
   Graduate or Current Student.

   Share the spreadsheet as "Anyone with the link – Viewer".
   ================================================================= */
const SHEET_ID = "https://docs.google.com/spreadsheets/d/1Bu3DcxOt2G2HuRRutWxgmkWC68BhBAHQYG4lkRh0XKc/edit";
const DIRECTORY_SHEET = "Directory";
// Batch 9 corresponds to the 2016-17 session, as defined by the original project.
const SESSION_BASE = 2007;
const DIRECTORY_GID = ""; // Optional: worksheet gid.
const DIRECTORY_CSV_URL = ""; // Optional: published CSV URL for Directory.
