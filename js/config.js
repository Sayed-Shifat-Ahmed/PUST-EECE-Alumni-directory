/* ===== SETTINGS ===================================================
   1. In Google Sheets: Share → "Anyone with the link" → Viewer.
   2. Copy the ID from the sheet URL: docs.google.com/spreadsheets/d/<SHEET_ID>/edit
   3. Paste it below. Tab names must match your sheet tabs exactly.
   ================================================================= */
const SHEET_ID  = "https://docs.google.com/spreadsheets/d/1quReAJg5yTtVBPZh1xSCNcpbDXg6JKv5-odp1Mi5QLY/edit";

/* One entry per sheet tab.
   name : exact tab name (capital letters and spaces matter)
   gid  : optional. The number after "gid=" in the browser URL while that tab is open
   pub  : optional but the most reliable. File → Share → Publish to web → pick the tab →
          format "CSV" → Publish, then paste the link here. */
const TABS = {
  graduate: { name:"Graduate", gid:"2145305073", pub:"https://docs.google.com/spreadsheets/d/e/2PACX-1vRIHGynjASZJWzBjAgpEemfNlCp_RWHkhVxnj6ROw6hIT9GfvGXS2V3aXBl6-LPTOvkH3tb4oPrgFFh/pub?gid=2145305073&single=true&output=csv" },
  current:  { name:"Current",  gid:"212727409", pub:"https://docs.google.com/spreadsheets/d/e/2PACX-1vRIHGynjASZJWzBjAgpEemfNlCp_RWHkhVxnj6ROw6hIT9GfvGXS2V3aXBl6-LPTOvkH3tb4oPrgFFh/pub?gid=212727409&single=true&output=csv" }
};
