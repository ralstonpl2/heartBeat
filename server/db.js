var mongoose = require('mongoose');  //cross-platform embedded web servers, Single-threaded, asynchronous, non-blocking core with simple event-based API
var moment = require('moment'); //Full featured date library for parsing, validating, manipulating, and formatting dates.
var _ = require('underscore');  //utility library

//make list shorter to the following tasks on had call, coffee, texted, meal
//first name, last name, relationship, phone number to add family member.

mongoose.connect('mongodb://ralston:heart123@ds145415.mlab.com:45415/heroku_jcf6w2mv');

// mongoose.connect('mongodb://localhost:27017');    //connect to MongoDB

var db = mongoose.connection; //naming/variable chaining, convention

var exports = module.exports;

db.on('error', console.error.bind(console, 'connection error:'));  // to get notified if we connect successfully or if a connection error occurs

db.once('open', function() {              //once is a very large object that contains the 
                                          //the Schemas and Schema related   
  console.log("db connected!");

  // information about a family member
  // each family member has a contact frequency (user specified)
  // next contact date will be determined by last contact date and contact freq

  //stores a history off all interactions

//  Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.

/*
var RelationshipHistorySchema = mongoose.Schema({
  // date: Date,
    action: String,  //what was the task
    points: Number,
    // notes: String
  });

var FamilySchema = mongoose.Schema({
  firstName: String,      
  lastName: String,
    // nextContactDate: Date,      //determines order in the list
    // contactFrequency: Number,   //number of days till next task
    history:[RelationshipHistorySchema]
  });
*/

//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
var UserSchema = mongoose.Schema({
  userName: {type:String,index:{unique:true}},
  password: String,
  family:[{
  firstName: String,      
  lastName: String,
    history:[{
      action: String,  
      points: Number,
    }]
  }]
});

  //store the possible actions 
  //will be its own independent doc/collection
  var ActionSchema = mongoose.Schema({
    points: Number,
    action: String
  });

// instantiate the models

var User = mongoose.model('User', UserSchema);
var Action = mongoose.model('Action', ActionSchema);

  //task table
  db.collections['actions'].remove();
  var actions = [
  {
    action:"Called",
    points:6
  },{
    action:"Texted",
    points:3
  },{
    action:"Had coffee",
    points:8
  },{
    action:"Had lunch/dinner",
    points:10
  }
  ]
  Action.create(actions);

  //insert default data for testing purposes
  // 2 users
  // each have 5 family
  // each family has 1 - 10 tasks
  // db.collections['users'].remove();
  var user1 = {
    userName: 'G the Grey',
    password: 'DeezNuts',
    family:[{
      firstName:"frodo",
      lastName:"baggins",
      // nextContactDate: new Date(),
      // contactFrequency: 14,
      history:[
      {
        action:"Called",
        // notes:"this guy is a nn",
        points:6,
        // date: new Date("1/1/16")
      },
      {
        action:"Texted",
        // notes:"no, wait, I am a nn",
        points:3,
        // date: new Date("1/10/16")
      },
      {
        action:"Texted",
        // notes:"love emailing this guy",
        points:3,
        // date: new Date()
      }
      ]

    },{
      firstName:"bilbo the short",
      lastName:"baggins",
      // nextContactDate: new Date(),
      // contactFrequency: 7,
      history:[
      {
        action:"Texted",
        // notes:"I love ice cream",
        points:3,
        // date: new Date("12/1/15")
      },
      {
        action:"Called",
        // notes:"he does a great impression of Pee Wee Herman",
        points:6,
        // date: new Dsate()
      }
      ]
    }
    ]
  };
  
  User.create([user1]);

  //handles the different possible 'action' values
  //internal API

  var performActionOnUser = {
    "get family": function(user, callback){    // takes user object, uses callback
      return callback(null,user.family);       // to match family object property with it
    },
    "get id": function(user, callback){      //_id 
      return callback(null,user['_id']);
    },
    "get member": function(user, callback,properties,familyMember){
      return callback(null,familyMember);
    },
    "add family": function(user, callback, properties){
      user.family.push(properties);
      user.save(function(err,user){
        return callback(err,user.family[user.family.length-1]); 
      });
    },
    "update family": function(user, callback, properties, familyMember){
      if(!familyMember){
        return callback('update family: a family id must be provided',null);
      }
      _.extend(familyMember,properties);
      user.save(function(err,user){
        return callback(err,familyMember); 
      });
    },
    "add history":function(user, callback, properties, familyMember){
      if(!familyMember){
        return callback('add history: a family id must be provided',null);
      }
      //save history into model
      familyMember.history.push(properties);
      
      //update nextContactDate, if action is within 5 days of the current nextContactDate
      if(Math.abs(moment.duration(moment(properties.date).diff(familyMember.nextContactDate)).days()) < 5 ){
        familyMember.nextContactDate = moment(familyMember.nextContactDate).add(familyMember.contactFrequency,'days');
      }

      //save it!
      user.save(function(err,user){
        return callback(err,{nextContactDate: familyMember.nextContactDate, historyItem:familyMember.history[familyMember.history.length-1]}); 
      });

    },
    "delete family": function(user, callback, properties, familyMember){
     if(!familyMember){
      return callback('add history: a family id must be provided',null);
    }
    user.family = _.reject(user.family,function(user){
      return user === familyMember;
    });
    user.save(function(err,user){
      return callback(err,familyMember); 
    });
  },
  "update history": function(user, callback, properties, familyMember, historyEvent){
    if(!historyEvent){
      return callback('update history: a history id must be provided',null);
    }
    _.extend(historyEvent,properties);
    user.save(function(err,user){
      return callback(err,historyEvent); 
    });
  },
  "delete history": function(user, callback, properties, familyMember, historyEvent){
    if(!historyEvent){
      return callback('delete history: a history id must be provided',null);
    }
    familyMember.history = _.reject(familyMember.history,function(event){
      return event === historyEvent;
    });
    user.save(function(err,user){
      return callback(err,historyEvent); 
    }); 
  }
}

  //function to handle accessing a user document
  var accessUserById = function(ids,action,properties,callback){

    return User.findOne({_id:ids.userId},'family',function(err,user){

      //check for error and make sure we have a valid user
      if(err){
        return callback(err,null);
      }else if(!user){
        return callback('user _id ' + ids.userId + ' not found',null);
      }
      
      //lookup family id, if provided
      var familyMember;

      if(ids.familyId){
        familyMember = _.find(user.family,function(family){
          return family._id.toString() === ids.familyId;
        });
        if(!familyMember){
          return callback('family member _id ' + ids.familyId + ' not found',null);
        }
      }
      //lookup history id, if provided
      var historyEvent;

      if(ids.historyId && familyMember){
        historyEvent = _.find(familyMember.history,function(history){
          return history._id.toString() === ids.historyId;
        });
        if(!historyEvent){
          return callback('history _id ' + ids.historyId + ' not found',null);
        }
      }

      //ok, whew! looked up all the relevant stuff, now do the action
      performActionOnUser[action](user,callback,properties,familyMember,historyEvent);

    });

  }

//////////////////////////////////////////
//CREATE
//////////////////////////////////////////

exports.addUser = function (userObj,callback) {

    //user validation
    if(!userObj.password){
      return callback('password field required',null);
    }else if(!userObj.userName){
      return callback('userName field required',null);
    }

    var user = new User(userObj); 

    user.save(function (err, user){
      return callback(err,user);
    });
  };
  
  exports.addFamilyMember = function(idObj,familyObj,callback){
    return accessUserById(idObj,"add family",familyObj,callback);
  };

  exports.addHistory = function(idObj, historyObj, callback){
    return accessUserById(idObj,"add history",historyObj,callback);
  };
  
//////////////////////////////////////////
//READ
//////////////////////////////////////////

exports.verifyUser = function (userObj,callback) {

  User.findOne(userObj, '_id',function(err,user){
    if(!user){
      return callback('user not found', null);
    }else{
      return callback(err,user['_id']);
    }
  });
};

exports.getAllFamily = function  (idObj,callback) {
  return accessUserById(idObj,"get family",{},callback);
};
exports.getSingleFamilyMember = function  (idObj,callback) {
  return accessUserById(idObj,"get member",{},callback);
};
exports.getAllActions = function (callback){
  Action.find({},callback);
}

//////////////////////////////////////////
//UPDATE
//////////////////////////////////////////

exports.updateFamilyMember = function(idObj,familyObj,callback){
  return accessUserById(idObj,"update family",familyObj,callback);
};

exports.updateHistory = function(idObj,historyObj,callback){
  return accessUserById(idObj,"update history",historyObj,callback);
};

//////////////////////////////////////////
//DELETE
//////////////////////////////////////////

exports.deleteFamilyMember = function(idObj,callback){
  return accessUserById(idObj,"delete family",{},callback);
};

exports.deleteHistory = function(idObj,callback){
  return accessUserById(idObj,"delete history",{},callback);
};



});  // end of db.once
