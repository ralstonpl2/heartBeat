var express = require('express');   //Creates an Express application. The express() function is a top-level function exported by the express module.
var db = require('./db.js'); //requiring schema and db config
var morgan = require('morgan'); //Create a new morgan logger middleware function using the given format and options. Used for automated logging of requests, responses and related data. When added as a middleware to an express/connect app, by default it should log statements to stdout showing details of: remote ip, request method, http version, response status, user agent etc.
var bodyParser = require('body-parser'); //Parse incoming request bodies in a middleware before your handlers, availabe under the req.body property.
var port = process.env.PORT || 3000;
var app = express(); //
app.use(morgan('combined'))  //The combined option tells Morgan to log in the standard Apache combined log format: :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
app.use(express.static(__dirname + '/../client'));  //serve files in client
app.use(bodyParser.json())  // parse application/json
//function to configure the standard response handler, added onto each post/get request
var configHandler = function(successCode,failCode,res){
  return function(err,data){
    if(err){
      res.status(failCode).send(err);
    }else{
      res.status(successCode).send(data);
    }
  }
}
app.get('/', function (req, res) {   //app.get(), on the other hand, is part of Express' application routing and is intended for matching and handling a specific route when requested with the GET HTTP verb:
  res.send('Got the new server running yall!');
});
//SERVER SETUP AS A STANDARD CRUD CAPABILITIES AND LAIDOUT AS FOLLOWS: Create, Read, Update, Delete
//////////////////////////////////////////
//CREATE
//////////////////////////////////////////
//important keep
//save a user to DB - post to the database using the addUser function, passing 201/400/res to configHandler as callback along with req.body;
app.post('/api/user', function (req, res, next){
  db.addUser(req.body, configHandler(201,400,res));
})
//add new family member to user, req.params contains route parameters (in the path portion of the URL)
.post('/api/family/:userId',function (req,res,next){
  db.addFamilyMember(req.params, req.body, configHandler(201,400,res));
})
//add new history to user's family member
.post('/api/history/:userId/:familyId',function(req,res,next){
  db.addHistory(req.params, req.body, configHandler(201,400,res));
})
//////////////////////////////////////////
//READ
//////////////////////////////////////////
//important keep, all are chained along the prior object.
// find a user
.get('/api/user/:userName/:password', function (req, res, next){
  db.verifyUser(req.params, configHandler(200,404,res));
})
//get all family info for a user
.get('/api/family/:userId',function(req,res,next){
  db.getAllFamily(req.params, configHandler(200,400,res));
})
//get a single family member
.get('/api/family/:userId/:familyId',function(req,res,next){
  db.getSingleFamilyMember(req.params, configHandler(200,400,res));
})
//get all actions
.get('/api/actions',function(req,res,next){
  db.getAllActions(configHandler(200,400,res));
})
//////////////////////////////////////////
//UPDATE
//////////////////////////////////////////
//discuss with group if we need to keep
//update family member
.put('/api/family/:userId/:familyId',function (req,res,next){
  db.updateFamilyMember(req.params, req.body, configHandler(201,400,res));
})
//update history member
.put('/api/history/:userId/:familyId/:historyId',function (req,res,next){
  db.updateHistory(req.params, req.body, configHandler(201,400,res));
})
//////////////////////////////////////////
//DELETE
//////////////////////////////////////////
//delete family member
.delete('/api/family/:userId/:familyId',function (req,res,next){
  db.deleteFamilyMember(req.params, configHandler(201,400,res));
})
//delete history
.delete('/api/history/:userId/:familyId/:historyId',function (req,res,next){
  db.deleteHistory(req.params, configHandler(201,400,res));
});
  exports.addFamilyMember = function(idObj,familyObj,callback){
    return accessUserById(idObj,"add family",familyObj,callback);
  };
  exports.addHistory = function(idObj, historyObj, callback){
    return accessUserById(idObj,"add history", historyObj, callback);
  };
app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});
// (node:7161) DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
//
