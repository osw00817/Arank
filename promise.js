const nav = require('../public/lib/nav.js')
const notice = require('../public/lib/notice.js');
const url = require('../public/lib/url.js').url;
const async = require('async');
//const indentify = require('../public/lib/indentify.js');

const mysql = require('./public/lib/mysql.js');
const conn = mysql.create_conn();
conn.connect();


var tasks = [
    function(callback){
        const query = `SELECT id,User_id,User_name,Title,date_format(Modidate,'%Y년 %m월 %d일') Modidate FROM arank.board LIMIT 10`;
        conn.query(query,(err,results) => {
            if(err) return callback(err);
            if(results.length != 0) {
                let list = notice.notice_list(results)
                callback(list,null)
            }
        })
    },
    function(list,callback){
        if (req.session.passport !== undefined) 
        {
            const query = `select * from qualification where id = ?`
            conn.query(query,[req.session.passport.user.id],(err,results) =>{
                if(err) return callback(err);
                callback(null,list,results);
            })
        }
    }];

    async.waterfall(tasks,function(err,list,result){
        if(result.length !== 0){

        }
        else
        {
            
        }
    })

const query = `SELECT id,User_id,User_name,Title,date_format(Modidate,'%Y년 %m월 %d일') Modidate FROM arank.board LIMIT 10`
conn.query(query, (err, results, fields) => {
    if (err) {
        console.log(err);
    }
    let list = notice.notice_list(results); 
    if (req.session.passport !== undefined) {
        console.log(req.session.passport.user)
        const query = `select * from qualification where id = ?`
        conn.query(query, [req.session.passport.user.id], (err, results, fields) => {
            if (err) {
                console.log(err)
            }
            //관리자 명단을 가져와 관리자 명단에 있는 id와 로그인된 id가 일치한다면 글쓰기 버튼을 반환
            if (results.length !== 0) {
                res.render('notice', {nav: nav.nav_source(), list: list, button: `<a href="${url}/create"><button>글 쓰기</button></a>` })
            }
            else {
                res.render('notice', {nav: nav.nav_source(), list: list, button: "" })
            }
        });
        /*function check_true(){
            res.render('notice', {nav: nav.nav_source(), list: list, button: `<a href="${url}/notice/create"><button>글 쓰기</button></a>`});
        }
        function check_fail(){
            //관리자가 아닐시
            res.redirect(`${url}/notice`)
        }
        indentify.indentify(req.session.passport.user.id,check_true, check_fail);*/
    }  
    else {
        //로그인 되어있지 않을시 그냥 반환
        res.render('notice', {nav: nav.nav_source(), list: list, button: "" })
    }
});