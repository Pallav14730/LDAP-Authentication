const handleDownload = async () => {
  if (!rows.length) {
    alert("Please preview the report first.");
    return;
  }

  // If "All Users" is selected (username = ""), export all rows.
  // Otherwise export only the selected user's rows.
  const exportRows = username
    ? rows.filter((row: any) => row.user_name === username)
    : rows;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "RL Reports";

  const worksheet = workbook.addWorksheet("Effort Report");

  // Define columns
  worksheet.columns = [
    { header: "Effort Date", key: "effort_date", width: 18 },
    { header: "User Name", key: "user_name", width: 25 },
    { header: "Application", key: "application_name", width: 25 },
    { header: "Activity", key: "activity", width: 25 },
    { header: "Sub Activity", key: "sub_activity", width: 25 },
    { header: "Description", key: "description", width: 40 },
    { header: "Effort Hours", key: "effort_hours", width: 15 },
  ];

  // Add data
  exportRows.forEach((row: any) => {
    worksheet.addRow({
      effort_date: row.effort_date,
      user_name: row.user_name,
      application_name: row.application_name,
      activity: row.activity,
      sub_activity: row.sub_activity,
      description: row.description,
      effort_hours: row.effort_hours,
    });
  });

  // Header styling
  const headerRow = worksheet.getRow(1);

  headerRow.height = 24;

  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 11,
    };

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF8DC63F" }, // Green theme
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Style all data cells
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    row.eachCell((cell) => {
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // Auto-size columns
  worksheet.columns.forEach((column) => {
    let maxLength = 10;

    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const value = cell.value ? cell.value.toString() : "";
      maxLength = Math.max(maxLength, value.length);
    });

    column.width = Math.min(maxLength + 3, 50);
  });

  // Generate file
  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `Effort_Report_${new Date().toISOString().split("T")[0]}.xlsx`
  );
};
