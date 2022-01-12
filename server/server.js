const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const _ = require('lodash');

var app = express();
var port = process.env.PORT || 3000;
app.use(bodyParser.json());
//  add to do item
app.post('/todo',(req,res)=>{

 var todo = new Todo({
    text : req.body.text
 });

 todo.save().then((doc)=>{
    res.send(doc);
 }).catch((err)=>{
    res.statu(400).send(err);
 })

});

// display list item of todos
app.get('/todos',(req,res)=>{
   console.log(req.query.s);
 Todo.find().then((todos)=>{
         res.send({todos});
 }).catch((err)=>{
    res.status(400).send(err);
 })
});

app.get('/todo/:id',(req,res)=>{
   var id = req.params.id;
 
   if(!ObjectID.isValid(id)) return res.status(400).send();

   Todo.findById(id).then((todo)=>{
      if(!todo) return res.status(400).send();

      res.send(todo);
   }).catch((err)=>{
      res.status(400).send();
   })
})

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
    })
})
 
app.listen(port,()=>{
    console.log(`started on port ${port}`);
})


module.exports = {app};