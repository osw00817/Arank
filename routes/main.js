const express = require('express');
const router = express.Router();
const nav = require('../public/lib/nav.js')
const notice = require('../public/lib/notice.js')
const mysql = require('../public/lib/mysql.js');
const conn = mysql.create_conn();
conn.connect();

router.get('/',(req,res) => {
    const query = `SELECT id,User_id,User_name,Title,date_format(Modidate,'%Y년 %m월 %d일') Modidate FROM arank.board LIMIT 3`
    conn.query(query, (err, results, fields) => {
        if(err){
            console.log(err);
        }
        if(results.length > 0)
        {
            let list = notice.notice_list(results);
            res.render('main',{nav:nav.nav_source(),list:list,top3:""});
        }
        else
        {
            //오류 처리 500
        }
    });
})

module.exports = router;