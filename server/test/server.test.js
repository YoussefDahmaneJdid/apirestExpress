const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
var {app} = require('./../server');

var {Todo} = require('./../models/todo');
const {todos, populateTodos , users,populateUsers} = require('./seed/seed');
const { User } = require('../models/user');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('Test POST /todo',()=>{
    it('it should create a todo',()=>{
        var text = 'Youssef from testing file'
        request(app)
        .post('/todo')
        .set('x-auth',users[0].tokens[0].token)
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
        .set('x-auth',users[0].tokens[0].token)
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

describe('test Get /users/me',()=>{
   it('should return a user if is authenticate',(done)=>{
             request(app)
             
             .get('/user/me')
             .set('x-auth',users[0].tokens[0].token)
             .expect(200)
             .expect((res)=>{
                 expect(res.body._id).toBe(users[0]._id.toHexString());
                 expect(res.body.email).toBe(users[0].email);
             }).end(done);
   })
   it('should return a 401 if is not authenticate',(done)=>{
    request(app)
    .get('/user/me')
    .expect(401)
    .expect((res)=>{
        expect(res.body).toEqual({});
       
    }).end(done);
})

 });

describe('test post /users',()=>{

    it('should create a user',(done)=>{
        var email ="ex@mil.com";
        var password = "1432049!"

        request(app)
         .post('/user')
         .send({email,password})
         .expect(200)
         .expect((res)=>{
             expect(res.body.email).toBe(email);
             expect(res.body._id).not.toBeNull();
             expect(res.headers['x-auth']).not.toBeNull();
         }).end((err)=>{
             if(err) return done(err);
             User.findOne({email}).then((user)=>{
                 expect(user).not.toBeNull();
                 expect(user.password).not.toBe(password);
                 done();

             })
         });


    })
    it('should return validation error if request is invalid a user',(done)=>{
              
              request(app)
               .post('/user')
               .send({email:'dkljfd' , passwrod:'rere'})
               .expect(400)
               .end(done);


        
    })
    it('should not create user if email in use',(done)=>{

        request(app)
        .post('/user')
        .send({email:users[0].email , passwrod:'jgkfjgkfjgfkju'})
        .expect(400)
        .end(done);
    })




});


describe('Post /user/login',()=>{
    it('should login and set token header',(done)=>{

        request(app)
         .post('/user/login')
         .send({email :users[0].email,password:users[0].password})
         .expect(200)
         .expect((res)=>{
               expect(res.headers['x-auth']).not.toBeNull;
               
               
         }).end((err,res)=>{
             if(err) return done(err);

             User.findById({_id:users[0]._id}).then((user)=>{
                expect(user.tokens[0]).toHaveProperty('acces','auth');
               // expect(user.tokens[0]).toHaveProperty('token',res.headers['x-auth']);
                done();
             }).catch((err)=>{done(err);})
         });
    });

    it('should  not  login return invalid credentials',(done)=>{

        request(app)
         .post('/user/login')
         .send({email :users[0].email,password:users[0].password+'"é'})
         .expect(400)
         .expect((res)=>{
               expect(res.headers['x-auth']).toBeUndefined();
               
               
         }).end((err,res)=>{
             if(err) return done(err);

             User.findById({_id:users[0]._id}).then((user)=>{
                expect(user.tokens.length).toBe(1);
                done();
             }).catch((err)=>{done(err);})
         });
    });
});
describe('test delete /user/token',()=>{

  it('should delete a token for user',(done)=>{
        
      request(app)
       .delete('/user/token')
       .set('x-auth' , users[0].tokens[0].token)
       .expect(200)
       .end((err,res)=>{
           if(err) return done(err);

           User.findById(users[0]._id).then((user)=>{
               expect(user.tokens.length).toBe(0);
               done();
           }).catch((err)=>{
               done(err);
           })
       })


  });




});
/*describe('test patch path',()=>{
   
    
    
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
})   */
