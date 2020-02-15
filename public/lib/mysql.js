module.exports = {
    create_conn:function(){
    const mysql = require('mysql');
    const config = require('././../../config').datebase;
    const conn = mysql.createConnection({
        host    : config.host,
        user    : config.user,
        password: config.password,
        database: config.database
    })
    return conn;
}};