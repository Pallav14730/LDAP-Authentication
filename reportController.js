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












const downloadReport = async (req, res) => {
  try {

    const {
      fromDate,
      toDate,
      groupId,
      applicationId,
      allUsers
    } = req.query;

    const groupIds = groupId
      ? String(groupId)
          .split(",")
          .filter(Boolean)
          .map(Number)
      : [];

    const applicationIds = applicationId
      ? String(applicationId)
          .split(",")
          .filter(Boolean)
          .map(Number)
      : [];

    console.log("From:", fromDate);
    console.log("To:", toDate);
    console.log("Groups:", groupIds);
    console.log("Applications:", applicationIds);
    console.log("All users:", allUsers);

    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: "From date and To date are required"
      });
    }

    if (groupIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Group is required"
      });
    }

    const data = await reportModel.getReport({
      fromDate,
      toDate,
      groupIds,
      applicationIds
    });

    return res.json({
      success: true,
      data
    });

  } catch (error) {

    console.error("Report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch report"
    });
  }
};
