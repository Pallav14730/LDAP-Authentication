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
















const getReport = async ({
  fromDate,
  toDate,
  groupIds,
  applicationIds
}) => {

  const values = [
    fromDate,
    toDate,
    groupIds
  ];

  let paramIndex = 4;

  let query = `
    SELECT
      r.rl_user_id,
      r.application_id,
      r.application_name,
      r.group_id,
      r.group_name,
      r.activity,
      r.sub_activity,
      r.description,
      r.effort_hours,
      r.created_at
    FROM resource_loading_default r
    WHERE r.created_at::date BETWEEN $1 AND $2
      AND r.group_id = ANY($3)
  `;

  // Application filter is optional
  if (applicationIds.length > 0) {
    query += `
      AND r.application_id = ANY($${paramIndex})
    `;

    values.push(applicationIds);
    paramIndex++;
  }

  query += `
    ORDER BY r.created_at DESC
  `;

  const result = await pool.query(query, values);

  return result.rows;
};
