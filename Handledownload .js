const handleDownload = () => {

  if (!rows.length) {
    alert("Please preview the report first.");
    return;
  }

  // Apply username filter before download
  const exportRows = username
    ? rows.filter((row) => row.user_name === username)
    : rows;

  // Convert JSON to Excel sheet
  const worksheet = XLSX.utils.json_to_sheet(exportRows);

  // Create workbook
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Report"
  );

  // Download file
  XLSX.writeFile(
    workbook,
    "Effort_Report.xlsx"
  );
};
