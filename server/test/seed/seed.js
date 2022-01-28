
const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const { models } = require('mongoose');
const userOneID = new ObjectId();
const userTwoID = new ObjectId();


const users = [{
    _id: userOneID,
    email: "userOne@gmail.com",
    password:'userOnePassword',
    tokens : [{
        acces:'auth',
        token : jwt.sign({_id:userOneID , acces:'auth'},process.env.JWT_SECRET).toString()

    }]
   }, {
    _id: userTwoID,
    email: "usertwo@gmail.com",
    password:'userTwoPassword',
    tokens : [{
        acces:'auth',
        token : jwt.sign({_id:userTwoID , acces:'auth'},process.env.JWT_SECRET).toString()
    } ]
   
  }];

const todos = [{
    _id: new ObjectId(),
    text: "First test todo",
    _creator:userOneID
   
  }, {
    _id: new ObjectId(),
    text: "Second test todo",
    _creator:userTwoID
   
  }];
  
  var populateTodos = (done) => {
    Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
    }).then(() => done());
  };

  var populateUsers =  (done) => {
    User.remove({}).then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();

     return Promise.all([userOne,userTwo]);
     

    }).then(() => done()).catch(done);
  };
  module.exports = {
      todos,
      populateTodos,
      users,
      populateUsers
  }