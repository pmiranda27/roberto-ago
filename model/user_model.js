const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    },
  description: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    requireed: true,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  },
  amigos: {
    type: Array
  },
  reviews: {
    type: Array
  },
  comments: {
    type: Array
  },
  notifications: {
    type: Array
  },
  friendRequests: {
    type: Array
  }
});

const User = mongoose.model('user', userSchema);
module.exports = User;