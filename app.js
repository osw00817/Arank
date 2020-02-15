const express = require('express');
const app = express();
const path = require('path');
const url = require('./public/lib/url').url;

//poassport 관련
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const session = require('express-session');
const KakaoKey = {
    clientID : "1964bc083298410f7d664f175e04926a",
    clientSecret : "",
    callbackURL : `${url}/login/kakao`
}

//database 관련
/*const mysql = require('mysql');
const config = require('./config').datebase;
const conn = mysql.createConnection({
        host    : config.host,
        user    : config.user,
        password: config.password,
        database: config.database
    }
)*/
const conn = require('./public/lib/mysql').create_conn();
conn.connect();
const crypto = require('crypto'); //암호화 모듈

//라우터
const Login = require('./routes/Login.js');
const notice = require('./routes/notice.js')
const main = require('./routes/main.js')


/*
    npm 설치 목록
        -express
        -express-session
        -passport
        -passport-kakao
        -sha256(암호화 모듈)
        -mysql
        -ejs
        -body-parser
        -async
*/



const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extends:true}));
app.use(bodyparser.json());


//view 엔진 설정(ejs)
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//외부 파일 사용
app.use(express.static(__dirname + "/public"));

//session 사용
app.use(session({
    secret:'Arank',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new KakaoStrategy(KakaoKey,(accessToken, refreshToken, profile, done) => {

    //db(id,username,password)
    console.log(profile);     
    const NewUser_id = profile.id;
    const NewUser_passwrod = crypto.createHash('sha512').update(profile.id.toString()).digest('hex');;
    const NewUser_nickname = profile.username;
    const sql = "select * from ka_login where id = ?";
    const post = [NewUser_id];
    console.log(post);
    conn.query(sql,post,(err,results,fields) =>
    {
        if(err) {
            console.log(err);
            done(err);
        }
        if(results.length == 0) {
            //가입이 안되있으면 회원가입
            const sql = "insert ka_login(id,username,password) values(?,?,?)";
            const post = [NewUser_id,NewUser_nickname,NewUser_passwrod];
            conn.query(sql,post,(err,results,fields) => {
                if(err){
                    console.log(err);
                    done(err);
                }
                 //가입이 되었다면 바로 로그인
                const sql = "select * from ka_login where id=?";
                const post = [NewUser_id];
                conn.query(sql,post,(err,results,fields) =>
                {
                    if(err){
                        console.log(err);
                        done(err);
                    }
                    const user = results[0];
                    return done(null,user);
                })
            })
        }
        else
        {
            //예전에 가입했으면 바로 로그인
            const user = results[0];
            return done(null,user);
        }
    });

}))

passport.serializeUser(function(user,done){
    console.log("로그인 성공")
    done(null,user);
})
passport.deserializeUser(function(user,done){
    console.log("로그인 확인")
    done(null,user);
})


//Login
app.get('/login',Login)
app.get('/login/kakao',passport.authenticate("kakao",{
    failureRedirect: `${url}/login`,
    successRedirect: `${url}`
}));

//main
app.get("/",main)

//notice
app.get("/notice",notice);
app.get("/notice/:page",notice);
app.get("/notice/create",notice);
app.post("/notice/create_possess",notice);
app.get("/notice/revise/:page",notice);
app.get("/notice/delete/:page",notice);


app.use(function(req, res, next) {
    res.status(404).render('404');
});


app.listen(3000,() => console.log(`start at ${url}3000`));




    