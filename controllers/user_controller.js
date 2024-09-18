const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const User = require("../model/user_model");
const AmigoModel = require("../model/amigo_model");
const NotificacaoModel = require("../model/notificacao_model");
const FriendRequestModel = require("../model/friend_request_model");


const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

exports.buscarAmigos = async (req, res) => {
  const { email } = req.body;

  try {
    const findUser = await User.findOne({ email });
    const listaAmigos = findUser.amigos;
    return res.status(200).json(listaAmigos);
  } catch (err) {
    return res
      .status(400)
      .json({ message: `Usuário: ${email} não encontrado` });
  }
};

exports.adicionarAmigo = async (req, res) => {
  const { email, emailFriend } = req.body;

  var findUser = await User.findOne({ email });
  if (!findUser) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  var findFriend = await User.findOne({ email: emailFriend });
  if (!findFriend) {
    return res.status(404).json({ message: "Amigo não encontrado" });
  }

  const avatarFriend = findFriend.avatar;

  const newFriend = new AmigoModel(findFriend.name, emailFriend, avatarFriend);
  try {
    findUser = await User.findOneAndUpdate(
      { email },
      { $push: { amigos: newFriend } },
    );
    return res.status(200).json({ message: "Amigo adicionado com sucesso" });
  } catch (err) {
    return res.status(500).json({ message: "Erro ao adicionar amigo" });
  }
};

exports.removerAmigo = async (req, res) => {
  const { email, emailFriend } = req.body;

  var findUser = await User.findOne({ email });
  if (!findUser) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  var findFriend = await User.findOne({ email: emailFriend });
  if (!findFriend) {
    return res.status(404).json({ message: "Usuário do amigo não encontrado" });
  }

  const indexFirstUser = findUser.amigos.findIndex(
    (amigo) => amigo.email === emailFriend,
  );
  if (indexFirstUser === -1) {
    return res.status(404).json({ message: "Amigo não encontrado" });
  }

  const indexSecondUser = findFriend.amigos.findIndex(
    (amigo) => amigo.email === email,
  );
  if (indexSecondUser === -1) {
    return res
      .status(404)
      .json({ message: "Segundo usuário não possuí o mesmo amigo" });
  }

  findUser = await User.findOneAndUpdate(
    { email: email },
    { $pull: { amigos: { email: emailFriend } } },
    { returnOriginal: false },
  );

  findFriend = await User.findOneAndUpdate(
    { email: emailFriend },
    { $pull: { amigos: { email: email } } },
    { returnOriginal: false },
  );

  console.log("findUser: ", findUser);
  console.log("findFriend: ", findFriend);

  if (!findUser || !findFriend) {
    return res.status(500).json({ message: "Erro ao remover amigos" });
  }

  return res.status(200).json({ message: "Amigos removidos com sucesso" });
};

exports.criarUsuario = async (req, res) => {
  console.log("tentando criar usuario");
  const { name, email, password, avatar } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Usuário já existe!" });
  }

  var userAvatar;
  if (avatar) {
    userAvatar = avatar;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const novoUsuario = new User({
    name,
    email,
    password: hashedPassword,
    avatar: userAvatar,
  });

  try {
    const usuarioCriado = await novoUsuario.save();

    const newUserToken = jsonwebtoken.sign(
      {
        id: usuarioCriado._id,
        email: usuarioCriado.email,
        nome: usuarioCriado.name,
        avatar: usuarioCriado.avatar,
      },
      "starlit-secret",
      { expiresIn: "12h" },
    );

    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      token: newUserToken,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Erro ao cadastrar o usuário!", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ message: "Usuário inexistente!" });
    }

    bcrypt.compare(password, usuario.password, (error, data) => {
      if (error) {
        throw error;
      }

      if (data) {
        const loginToken = jsonwebtoken.sign(
          {
            id: usuario._id,
            email: usuario.email,
            name: usuario.name,
            avatar: usuario.avatar,
          },
          "starlit-secret",
          { expiresIn: "12h" },
        );

        res
          .status(200)
          .json({ message: "Login realizado com sucesso!", token: loginToken });
      } else {
        res.status(401).json({ message: "Senha incorreta!" });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao realizar o login!", error: error });
  }
};

exports.verificarAutenticacao = async (req, res) => {
  const receivedToken = req.body.loggedToken;

  if (receivedToken) {
    try {
      const decode = jsonwebtoken.verify(receivedToken, "starlit-secret");
      res.status(200).json({ message: "Token válido!", decode });
    } catch (error) {
      res.status(401).json({ message: "Token inválido!", error });
    }
  }
};

exports.buscarUsuarios = async (req, res) => {
  try {
    const usuario = await User.find();
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar os usuários!", error });
  }
};

exports.buscarUsuarioPorEmail = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`Buscando usuário com e-mail: ${email}`); // Adicione este log para depuração

    const usuario = await User.findOne({ email: email });
    console.log(`Usuário encontrado: ${usuario}`); // Adicione este log para depuração
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar o usuário!", error: error.message });
  }
};

