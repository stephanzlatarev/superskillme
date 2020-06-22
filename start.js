const express = require('express');
const app = express();

var port = process.env.PORT ? process.env.PORT : 80;

app.set('port', port);
app.listen(port, function() {
  console.log('Server starts on port ' + port)
});
app.get('*', (req, res) => {
  var path = req.params['0'];
  if (path === '/') {
    res.sendFile(__dirname + '/docs/index.html');
  } else {
    res.sendFile(__dirname + '/docs/' + path);
  }
})
