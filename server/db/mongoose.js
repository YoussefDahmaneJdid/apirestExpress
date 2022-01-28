var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

//mongodb+srv://admin:azAZaz123@cluster0.5zenl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
module.exports = {
  mongoose
}