const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
var {app} = require('./../server');

var {Todo} = require('./../models/todo');

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        done();
    })

})
const todoss = [{
    _id: new ObjectID(),
    text: "First test todo",
   
  }, {
    _id: new ObjectID(),
    text: "Second test todo",
   
  }];
  
describe('Test POST /todo',()=>{
    it('it should create a todo',()=>{
        var text = 'Youssef from testing file'
        request(app)
        .post('/todo')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        }).end((err,res)=>{
            if(err) return done(err);

          Todo.find().then((todos)=>{
              expect(todos.length).toBe(1);
              console.log(todos[0]);
              expect(todos[0]).toBe(text);
              done();
          })
        }).catch((err)=>{
            done(err);
        })
    })


    it('it should put invalid input for  todo',()=>{
       
        request(app)
        .post('/todo')
        .send({})
        .expect(400)
        .end((err,res)=>{
            if(err) return done(err);

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(0);
                done();
            }).catch((err)=>{
                done(err);
            })
        })
    })
});


describe('test patch path',()=>{
   
    
    
    it('/path should update an item partially',(done)=>{
        var ide = todoss[0]._id.toHexString();
   
        var text ="changer from test patch";
       request(app)
       .patch(`/todo/${ide}`)
       .send({ completed: true,
        text})
       .expect(200)
       .expect((res)=>{
           expect(res.body.todo.text).toBe(text);
           expect(res.body.todo.completed).toBe(true);
           expect(typeof parseInt(res.body.completedAt)).toBe('number');
           throw new Error( res.statusCode + ', expected ' + expectedStatus + '. Reason: '  + resStr);
           
       })
       .end(done);
       
    });
})
