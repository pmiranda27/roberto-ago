const mongoose = require('mongoose');

class AmigoModel {
  constructor(name, email, avatar){
    this.name = name;
    this.email = email;
    this.avatar = avatar;
    this.messages = [];
  }
}

module.exports = AmigoModel;