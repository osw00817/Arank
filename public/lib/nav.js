const url = require('./url').url;

module.exports = {
    nav_source:function(){
        return `
        <nav class="navbar sticky-top navbar-expand-lg navbar-light">
        <a class="navbar-brand" href="/" style="font-size:25px;">Arank</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <a class="nav-item nav-link active" href="${url}">랭킹 TOP10<span class="sr-only">(current)</span></a>
            <a class="nav-item nav-link" href="${url}">분기별 랭킹</a>
            <a class="nav-item nav-link" href="${url}/notice">공지사항</a>
            <a a href='${url}/login' class="nav-item nav-link" href="#">로그인/회원가입</a>
          </div>
        </div>
        <form class="form-inline">
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
        </div>
        </nav>
        `
    }
}