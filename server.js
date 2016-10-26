var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
var server = app.listen(5698);
console.log("App started at:",5698);

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use("/public",express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var ImageModel = require('./db.js');
app.post("/save",function(req,res){
  var currentImage = new ImageModel();
  currentImage.data = req.body.imageData;
  var hash = makeid();
  currentImage.hashString = hash; 
  currentImage.save(function(err){
    if (err) throw err;
    res.end(JSON.stringify({"url":"/view/image/"+hash}));
  })
});

app.get("/view/image/:imageId",function(req,res){
  ImageModel.findOne({ "hashString": req.params.imageId}, function (err, doc){
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html'});
    var str = "<img src='"+doc.data+"'/>";
    res.write(str);
    res.end();
  });
});