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




















const handleDownload = async () => {
  try {
    // =========================
    // VALIDATION
    // =========================

    if (!fromDate || !toDate) {
      alert("Please select From Date and To Date");
      return;
    }

    if (!groupIds || groupIds.length === 0) {
      alert("Please select Group");
      return;
    }

    if (!applicationIds || applicationIds.length === 0) {
      alert("Please select Application");
      return;
    }

    setLoading(true);

    // =========================
    // BUILD API QUERY
    // =========================

    const params = new URLSearchParams();

    params.set("fromDate", fromDate);
    params.set("toDate", toDate);

    // --------------------------------
    // Groups
    // --------------------------------

    const selectedGroupIds = groupIds.filter(
      (id) => id !== "__ALL_GROUPS__"
    );

    selectedGroupIds.forEach((id) => {
      params.append("groupId", String(id));
    });

    // --------------------------------
    // Applications
    // --------------------------------

    const selectedApplicationIds =
      applicationIds.filter(
        (id) => id !== "__ALL__"
      );

    selectedApplicationIds.forEach((id) => {
      params.append(
        "applicationId",
        String(id)
      );
    });

    // --------------------------------
    // Users
    // --------------------------------

    // If you have selectedUserNames state
    if (
      selectedUserNames &&
      selectedUserNames.length > 0
    ) {
      selectedUserNames.forEach((user: string) => {
        params.append("user_name", user);
      });
    } else {
      // All users
      params.set("allUsers", "true");
    }

    // =========================
    // API CALL
    // =========================

    const url =
      `http://localhost:3005/api/report?${params.toString()}`;

    console.log("Excel Report URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Report API failed: ${response.status}`
      );
    }

    const result = await response.json();

    console.log(
      "Excel report response:",
      result
    );

    if (!result.success) {
      alert(
        result.message ||
          "Unable to fetch report"
      );
      return;
    }

    // IMPORTANT:
    // Export ONLY filtered API response
    const exportRows = result.data || [];

    if (exportRows.length === 0) {
      alert(
        "No records found for the selected filters."
      );
      return;
    }

    // =========================
    // CREATE EXCEL
    // =========================

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "RL Reports";

    const worksheet =
      workbook.addWorksheet(
        "Effort Report"
      );

    // =========================
    // EXCEL COLUMNS
    // =========================

    worksheet.columns = [
      {
        header: "Effort Date",
        key: "created_at",
        width: 18,
      },
      {
        header: "Resource",
        key: "user_name",
        width: 25,
      },
      {
        header: "Group",
        key: "group_name",
        width: 25,
      },
      {
        header: "Application",
        key: "application_name",
        width: 25,
      },
      {
        header: "Activity",
        key: "activity",
        width: 30,
      },
      {
        header: "Sub Activity",
        key: "sub_activity",
        width: 30,
      },
      {
        header: "Description",
        key: "description",
        width: 40,
      },
      {
        header: "Effort Hours",
        key: "effort_hours",
        width: 18,
      },
      {
        header: "Location Type",
        key: "location_type",
        width: 20,
      },
    ];

    // =========================
    // ADD FILTERED ROWS
    // =========================

    exportRows.forEach((row: any) => {
      const effortDate = row.effort_date
        ? new Date(row.effort_date)
        : row.created_at
        ? new Date(row.created_at)
        : null;

      worksheet.addRow({
        created_at: effortDate,

        user_name:
          row.user_name || "-",

        group_name:
          row.group_name || "-",

        application_name:
          row.application_name || "-",

        activity:
          row.activity || "-",

        sub_activity:
          row.sub_activity || "-",

        description:
          row.description || "-",

        effort_hours:
          row.effort_hours || 0,

        location_type:
          row.location_type || "-",
      });
    });

    // =========================
    // DATE FORMAT
    // =========================

    worksheet
      .getColumn("created_at")
      .numFmt = "mm/dd/yyyy";

    // =========================
    // HEADER STYLE
    // =========================

    const headerRow =
      worksheet.getRow(1);

    headerRow.height = 25;

    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: {
          argb: "FFFFFFFF",
        },
        size: 11,
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF8DC63F",
        },
      };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      cell.border = {
        top: {
          style: "thin",
        },
        left: {
          style: "thin",
        },
        bottom: {
          style: "thin",
        },
        right: {
          style: "thin",
        },
      };
    });

    // =========================
    // DATA CELL STYLE
    // =========================

    worksheet.eachRow(
      (row, rowNumber) => {
        if (rowNumber === 1) return;

        row.eachCell((cell) => {
          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
          };

          cell.border = {
            top: {
              style: "thin",
            },
            left: {
              style: "thin",
            },
            bottom: {
              style: "thin",
            },
            right: {
              style: "thin",
            },
          };
        });
      }
    );

    // =========================
    // AUTO COLUMN WIDTH
    // =========================

    worksheet.columns.forEach(
      (column) => {
        let maxLength = 10;

        column.eachCell(
          {
            includeEmpty: true,
          },
          (cell) => {
            const value =
              cell.value?.toString() || "";

            maxLength = Math.max(
              maxLength,
              value.length
            );
          }
        );

        column.width = Math.min(
          maxLength + 3,
          50
        );
      }
    );

    // =========================
    // DOWNLOAD
    // =========================

    const buffer =
      await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `RL_Report_${new Date()
        .toISOString()
        .split("T")[0]}.xlsx`
    );
  } catch (error) {
    console.error(
      "Download report error:",
      error
    );

    alert(
      "Failed to download report."
    );
  } finally {
    setLoading(false);
  }
};






















