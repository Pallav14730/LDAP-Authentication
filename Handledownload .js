const handleDownload = async () => {

  if (!rows.length) {
    alert("Please preview the report first.");
    return;
  }

  // Export only the selected user's rows.
  // If username is empty (All Users), export everything.
  const exportRows = username
    ? rows.filter((row: any) => row.user_name === username)
    : rows;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Effort Report");

  // Header row
  worksheet.columns = [
    { header: "Effort Date", key: "effort_date", width: 15 },
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

  // Make header bold
  worksheet.getRow(1).font = {
    bold: true,
  };

  // Generate and download file
  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer]),
    "Effort_Report.xlsx"
  );
};
