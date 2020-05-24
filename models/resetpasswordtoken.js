//to create a schema we require mongoose
const mongoose = require('mongoose');

const resetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
     accessToken: {
      type: String,
      required:true
    },
     isValid: {
      type: Boolean,
      required:true
      
     } 
     
  },{
     //timestamps are created at, updated at
     timestamps: true
});
    
    
// telling mongoose this is a model
const Reset = mongoose.model('Reset', resetSchema);


module.exports = Reset;