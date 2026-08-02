const pool = require("../config/db");

exports.getReport = async (fromDate, toDate, towerName, applicationName) => {
  const query = `
    SELECT
      r.rl_user_id,
      r.id,
      r.location_type,
      r.application_id,
      r.application_name,
      r.activity,
      r.sub_activity,
      r.description,
      r.effort_hours,
      r.tower_id,
      r.tower_name,
      r.group_id,
      r.group_name,
      r.created_date
    FROM resource_loading_default r
    WHERE r.created_date BETWEEN $1 AND $2
      AND r.tower_name = $3
      AND r.application_name = $4
    ORDER BY r.created_date;
  `;

  const result = await pool.query(query, [
    fromDate,
    toDate,
    towerName,
    applicationName,
  ]);

  return result.rows;
};
