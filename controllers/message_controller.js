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

