module.exports = {
  getAll: function(conn, callback) {
    conn.query(`
      SELECT * 
      FROM problems`, 
      callback)
  },

  getById: function(conn, id, callback) {
    conn.query(`
    SELECT * 
    FROM problems 
    WHERE id = ${id}`, 
    callback)
  },

  create: function(conn, data, callback) {
    conn.query(
      `INSERT INTO problem 
      SET 
      name             = ${data.name}, 
      hardware         = ${data.hardware_id},
      software         = ${data.software_id},
      os               = ${data.os_id},
      last_reviewed_by = ${data.last_reviewed_by},
      employee         = ${data.employee_id},
      assigned_to      = ${data.assigned_to},
      problem_type     = ${data.problem_type},
      solved           = ${data.solved},
      closed           = ${data.closed},
      closed_on        = ${data.closed_on},
      opened_on        = ${data.opened_on}`,
      callback
    )
  },

  update: function(conn, data, id, callback) {
    conn.query(
      `UPDATE problems 
      SET 
      name             = ${data.name}, 
      hardware         = ${data.hardware_id},
      software         = ${data.software_id},
      os               = ${data.os_id},
      last_reviewed_by = ${data.last_reviewed_by},
      employee         = ${data.employee_id},
      assigned_to      = ${data.assigned_to},
      problem_type     = ${data.problem_type},
      solved           = ${data.solved},
      closed           = ${data.closed},
      closed_on        = ${data.closed_on},
      opened_on        = ${data.opened_on}`,
      callback
    )
  },

  delete: function(conn, id, callback) {
    conn.query(`
    DELETE FROM problems 
    WHERE id = ${id}`, 
    callback)
  }
}