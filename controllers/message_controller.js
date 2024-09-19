const Message = require('../model/message_model');

// Enviar uma nova mensagem
exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;

    const newMessage = new Message({
      sender,
      receiver,
      content,
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Mensagem enviada com sucesso',
      data: newMessage,
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error); // Log do erro
    res.status(500).json({
      success: false,
      message: 'Falha ao enviar a mensagem',
      error: error.message,
    });
  }
};


// Obter mensagens entre dois usuários
exports.getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.query;

    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Falha ao recuperar mensagens',
      error: error.message,
    });
  }
};

//editar 😔
exports.editMessages = async (req, res) => {
  try {
    const { id, content } = req.body;

    const updatedMessage = await Message.findByIdAndUpdate(id, { content }, { new: true });

    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mensagem editada com sucesso',
      data: updatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Falha ao editar a mensagem',
      error: error.message,
    });
  }
}

exports.deleteMessages = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mensagem excluída com sucesso',
      data: deletedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Falha ao excluir a mensagem',
      error: error.message,
    });
  }
};

//Fixar
exports.fixedMessage = async (req, res) => {
  try {
    const { id } = req.body;

    const fixedMessage = await Message.findByIdAndUpdate(id, { fixed: true }, { new: true });

    if (!fixedMessage) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mensagem fixada com sucesso',
      data: fixedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Falha ao fixar a mensagem',
      error: error.message,
    });
  }
};

//responder
exports.respondMessage = async (req, res) => {
  try {
    const { id, content } = req.body;

    const newMessage = new Message({
      sender: 'Você',
      receiver: 'Usuário',
      content,
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Resposta enviada com sucesso',
      data: newMessage,
    });
  } catch (error) {
    console.error('Erro ao enviar resposta:', error); // Log do erro
    res.status(500).json({
      success: false,
      message: 'Falha ao enviar a resposta',
      error: error.message,
    });
  }
};