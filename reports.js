const express = require("express");
const ExcelJS = require("exceljs");
const router = express.Router();

const pool = require("../db");

// ======================================
// Preview Report
// ======================================

router.post("/preview", async (req, res) => {
  try {
    const {
      fromDate,
      toDate,
      tower,
      application,
      associate,
    } = req.body;

    let sql = `
      SELECT
          e.id,
          e.entry_date,
          u.user_name,
          u.tower,
          u.application,
          e.activity,
          e.sub_activity,
          e.description,
          e.effort_hours
      FROM rl_entry e
      INNER JOIN users u
      ON e.user_id = u.user_id
      WHERE
          e.entry_date BETWEEN $1 AND $2
          AND u.tower = $3
          AND u.application = $4
    `;

    const params = [
      fromDate,
      toDate,
      tower,
      application,
    ];

    if (associate && associate !== "ALL") {
      sql += ` AND u.user_id = $5`;
      params.push(associate);
    }

    sql += `
      ORDER BY
      u.user_name,
      e.entry_date
    `;

    const result = await pool.query(sql, params);

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch report",
    });
  }
});

// ======================================
// Download Excel Report
// ======================================

router.post("/download", async (req, res) => {
  try {
    const {
      fromDate,
      toDate,
      tower,
      application,
      associate,
    } = req.body;

    let sql = `
      SELECT
          e.entry_date,
          u.user_name,
          u.tower,
          u.application,
          e.activity,
          e.sub_activity,
          e.description,
          e.effort_hours
      FROM rl_entry e
      INNER JOIN users u
      ON e.user_id = u.user_id
      WHERE
          e.entry_date BETWEEN $1 AND $2
          AND u.tower = $3
          AND u.application = $4
    `;

    const params = [
      fromDate,
      toDate,
      tower,
      application,
    ];

    if (associate && associate !== "ALL") {
      sql += ` AND u.user_id = $5`;
      params.push(associate);
    }

    sql += `
      ORDER BY
      u.user_name,
      e.entry_date
    `;

    const result = await pool.query(sql, params);

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "RL Tracker";

    const worksheet = workbook.addWorksheet("RL Report");

    worksheet.mergeCells("A1:H1");

    worksheet.getCell("A1").value = "RL REPORT";

    worksheet.getCell("A1").font = {
      size: 18,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    worksheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    worksheet.getCell("A1").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "FF8DC63F",
      },
    };

    worksheet.addRow([]);

    worksheet.addRow(["Tower", tower]);
    worksheet.addRow(["Application", application]);
    worksheet.addRow(["From Date", fromDate]);
    worksheet.addRow(["To Date", toDate]);

    worksheet.addRow([]);

    const headerRow = worksheet.addRow([
      "Date",
      "Associate",
      "Tower",
      "Application",
      "Activity",
      "Sub Activity",
      "Description",
      "Hours",
    ]);

    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: {
          argb: "FFFFFFFF",
        },
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF3A8F2F",
        },
      };

      cell.alignment = {
        horizontal: "center",
      };
    });

    let totalHours = 0;

    result.rows.forEach((row) => {
      worksheet.addRow([
        row.entry_date,
        row.user_name,
        row.tower,
        row.application,
        row.activity,
        row.sub_activity,
        row.description,
        row.effort_hours,
      ]);

      totalHours += Number(row.effort_hours);
    });

    worksheet.addRow([]);

    worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "Total Hours",
      totalHours,
    ]);

    const uniqueAssociates = new Set(
      result.rows.map((row) => row.user_name)
    ).size;

    worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "Total Associates",
      uniqueAssociates,
    ]);

    worksheet.columns.forEach((column) => {
      column.width = 25;
    });

    worksheet.views = [
      {
        state: "frozen",
        ySplit: 7,
      },
    ];

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=RL_Report.xlsx`
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate report",
    });
  }
});

module.exports = router;
