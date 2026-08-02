exports.getReport = async (
  fromDate,
  toDate,
  towerId,
  applicationId
) => {

  const query = `
    SELECT
      effort_date,
      user_name,
      application_name,
      activity,
      sub_activity,
      description,
      effort_hours
    FROM resource_loading
    WHERE effort_date BETWEEN $1 AND $2
      AND tower_id = $3
      AND application_id = $4
    ORDER BY effort_date ASC;
  `;

  const result = await pool.query(query, [
    fromDate,
    toDate,
    towerId,
    applicationId
  ]);

  return result.rows;
};
