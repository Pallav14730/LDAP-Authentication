exports.downloadReport = async (req, res) => {
  try {

    const {
      fromDate,
      toDate,
      towerId,
      applicationId
    } = req.query;

    const data = await reportModel.getReport(
      fromDate,
      toDate,
      towerId,
      applicationId
    );

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch report"
    });
  }
};
