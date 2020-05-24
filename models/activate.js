//to create a schema we require mongoose
const mongoose = require('mongoose');

const activateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
     accessToken: {
      type: String
      
    },
     isValid: {
      type: Boolean,
      default: false
      
     },
     isExpires: {
         type: Date
     }
     
  },{
     //timestamps are created at, updated at
     timestamps: true
});
    
    
// telling mongoose this is a model
const Activate = mongoose.model('Activate', activateSchema);


module.exports = Activate;