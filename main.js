var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control){
  return ` 
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + 
    `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  // pathname - 경로(길이라고 생각하면 편함) / path - 길을 통해 도착하는 정확한 집 주소
  if(pathname === '/'){
    if(queryData.id === undefined){

     fs.readdir('./data', function(error, filelist){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = templateList(filelist);
        var template = templateHTML(title, list,
           `<h2>${title}</h2>${description}`,
           `<a href = "/create">create</a>`
           );
        response.writeHead(200);
        response.end(template);
      });

 
      } else {

        fs.readdir('./data', function(error, filelist){
        
        fs.readFile(`./data/${queryData.id}`, 'utf8', function(err,description){
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${description}`,
          `<a href = "/create">create</a> <a href="/update1/id=${title}">update</a>`);
          response.writeHead(200);
          response.end(template);
        });
      });
      }

    } else if(pathname === '/create'){
      fs.readdir('./data', function(error, filelist){
        var title = 'WEB - create';
        var list = templateList(filelist);
        var template = templateHTML(title, list, `
        <form action = "http://localhost:3000/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="descption"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `, ' ');
        response.writeHead(200);
        response.end(template);
      });

    } else if(pathname === "/create_process"){
      var body = "";

      // function(data)라는 callback 함수를 이용해서 body라는 변수에 request data를
      // 순차적으로 받아온다.(내부적인 건 모르겠음)
      request.on('data', function(data){
        body += data;

        // 너무 많은 데이터가 들어왔을 때 자동으로 연결을 끊는 코드
        /*
        if (body.length > 1e6)
        request.connection.destroy();
        */
      });

      // 요청이 끝나게 되면 이 코드 부분이 실행이 된다.
      request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description
        console.log(title, description);
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end('success');
        });
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);