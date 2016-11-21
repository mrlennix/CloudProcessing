var http=require('http');

//make the request object
var request=http.request({
  'host': '45.17.253.189',
  'port': 668,
  'path': '/',
  'method': 'GET'
});

//assign callbacks
request.on('response', function(response) {
   console.log('Response status code:'+response.statusCode);

   response.on('data', function(data) {
     console.log('Body: '+data);
   });
});

request.end();

