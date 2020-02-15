var express = require('express');
var router = express.Router();

router.get('/login', (req, res) => {
    if (req.session.passport) {
        res.render('Login', {
            Login: ` <h2>이미 로그인 되어있습니다.</h2>
        <span id="timer">
            <script type="text/javascript">countDown();</script>
        </span>`});
    }
    else {
        res.render('Login', { Login: `<a href="/Login/kakao"><img src="https://developers.kakao.com/assets/img/about/logos/kakaologin/kr/kakao_account_login_btn_medium_wide.png"></a>` })
    }

})

module.exports = router;