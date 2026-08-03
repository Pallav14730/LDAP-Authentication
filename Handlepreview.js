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
