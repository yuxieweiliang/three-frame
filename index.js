/**
 * Created by K on 2019/11/16.
 */
var express = require('express');
var app = express();
var fetch = require('isomorphic-fetch')
var router = express.Router()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  const { code } = req.query
  const host = 'https://api.weixin.qq.com/sns/oauth2/access_token'
  const appid = 'wxd1c6ba92e61629d2'
  const select = 'd0873efaee077984d65aef846b8b191d'
   console.log('--------------', )

 /* fetch(`${host}?appid=${appid}&secret=${select}&code=${code}&grant_type=authorization_code`)
      .then(res => res.json())
      .then(res => console.log(res))*/
  res.send('hello world')
});

router.get('/wxChart', function(req, res) {

})

app.use(router);
app.use(express.static('dist'));
app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});
