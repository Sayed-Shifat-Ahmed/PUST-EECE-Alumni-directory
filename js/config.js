/* ===== SETTINGS ===================================================
   1. In Google Sheets: Share → "Anyone with the link" → Viewer.
   2. Copy the ID from the sheet URL: docs.google.com/spreadsheets/d/<SHEET_ID>/edit
   3. Paste it below. Tab names must match your sheet tabs exactly.
   ================================================================= */
const SHEET_ID  = "https://docs.google.com/spreadsheets/d/1zGPkdftoGNohHy_TXLrcc3I2ehRI6pGtBOCvrdFP8YY/edit";

/* One entry per sheet tab.
   name : exact tab name (capital letters and spaces matter)
   gid  : optional. The number after "gid=" in the browser URL while that tab is open
   pub  : optional but the most reliable. File → Share → Publish to web → pick the tab →
          format "CSV" → Publish, then paste the link here. */
const TABS = {
  graduate: { name:"Graduate", gid:"56948578", pub:"https://docs.google.com/spreadsheets/d/e/2PACX-1vTURgYLGQupu55bDJLVRAqOJYpaceMqy920GzYkhJc4pVaJG_Gne783qYN2VSP1z_KCODVG39eSDSO6/pub?gid=56948578&single=true&output=csv" },
  current:  { name:"Current",  gid:"842300584", pub:"https://docs.google.com/spreadsheets/d/e/2PACX-1vTURgYLGQupu55bDJLVRAqOJYpaceMqy920GzYkhJc4pVaJG_Gne783qYN2VSP1z_KCODVG39eSDSO6/pub?gid=842300584&single=true&output=csv" }
};
