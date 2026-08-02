const reportModel = require("../models/reportModel");

exports.downloadReport = async (req, res) => {
  try {
    const { fromDate, toDate, tower, application } = req.query;

    const data = await reportModel.getReport(
      fromDate,
      toDate,
      tower,
      application
    );

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch report" });
  }
};