exports.atualizarUsuario = async (req, res) => {
  try {
    const usuarioAtualizado = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!usuarioAtualizado) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }
    res.status(200).json({
      message: "Usuário atualizado com sucesso!",
      usuario: usuarioAtualizado,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar o usuário!", error });
  }
};

exports.deletarUsuario = async (req, res) => {
  try {
    const usuarioDeletado = await User.findByIdAndDelete(req.params.id);
    if (!usuarioDeletado) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }
    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar o usuário!", error });
  }
};

exports.verificarEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await User.findOne({ email });
    if (usuario) {
      return res.status(400).json({ message: "Esse email já foi cadastrado!" });
    }
    res.status(200).json({ message: "Esse email esta disponível!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao verificar o e-mail!", error });
  }
};

exports.verificarSenha = async (req, res) => {
  try {
    const { password } = req.body;
    const usuario = await User.findOne({ password });
    if (usuario) {
      return res.status(400).json({ message: "Senha incorreta!" });
    }
    res.status(200).json({ message: "Senha correta!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao verificar a senha!", error });
  }
};

exports.buscarNotificacoes = async (req, res) => {
  const { email } = req.body;

  try {
    const findUser = await User.findOne({ email });
    const listaNotificacoes = findUser.notifications;
    return res.status(200).json(listaNotificacoes);
  } catch (err) {
    return res
      .status(400)
      .json({ message: `Usuário: ${email} não encontrado` });
  }
};

