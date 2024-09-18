const Review = require("../model/review_model");
const User = require("../model/user_model");

exports.Review = async (req, res) => {
  const { name, email, avaliacao } = req.body;
  
  const usuario = await User.findOne({ email })
  if (!usuario){
    res.status(401).json({message: 'Usuário não encontrado!'});
  }
  
  const novoReview = new Review({
    name,
    email,
    avaliacao,
    privado: privado || false  //Eu defini 'privado' como false se não for fornecido
  });
  
  try {
    await novoReview.save();
    res.status(201).json({ message: "Avaliado com Sucesso!"});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Houve um erro durante a avaliação", error });
  }
}

exports.apagarReview = async (req, res) => {
  const { id } = req.body;
  try {
    const review = await Review.findByIdAndDelete(id);
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: "Houve um erro ao apagar a avaliação", error });
  }
}

exports.editarReview = async (req, res) => {
  const { id } = req.body;
  const { name, email, avaliacao } = req.body;
  try {
    const review = await Review.findByIdAndUpdate(id, { name, email, avaliacao });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: "Houve um erro ao editar a avaliação", error });
  }
}