const handleDownload = async () => {
  if (!rows.length) {
    alert("Please preview the report first.");
    return;
  }

  try {
    setLoading(true);

    // Build the exact same filters
    const params = new URLSearchParams();

    params.append("fromDate", fromDate);
    params.append("toDate", toDate);
    params.append("towerId", String(towerId));
    params.append("applicationId", String(applicationId));

    // If a particular user is selected
    if (selectedUserNames.length > 0) {
      params.append(
        "user_name",
        selectedUserNames[0]
      );
    }

    const url =
      `http://localhost:3005/api/report?${params.toString()}`;

    console.log("Download API:", url);

    // Fetch filtered records
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch report");
    }

    const result = await response.json();

    console.log("Download report response:", result);

    const exportRows = result.data || [];

    if (exportRows.length === 0) {
      alert("No records found for selected filters.");
      return;
    }

    // =========================
    // CREATE EXCEL
    // =========================

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "RL Reports";

    const worksheet =
      workbook.addWorksheet("Effort Report");

    worksheet.columns = [
      {
        header: "Effort Date",
        key: "created_at",
        width: 18,
      },
      {
        header: "Resources",
        key: "user_name",
        width: 25,
      },
      {
        header: "Application",
        key: "application_name",
        width: 25,
      },
      {
        header: "Activity",
        key: "activity",
        width: 25,
      },
      {
        header: "Sub Activity",
        key: "sub_activity",
        width: 25,
      },
      {
        header: "Description",
        key: "description",
        width: 40,
      },
      {
        header: "Effort Hours",
        key: "effort_hours",
        width: 18,
      },
      {
        header: "Location Type",
        key: "location_type",
        width: 20,
      },
    ];

    // =========================
    // ADD FILTERED DATA
    // =========================

    exportRows.forEach((row: any) => {
      const effortDate = new Date(
        row.effort_date || row.created_at
      );

      worksheet.addRow({
        created_at: effortDate,
        user_name: row.user_name,
        application_name:
          row.application_name,
        activity: row.activity,
        sub_activity:
          row.sub_activity,
        description: row.description,
        effort_hours:
          row.effort_hours,
        location_type:
          row.location_type,
      });
    });

    // =========================
    // DATE FORMAT
    // =========================

    worksheet
      .getColumn("created_at")
      .numFmt = "mm/dd/yyyy";

    // =========================
    // HEADER STYLE
    // =========================

    const headerRow =
      worksheet.getRow(1);

    headerRow.height = 25;

    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: {
          argb: "FFFFFFFF",
        },
        size: 11,
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF8DC63F",
        },
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

    // =========================
    // DATA STYLE
    // =========================

    worksheet.eachRow(
      (row, rowNumber) => {
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
      }
    );

    // =========================
    // AUTO WIDTH
    // =========================

    worksheet.columns.forEach(
      (column) => {
        let maxLength = 10;

        column.eachCell(
          { includeEmpty: true },
          (cell) => {
            const value =
              cell.value?.toString() || "";

            maxLength = Math.max(
              maxLength,
              value.length
            );
          }
        );

        column.width = Math.min(
          maxLength + 3,
          50
        );
      }
    );

    // =========================
    // DOWNLOAD
    // =========================

    const buffer =
      await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `RL_Report_${
        new Date()
          .toISOString()
          .split("T")[0]
      }.xlsx`
    );

  } catch (error) {
    console.error(
      "Download error:",
      error
    );

    alert("Failed to download report.");
  } finally {
    setLoading(false);
  }
};
