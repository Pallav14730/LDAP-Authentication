const handlePreview = async () => {

  if (!fromDate || !toDate) {
    alert("Please select From Date and To Date");
    return;
  }

  if (!towerId) {
    alert("Please select Tower");
    return;
  }

  if (!applicationId) {
    alert("Please select Application");
    return;
  }

  try {
    setLoading(true);

    // Build API URL
    let url = `http://localhost:3000/api/report?fromDate=${fromDate}&toDate=${toDate}&towerId=${towerId}&applicationId=${applicationId}`;

    // Add username only when a specific user is selected
    if (username && username.trim() !== "") {
      url += `&user_name=${encodeURIComponent(username)}`;
    }

    console.log("API URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch report");
    }

    const result = await response.json();

    console.log("Report Data:", result);

    setRows(result);
    setShowReport(true);

  } catch (err) {
    console.error(err);
    alert("Unable to load report");
  } finally {
    setLoading(false);
  }
};

















const handlePreview = async () => {
  if (!fromDate || !toDate) {
    alert("Please select From Date and To Date");
    return;
  }

  if (groupIds.length === 0) {
    alert("Please select Group");
    return;
  }

  try {
    setLoading(true);

    // ----------------------------------
    // GROUP IDs
    // ----------------------------------

    const selectedGroupIds =
      groupIds.length === userTowers.length
        ? userTowers.map((group: any) =>
            String(group.group_id)
          )
        : groupIds.map(String);

    // ----------------------------------
    // APPLICATION IDs
    // ----------------------------------

    const selectedApplicationIds =
      applicationIds.length > 0
        ? applicationIds.map((id: any) => String(id))
        : [];

    // ----------------------------------
    // Build URL
    // ----------------------------------

    const params = new URLSearchParams();

    params.append("fromDate", fromDate);
    params.append("toDate", toDate);

    // Send group IDs
    params.append(
      "groupId",
      selectedGroupIds.join(",")
    );

    // Send applications ONLY if selected
    if (selectedApplicationIds.length > 0) {
      params.append(
        "applicationId",
        selectedApplicationIds.join(",")
      );
    }

    // VERY IMPORTANT:
    // We want report for ALL users
    params.append("allUsers", "true");

    const url =
      `http://localhost:3005/api/report?${params.toString()}`;

    console.log("🔥 REPORT URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch report");
    }

    const result = await response.json();

    console.log("🔥 REPORT RESPONSE:", result);

    // Whatever state you use for preview
    setReportData(result.data || []);

  } catch (error) {
    console.error("❌ Error loading report:", error);
    alert("Failed to load report");
  } finally {
    setLoading(false);
  }
};


