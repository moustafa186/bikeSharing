var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());



app.get('/get_val',function(req, res){
    // console.log(req.body)
    fs.readFile('./bikes.json', {encoding: 'utf-8'}, function(err,data){
	    if (!err) {
	        console.log('received data: ' + data);
	    } else {
	        console.log(err);
	    }
	    res.json({data:data});
	});
      
})

app.get('/set', function(req, res){
    console.log(req.query)
    values = req.query
    json = JSON.stringify(values);
    fs.writeFile("./bikes.json", json, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!");
	}); 
    res.json({data:values});
});

// app.post('/set', function(req, res){
//     console.log(req.body)
//     intense = parseInt(req.body.val)
//     res.json({Brightness:intense});
// });

app.listen(4000, function () {
	console.log('app running on port 4000')
})

var app = express();

