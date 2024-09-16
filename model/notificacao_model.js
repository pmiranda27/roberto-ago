class NotificacaoModel {
  constructor(sender, receiver, name, type, avatar, id) {
    this.sender = sender;
    this.receiver = receiver;
    this.name = name;
    this.type = type;
    this.avatar = avatar;
    this._id = id;
  }
}

module.exports = NotificacaoModel
  
