//to create a schema we require mongoose

const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
     name: {
      type: String,
       required: true,
     },
  hash: String,
  salt: String
},{
  timestamps:true
});

//method to encrypt and set password
userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
}

//method to decrypt and check if the password is valid
userSchema.methods.validPassword = function(password) { 
  let Ohash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
  return this.hash === Ohash; 
}; 

// telling mongoose this is a model
const User = mongoose.model('User', userSchema);
module.exports = User;
  