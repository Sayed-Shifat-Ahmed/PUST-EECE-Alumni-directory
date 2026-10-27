/* ===== SETTINGS ===================================================
   1. In Google Sheets: Share → "Anyone with the link" → Viewer.
   2. Copy the ID from the sheet URL: docs.google.com/spreadsheets/d/<SHEET_ID>/edit
   3. Paste it below. Tab names must match your sheet tabs exactly.
   ================================================================= */
const SHEET_ID  = "https://docs.google.com/spreadsheets/d/1sNenA-kyxC7WLcr6_zNaJjvhxy1NLjVJool2YtaWyx0/edit";

/* One entry per sheet tab.
   name : exact tab name (capital letters and spaces matter)
   gid  : optional. The number after "gid=" in the browser URL while that tab is open
   pub  : optional but the most reliable. File → Share → Publish to web → pick the tab →
          format "CSV" → Publish, then paste the link here. */
const TABS = {
  graduate: { name:"Graduate", gid:"416118193", pub:"https://docs.google.com/spreadsheets/d/e/2PACX-1vSGGL60yRkj6r7htlisHjDKtK6EowiZkTXoenVjaLV_MwjOTqmgJ6naxi33tz80sii1gd0mxo-TQmd4/pub?gid=416118193&single=true&output=csv" },
  current:  { name:"Current",  gid:"371574154", pub:"https://docs.google.com/spreadsheets/d/e/2PACX-1vSGGL60yRkj6r7htlisHjDKtK6EowiZkTXoenVjaLV_MwjOTqmgJ6naxi33tz80sii1gd0mxo-TQmd4/pub?gid=371574154&single=true&output=csv" }
};

/* Session rule: 9th batch = 2016-17, so start year = 2007 + batch number */
const SESSION_BASE = 2007;

/* Sample rows shown until SHEET_ID is set or if loading fails (one sample per tab) */
const SAMPLE_GRADUATE_CSV = `Batch: ,Name:,Facebook Profile Link:,Contact No.:,Designation,Workplace:,Previous Workplace: ,Email:,Blood Group:,Religion:,Upload Image:,Present Address:,Permanent Address:,District:
1,dsc,,01,as,as,,as@as.com,A-,Islam,https://drive.google.com/open?id=1jsfRkzj9mWCah7H8WVXNyEfnOoGJIC34,sa,sa,Bandarban`;
const SAMPLE_CURRENT_CSV = `Batch: ,Name:,Facebook Profile Link:,Contact No.:,Email:,Blood Group:,Religion:,Upload Image:,Present Address:,Permanent Address:,District:
12,qq,,1111,q@s.com,A-,Islam,https://drive.google.com/open?id=1twI0PamOri3vM6spVZwBLyL0B7DLThLd,qqq,qq,Barguna`;
