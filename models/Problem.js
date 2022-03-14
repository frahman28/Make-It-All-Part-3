class Problem {

    get(conn, callback) {
        conn.query("SELECT * FROM problems", callback)
    }
  
    getById(conn, id, callback) {
        conn.query(`
        SELECT * 
        FROM problems
        WHERE id = ${id}`, 
        callback
      )
    }
  
    // template
    create(conn, data, callback) {
        conn.query(
        `INSERT INTO problems SET 
        name = '${data.name}'`,
        callback
      )
    },
  
    //template
    update(conn, data, id, callback) {
        conn.query(
        `UPDATE problems 
        SET 
        name = '${data.name}', 
        WHERE id = ${id}`,
        callback
      )
    }
  
    destroy(conn, id, callback) {
        conn.query(
          `DELETE 
          FROM problems 
          WHERE id = ${id}`,
          callback
        )
    }
  }

module.exports = Problem;