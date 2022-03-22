const connection = require("./dbconfig");
const path = require('path');
const fs = require('fs');

// Create and seed the local database
async function readSqlFile(fileName) {
    let queries = fs.readFileSync(path.join(__dirname, fileName), { encoding: "UTF-8" }).split(";\n");
    for (let query of queries) {
        query = query.trim();
        if (query.length !== 0 && !query.match(/\/\*/)) {
            await connection.query(query, function (err, sets, fields) {
                if (err) 
                    console.log(`IMPORTING FAILED\n ${err} \n${query}`);
            });
        }
    }
    console.log(`Imported file ${fileName}`);
    return true;
}

readSqlFile('./sql/teamb015.sql')
    .then(() => readSqlFile('./sql/testing-data.sql'))
    .then(() => console.log("Database Reset Finished!"));