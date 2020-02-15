const url = require('./url.js').url;

module.exports = {
    notice_list:function(results){
        let list = `
        <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
        </tr>
        </thead>`;
        for(let i =0;i<results.length;i++)
        {
            let article_info = results[i];
            list += `
            <tbody>
            <tr>
                <td>${article_info.id}</td>
                <td><a href="${url}/notice/${article_info.id}">${article_info.Title}</a></td>
                <td>${article_info.User_name}</td>
                <td>${article_info.Modidate}</td>
            </tr>
            </tbody>
            `
        }
        return list;;
    }
}