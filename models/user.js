//to create a schema we require mongoose
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
     password: {
      type: String,
      required: true
    },
     name: {
      type: String,
       required: true,
     } 
     
  },{
     //timestamps are created at, updated at
     timestamps: true
});
    
    
// telling mongoose this is a model
const User = mongoose.model('User', userSchema);


module.exports = User;