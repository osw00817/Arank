
/* 수정해야할 내용
    query error 부분 수정(리펙토링)
*/
const express = require('express');
const router = express.Router();
const async = require('async');

const nav = require('../public/lib/nav.js')
const notice = require('../public/lib/notice.js');
const url = require('../public/lib/url.js').url;
const indentify = require('../public/lib/indentify.js');

const mysql = require('../public/lib/mysql.js');
const conn = mysql.create_conn();
conn.connect();

router.get('/notice', (req, res) => {

    var tasks = [
        function(callback){
            const query = `SELECT id,User_id,User_name,Title,date_format(Modidate,'%Y년 %m월 %d일') Modidate FROM arank.board LIMIT 10`;
            conn.query(query,(err,results) => {
                if(err) return callback("1: "+ err);
                if(results.length != 0) {
                    let list = notice.notice_list(results)
                    callback(null,list)
                }
            });
        },
        function(list,callback){
            console.log(list);
            if (req.session.passport !== undefined) 
            {
                console.log(list);
                const query = `select * from qualification where id = ?`
                conn.query(query,[req.session.passport.user.id],(err,results) =>{
                    if(err) return callback("2: "+ err);
                    callback(null,list,results);
                })
            }
            else
            {
                callback(null,list,"");
            }
        }];
    
        async.waterfall(tasks,function(err,list,result){
            if(err){
                console.log(err);
            }
            if(result.length !== 0){
                res.render('notice', {nav: nav.nav_source(), list: list, button: `<a href="${url}/notice/create"><button>글 쓰기</button></a>`});
            }
            else
            {
                res.render('notice', {nav: nav.nav_source(), list: list, button: "" })
            }
        })
})
 
router.get('/notice/create', (req, res) => {
   
    res.render('notice_create', { nav: nav.nav_source()})
})

router.post('/notice/create_possess', (req, res) => { 
            
   if (req.session.passport !== undefined) 
    {
        function check_true()
        {
            if(req.body.title !== null && req.body.content !== null)
            {
                const title = req.body.title;
                const content = req.body.content;
                const Username = req.session.passport.user.username;
                const User_id = req.session.passport.user.id;
                const query = "INSERT INTO `arank`.`board` (`User_id`, `User_name`, `Title`, `Content`, `Modidate`) VALUES (?,?,?,?,NOW());"
                const insert = [User_id,Username,title,content];
                console.log(insert);
                conn.query(query,insert,(err, results) =>{
                    if(err){
                       console.log(err);
                    }
                    res.redirect(`${url}/notice`);
                });
            } 
            else
            {
                console.log("err");
                res.redirect(`${url}/notice`)
            }
        }
        function check_fail()
        {
            console.log("err");
            res.redirect(`${url}/notice`)
        }
        indentify.indentify(req.session.passport.user.id,check_true,check_fail); 
    }
    else
    {
        res.redirect(`${url}/login`)
    }
})

router.get('/notice/revise/:page', (req, res) => {
    res.render('notice_cu', { nav: nav.nav_source()})
})

router.get('/notice/delete/:page', (req, res) => {
    res.render('notice_cu', { nav: nav.nav_source()})
})

router.get('/notice/:page', (req, res) => {
    //아직 개발중
    if (req.params.page !== undefined) {
        var page = req.params.page;
            const query = `select * from board where id = ?`
            conn.query(query, [page], (err, results, fields) => {
                if (err) {
                    
                }
                if(results.length !== 0)
                {
                    console.log(results);
                    console.log(results[0]);
                    function check_true(){
                        res.render('notice_read', {nav: nav.nav_source(),data:results[0]});
                    }
                    function check_fail(){
                        res.render('notice_read', {nav: nav.nav_source(),data:results[0]});
                    }
                    if (req.session.passport !== undefined) {
                        indentify.indentify(req.session.passport.user.id,check_true,check_fail); 
                    }
                    else
                    {
                        check_fail();
                    }
                }
                else
                {
                    res.redirect(`${url}/404`)
                }
            })
      
        
       
    }
    else
    {
        res.redirect(`${url}/404`)
    }
})

module.exports = router;