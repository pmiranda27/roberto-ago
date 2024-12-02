const WebSocket = require("ws");
const User = require("../model/user_model"); // Certifique-se de importar o modelo User

const activeConnections = new Map();

function onError(ws, err) {
  console.error(`onError: ${err.message}`);
}

async function saveMessageToDatabase(sender, receiver, content) {
  try {
    // Encontra os dois usuários no banco de dados
    const senderUser = await User.findOne({ username: sender });
    const receiverUser = await User.findOne({ username: receiver });

    if (!senderUser || !receiverUser) {
      return { status: "error", message: "Usuários não encontrados" };
    }

    // Cria a mensagem
    const message = {
      sender: sender,
      content: content,
    };

    // Adiciona a mensagem ao array de mensagens do amigo do sender
    await User.updateOne(
      { username: sender, "amigos.name": receiver },
      { $push: { "amigos.$.messages": message } }
    );

    // Adiciona a mensagem ao array de mensagens do amigo do receiver
    await User.updateOne(
      { username: receiver, "amigos.name": sender },
      { $push: { "amigos.$.messages": message } }
    );

    return { status: "success", message };
  } catch (error) {
    console.error("Erro ao salvar mensagem:", error);
    return {
      status: "error",
      message: "Erro ao salvar mensagem no banco de dados",
    };
  }
}


async function onMessage(ws, data) {
  const message = JSON.parse(data);
  console.log(`Mensagem recebida:`, message);

  const { sender, receiver, content, timestamp } = message;

  // Salva a mensagem no banco de dados
  const result = await saveMessageToDatabase(sender, receiver, content);

  if (result.status === "error") {
    // Envia erro para o remetente se não conseguiu salvar a mensagem
    ws.send(JSON.stringify({ status: "error", message: result.message }));
    return;
  }

  // Enviar a mensagem apenas ao destinatário se estiver conectado
  const receiverSocket = activeConnections.get(receiver);
  if (receiverSocket && receiverSocket.readyState === WebSocket.OPEN) {
    receiverSocket.send(JSON.stringify({ sender, content, timestamp }));
  }

  // Enviar confirmação ao remetente
  ws.send(JSON.stringify({ status: "delivered", to: receiver }));
}

function onConnection(ws, req) {
  ws.on("message", (data) => {
    const message = JSON.parse(data);

    if (message.type === "auth") {
      const username = message.username;
      activeConnections.set(username, ws);
      console.log(`Usuário autenticado: ${username}`);
    } else {
      onMessage(ws, data);
    }
  });

  ws.on("error", (error) => onError(ws, error));
  ws.on("close", () => {
    // Remover o usuário do mapeamento ao desconectar
    activeConnections.forEach((socket, username) => {
      if (socket === ws) {
        activeConnections.delete(username);
        console.log(`Conexão fechada para usuário: ${username}`);
      }
    });
  });

  console.log(`Conexão estabelecida`);
}

module.exports = (server) => {
  const wss = new WebSocket.Server({
    server,
  });

  wss.on("connection", onConnection);

  console.log(`App WebSocket Server is running!`);
  return wss;
};
