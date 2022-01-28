var mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const saltRounds = 10;



var UserSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        minlength: 4,
        trim: true,
        unique:true,
        validate:{
            validator : function (value){
                return validator.isEmail(value);
            } ,
            message : '{VALUE} is not a valid email.'
        }
      },
      password : {
          type:String,
          required : true,
      },
      tokens : [{
          acces:{
              type:String,
              required : true,
          },
          token : {
            type:String,
            required : true,
          }
      }]
});


UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
  
    return _.pick(userObject, ['_id', 'email']);
  }

UserSchema.methods.generateAuthToken = async function   (){
    var user = this;
    var acces = 'Auth';
    console.log('ttt');
    var token = await jwt.sign({_id:user._id.toHexString(), acces},process.env.JWT_SECRET).toString();
    user.tokens= user.tokens.concat([{acces,token}]);
    console.log(token);
    return user.save().then(()=> {
             return token;
    });

}


UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;
  
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return Promise.reject();
    }
  
    return User.findOne({
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
  
  };

UserSchema.statics.findByCredentials = function(email,password){
    var User = this;

   return User.findOne({email:email}).then((user)=>{
        if (!user) return Promise.reject();

        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(err,res)=>{
                if(res) return resolve(user);

                else return reject();
            });

        });
    });
};

UserSchema.methods.removeToken = function(token){

    var user = this;

  return  user.update({
        $pull:{
        tokens :{token}
        
    }
    });
}


UserSchema.pre('save',function(next){
    var user = this;
    
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                user.password = hash;
                next();
            });
        });

    }else {
        next();
    }

   
});
var User = mongoose.model('User',UserSchema);



module.exports = {
  User
}