const pool = require("../config/db");

exports.getReport = async (fromDate, toDate) => {
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
    ORDER BY effort_date ASC, user_name ASC;
  `;

  const result = await pool.query(query, [fromDate, toDate]);

  return result.rows;
};
