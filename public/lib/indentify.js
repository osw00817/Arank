const mysql = require('./mysql.js');
const conn = mysql.create_conn();
conn.connect();

module.exports = {
    indentify:function(id,a,b){
        const query = `select * from qualification where id = ?`
        console.log(id)
        conn.query(query, [id], (err, results, fields) => {
            if (err) {
                return err;
            }
            console.log(results);
            if (results.length !== 0) {
                a();
            }
            else
            {
                b();
            }
        });
    }
}