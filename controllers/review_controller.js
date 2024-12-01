const Review = require("../model/review_model");
const User = require("../model/user_model");
const Movie = require("../model/movie_model");

const mongoose = require("mongoose");

const ComentarioModel = require("../model/comentario_model");

exports.GetComentariosPorUsername = async (req, res) => {
  const username = req.query.nickname;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Busca todos os reviews que possuem comentários do usuário
    const reviews = await Review.find({ "comentarios.username": username });

    // Extrai os comentários desse autor
    const comentarios = reviews.flatMap((review) =>
      review.comentarios.filter(
        (comentario) => comentario.username === username,
      ),
    );

    return res.status(200).json({ comentarios });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar comentários", error });
  }
};

exports.GetReviewsPorUsuario = async (req, res) => {
  const username = req.query.nickname;

  try {
    const reviews = await Review.find({ autorReview: username });
    if (!reviews) {
      return res.status(404).json({ message: "Reviews não encontradas" });
    }

    return res.status(200).json({ reviews });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar reviews", error: err });
  }
};

exports.SendCommentReview = async (req, res) => {
  const { reviewId, username, conteudo, avatar } = req.body;

  try {
    // Encontrar a review
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review não encontrado" });
    }

    // Criar o novo comentário
    const novoComentario = {
      username: username,
      conteudo: conteudo,
      avatar: avatar,
      tituloFilme: review.tituloFilme
    };

    // Adicionar ao array de comentários
    review.comentarios.push(novoComentario);
    await review.save();

    return res.status(201).json({ message: "Comentário enviado com sucesso!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Falha ao enviar comentário", error });
  }
};


exports.GetComentariosPorId = async (req, res) => {
  const reviewId = req.query.reviewId;

  try {
    const review = await Review.findById(reviewId);
    console.log("review: ", review);

    if (!review) {
      return res.status(404).json({ message: "Review não encontrado" });
    }

    const comentarios = review.comentarios;

    return res.status(200).json({ comentarios });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar review", error });
  }
};

exports.GetReviewPorId = async (req, res) => {
  const reviewId = req.query.reviewId;

  try {
    const review = await Review.findById(reviewId);
    console.log("review: ", review);

    if (!review) {
      return res.status(404).json({ message: "Review não encontrado" });
    }

    return res.status(200).json({ review });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar review", error });
  }
};

exports.Review = async (req, res) => {
  const { titulo, email, descricao, nota, privado } = req.body;

  const usuario = await User.findOne({ email });
  if (!usuario) {
    return res.status(401).json({ message: "Usuário não encontrado!" });
  }

  const tituloFilme = titulo;

  const filme = await Movie.findOne({ nome: tituloFilme });
  if (!filme) {
    return res.status(401).json({ message: "Filme não encontrado!" });
  }

  const listaAssistidos = [];
  listaAssistidos.push(usuario.username);

  const avaliador = usuario.username;

  const imagemFilme = filme.imagem;

  const novoReview = new Review({
    tituloFilme: titulo,
    descricao: descricao,
    autorAvatar: usuario.avatar,
    bannerFilme: imagemFilme,
    nota: nota,
    filmeId: filme._id,
    autorReview: avaliador,
    // assistidoPor: listaAssistidos,
    privado: privado || false, //Eu defini 'privado' como false se não for fornecido
  });

  try {
    await novoReview.save();
    res.status(201).json({ message: "Avaliado com Sucesso!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Houve um erro durante a avaliação", error });
  }
};

exports.apagarReview = async (req, res) => {
  const { id } = req.body;
  try {
    const review = await Review.findByIdAndDelete(id);
    res.status(200).json(review);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Houve um erro ao apagar a avaliação", error });
  }
};

exports.editarReview = async (req, res) => {
  const { id } = req.body;
  const { name, email, avaliacao } = req.body;
  try {
    const review = await Review.findByIdAndUpdate(id, {
      name,
      email,
      avaliacao,
    });
    return res.status(200).json(review);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Houve um erro ao editar a avaliação", error });
  }
};

exports.QuantidadeReviews = async (req, res) => {
  const { username } = req.body;

  try {
    const listaReviews = await Review.find({
      autorReview: username,
      privado: false,
    });

    return res.status(200).json({
      quantidade: listaReviews.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Houve um erro ao buscar a quantidade de avaliações",
      erro: error,
    });
  }
};

exports.GetReviews = async (req, res) => {
  const listaReviews = await Review.find({ privado: false });
  return res.status(200).json(listaReviews);
};

exports.GetReviewsPorFilme = async (req, res) => {
  const titulo = req.query.tituloFilme;

  const filme = await Movie.findOne({ nome: titulo });
  if (!filme) {
    return res.status(401).json({ message: "Filme não encontrado!" });
  }

  const listaReviews = await Review.find({ filmeId: filme._id });

  return res.status(200).json(listaReviews);
};
