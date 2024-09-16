const Chat = require('../model/chat_model');

exports.mandarMensagem = async (req, res) => {
  try {
    const novaMensagem = new Chat(req.body);
    res.mensagens = await novaMensagem.save();
  } catch {
    res.status(500).json({ message: 'Erro ao enviar mensagem' });
  }
}
exports.buscarMensagens = async (req, res) => {
  try {
    const mensagens = await Chat.find();
    res.status(200).json(mensagens);
  } catch {
    res.status(500).json({ message: 'Erro ao buscar mensagens' });
  }
}
exports.apagarMensagem = async (req, res) => {
  try {
    const mensagem = await Chat.findByIdAndDelete(req.params.id);
    res.status(200).json(mensagem);
  } catch {
    res.status(500).json({ message: 'Erro ao apagar mensagem' });
  }
}
exports.responderMensagem = async (req, res) => {
  try {
    const mensagem = await Chat.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(mensagem);
  } catch {
    res.status(500).json({ message: 'Erro ao responder mensagem' });
  }
}
exports.fixarMensagem = async (req, res) => {
  try {
    const mensagem = await Chat.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(mensagem);
  } catch {
    res.status(500).json({ message: 'Erro ao fixar mensagem' });
  }
};
exports.caminharMensagem = async (req, res) => {
  try {
    const mensagem = await Chat.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(mensagem);
  } catch {
    res.status(500).json({ message: 'Erro ao caminhar mensagem' });
  }
};
exports.editarMensagem = async (req, res) => {
  try {
    const mensagem = await Chat.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(mensagem);
  } catch {
    res.status(500).json({ message: 'Erro ao editar mensagem' });
  }
}