exports.removerNotificacao = async (req, res) => {
  const { sender, receiver, type } = req.body;

  var findNotificationId;

  var findReceiver = await User.findOne({ email: receiver });
  if (!findReceiver) {
    return res.status(400).json({ message: "Recebedor não encontrado" });
  }

  const findSender = await User.findOne({ email: sender });
  if (!findSender) {
    return res.status(400).json({ message: "Enviador não encontrado" });
  }

  const index = findReceiver.notifications.findIndex(
    (noti) => noti.sender === sender,
  );
  if (index === -1) {
    return res.status(400).json({ message: "Notificação não encontrada" });
  }

  if (type === "friend-request") {
    for (const notification of findReceiver.notifications) {
      if (
        notification.sender === sender &&
        notification.type === "friend-request"
      ) {
        findNotificationId = notification._id;
        await User.findOneAndUpdate(
          { email: receiver },
          { $pull: { friendRequests: { sender: sender } } },
        );
        break;
      }
    }
  }
  if (!findNotificationId) {
    return res.status(400).json({ message: "Notificação não encontrada" });
  }

  try {
    await User.findOneAndUpdate(
      { email: receiver },
      { $pull: { notifications: { _id: findNotificationId } } },
    );
    return res
      .status(200)
      .json({ message: "Notificação removida com sucesso!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Erro ao remover notificação: ${error}` });
  }
};

exports.criarNotificacao = async (req, res) => {
  const { sender, receiver, name, type } = req.body;

  const sendingUser = await User.findOne({ email: sender });
  if (!sendingUser) {
    return res.status(404).json({ message: "Enviador não encontrado" });
  }

  const receivingUser = await User.findOne({ email: receiver });
  if (!receivingUser) {
    return res.status(404).json({ message: "Recebedor não encontrado" });
  }

  const avatar = sendingUser.avatar;

  const id = new ObjectId();

  const newNotificacao = new NotificacaoModel(
    sender,
    receiver,
    name,
    type,
    avatar,
    id,
  );

  const newFriendRequest = new FriendRequestModel(sender, receiver);

  try {
    if (
      type === "friend-request" &&
      receivingUser.friendRequests.every((val) => {
        return val.sender !== sender;
      })
    ) {
      await User.findOneAndUpdate(
        { email: receiver },
        { $push: { notifications: newNotificacao } },
      );
      await User.findOneAndUpdate(
        { email: receiver },
        { $push: { friendRequests: newFriendRequest } },
      );
    }
    return res.status(200).json({ message: "Notificação criada com sucesso" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erro ao criar notificação" });
  }
};

exports.responderNotificacao = async (req, res) => {
  const { notificationId, response, receiver } = req.body;

  var findUser = await User.findOne({ email: receiver });
  if (!findUser) {
    return res.status(400).json({ message: "Usuário não encontrado" });
  }

  const listaNotificacoes = findUser.notifications;

  const indexNotificacao = listaNotificacoes.findIndex(
    (notificacao) => notificacao._id.toString() === notificationId,
  );

  if (indexNotificacao === -1) {
    return res.status(404).json({ message: "Notificação não encontrada" });
  }

  switch (listaNotificacoes[indexNotificacao].type) {
    case "friend-request":
      console.log("Tipo de notificação: friend-request");

      if (response === true) {
        for (const friend of findUser.amigos) {
          if (friend.email === listaNotificacoes[indexNotificacao].sender) {
            try {
              await User.findOneAndUpdate(
                { email: receiver },
                {
                  $pull: {
                    notifications: {
                      sender: friend.email,
                      type: "friend-request",
                    },
                  },
                },
              );
              await User.findOneAndUpdate(
                { email: receiver },
                { $pull: { friendRequests: { sender: friend.email } } },
              );
            } catch (err) {
              return res
                .status(400)
                .json({ message: `Erro ao responder ${err}` });
            }

            return res.status(400).json({ message: "Usuários já são amigos" });
          }
        }

        try {
          await this.adicionarAmigo(
            {
              body: {
                email: findUser.email,
                emailFriend: listaNotificacoes[indexNotificacao].sender,
              },
            },
            { status: () => ({ json: () => {} }) }, // SÓ PRA EVITAR PROBLEMAS
          );
          await this.adicionarAmigo(
            {
              body: {
                email: listaNotificacoes[indexNotificacao].sender,
                emailFriend: findUser.email,
              },
            },
            { status: () => ({ json: () => {} }) }, // SÓ PRA EVITAR PROBLEMAS
          );
        } catch (error) {
          return res
            .status(500)
            .json({ message: `Erro ao adicionar amigos ${error}` });
        }

        try {
          await User.findOneAndUpdate(
            { email: receiver },
            {
              $pull: {
                notifications: {
                  sender: listaNotificacoes[indexNotificacao].sender,
                  type: "friend-request",
                },
              },
            },
          );
          await User.findOneAndUpdate(
            { email: receiver },
            {
              $pull: {
                friendRequests: {
                  sender: listaNotificacoes[indexNotificacao].sender,
                },
              },
            },
          );
          return res
            .status(201)
            .json({ message: "Amigo adicionado com sucesso" });
        } catch (err) {
          return res
            .status(400)
            .json({ message: `Não foi possível adicionar amigo ${err}` });
        }
      } else {
        try {
          await User.findOneAndUpdate(
            { email: receiver },
            {
              $pull: {
                notifications: {
                  sender: listaNotificacoes[indexNotificacao].sender,
                  type: "friend-request",
                },
              },
            },
          );
          await User.findOneAndUpdate(
            { email: receiver },
            {
              $pull: {
                friendRequests: {
                  sender: listaNotificacoes[indexNotificacao].sender,
                },
              },
            },
          );
          return res
            .status(200)
            .json({ message: "Notificação recusada com sucesso" });
        } catch (err) {
          console.log("Falhei", err);
          return res
            .status(500)
            .json({ message: `Erro ao recusar notificação ${err}` });
        }
      }
      break;

    default:
      return res.status(400).json({ message: "Tipo de notificação inválida!" });
  }
};

exports.atualizarAvatar = async (req, res) => {
  const { email, avatar } = req.body;

  const findUser = await User.findOne({ email });
  if (!findUser) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  try {
    findUser.avatar = avatar;
    findUser.save();
    return res.status(200).json({ message: "Avatar atualizado com sucesso" });
  } catch (err) {
    return res.status(500).json({ message: "Erro ao atualizar avatar" });
  }
};

exports.atualizarBio = async (req, res) => {
  const { email, bio } = req.body;

  const findUser = await User.findOne({ email });
  if (!findUser) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  try {
    findUser.bio = bio;
    findUser.save();
    return res.status(200).json({ message: "Bio atualizada com sucesso" });
  } catch (err) {
    return res.status(500).json({ message: "Erro ao atualizar bio" });
  }
};

exports.atualizarSenha = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    findUser.password = senha;
    findUser.save();
    return res.status(200).json({ message: "Senha atualizada com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar senha" });
  }
}

exports.curtirFilme = async (req, res) => {
  try {
    const { id } = req.body;
    const findFilme = await Movie.findById(id);
    if (!findFilme) {
      return res.status(404).json({ message: "Filme não encontrado" });
    }

    findFilme.curtidas += 1;
    findFilme.save();
    return res.status(200).json({ message: "Filme curtido com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao curtir filme" });
  }
};

exports.retirarCurtida = async (req, res) => {
  try {
    const { id } = req.body;
    const findFilme = await Movie.findById(id);
    if (!findFilme) {
      return res.status(404).json({ message: "Filme não encontrado" });
    }

    findFilme.curtidas -= 1;
    findFilme.save();
    return res.status(200).json({ message: "Filme retirado da curtidas" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao retirar curtida"});
  }
};

exports.bloquarUsuario = async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    findUser.bloqueado = true;
    findUser.save();
    return res.status(200).json({ message: "Usuário bloqueado com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao bloquear usuário" });
  }
};

exports.desbloquearUsuario = async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    findUser.bloqueado = false;
    findUser.save();
    return res.status(200).json({ message: "Usuário desbloqueado com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao desbloquear usuário" });
  }
};

exports.favoritarFilme = async (req, res) => {
  const { userId, movieId, title, posterPath, releaseDate } = req.body;

  try {
    // Verificar se o filme já está favoritado por esse usuário
    const filmeJaFavoritado = await Favorito.findOne({ userId, movieId });

    if (filmeJaFavoritado) {
      return res.status(400).json({ message: 'Filme já está favoritado!' });
    }

    // Criar um novo favorito
    const novoFavorito = new Favorito({
      userId,
      movieId,
      title,
      posterPath,
      releaseDate
    });

    // Salvar o novo favorito no banco de dados
    await novoFavorito.save();

    res.status(201).json({ message: 'Filme favoritado com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao favoritar o filme', error });
  }
};

exports.retirarFavorito = async (req, res) => {
  const { userId, movieId } = req.body;

  try {
    // Procurar e remover o favorito baseado no userId e movieId
    const favorito = await Favorito.findOneAndDelete({ userId, movieId });

    if (!favorito) {
      return res.status(404).json({ message: 'Filme não encontrado nos favoritos' });
    }

    res.status(200).json({ message: 'Filme removido dos favoritos com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover o filme dos favoritos', error });
  }
};