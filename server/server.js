require('./config/config');
const fs = require('fs');
var XLSX = require('xlsx')

const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const _ = require('lodash');
const express = require('express');
const { map } = require('lodash');
const { authenticate } = require('./middleware/authenticate');

var app = express();
var port = process.env.PORT || 3000;
app.use(bodyParser.json());
//  add to do item
app.post('/todo',authenticate,(req,res)=>{

 var todo = new Todo({
    text : req.body.text,
    _creator : req.user._id
 });

 todo.save().then((doc)=>{
    res.send(doc);
 }).catch((err)=>{
    res.statu(400).send(err);
 });

});

// display list item of todos
app.get('/todos',authenticate,(req,res)=>{
   console.log(req.query.s);
 Todo.find({_creator:req.user._id}).then((todos)=>{
         res.send({todos});
 }).catch((err)=>{
    res.status(400).send(err);
 })
});

app.get('/todo/:id',(req,res)=>{
   var id = req.params.id;
 
   if(!ObjectID.isValid(id)) return res.status(400).send();

   Todo.findOne({_id:id,_creator:req.user._id}).then((todo)=>{
      if(!todo) return res.status(400).send();

      res.send(todo);
   }).catch((err)=>{
      res.status(400).send();
   })
});

app.patch('/todo/:id',(req,res)=>{
   var id  = req.params.id;
   var body = _.pick(req.body,['text','completed']);
  // console.log(req.body);
  // body.text = req.body.text;
   body.completedAt = new Date().getTime();
   console.log(body);
   Todo.findOneAndUpdate({_id: id}, {$set: body}, {new: true}).then((todo) => {
      if(!todo) return res.status(404).send();
  
      res.send({todo});
    }).catch((err) => {
      res.status(400).send();
    });
});


app.post('/user',(req,res)=>{

   var body = _.pick(req.body,['email','password']);
   var user = new User(body);
   console.log('jkrejrkes');
   user.save().then(()=>{
    // console.log(user.generateAuthToken());
    //  console.log('jkrejrke');
      return user.generateAuthToken();

   }).then((token)=>{
      res.header('x-auth',token).send(user);
   }).catch((err)=>{
      console.log(err);
      res.status(400).send(err)
   })

})


app.get('/user/me',authenticate,(req,res)=>{
   res.send(req.user);

});


app.post('/user/login',(req,res)=>{

  var body = _.pick(req.body,['email','password']);

  User.findByCredentials(body.email,body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
       res.header('x-auth',token).send(user);
    });

  }).catch((err)=>{
     console.log(err);
     res.status(400).send(err);
  });
});


app.delete('/user/token',authenticate,(req,res)=>{

  req.user.removeToken(req.token).then(()=>{
          res.status(200).send();
  }).catch((err)=>{
         res.status(400).send(err);
  })
});

app.listen(port,()=>{
  console.log(`started on port ${port}`);
})
module.exports = {app};
