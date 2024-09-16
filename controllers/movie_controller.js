// Importamos o modelo produto
const Movie = require('../model/movie_model');

// Funcão para cadastrar os produtos
exports.criarFilmes = async (req, res) => {
  try{
    // criamos o novo produto a partir do objeto recebido
    const novoFilme = new Movie(req.body);
    //salvo no banco de dados. O await serve para esperar a resposta do banco de dados
    await novoFilme.save();
    res.status(201).json({message: 'Filme cadastrado com sucesso!'});
  } catch {
    //informamos o erro
    res.status(500).json({message: 'Erro ao cadastrar o filme!', error});
  }
}

// Funcão para buscar todos os produtos
exports.buscarFilmes = async (req, res) => {
  try {
    //criar uma variavel para receber os produtos a partir do modelo
    const filmes = await Movie.find();
    //responde com os filmes
    res.status(200).json(filmes);
  } catch (error) {
    res.status(500).json({message: 'Erro ao buscar os filmes!', error});
  }
};

exports.verificaFilme = async (req, res) => {
  try {
    const { id } = req.body;
    const filme = await Movie.findOne({ id });
    if (filme) {
      return res.status(400).json({ message: "Esse filme já foi cadastrado!" });
    }
    res.status(200).json({ message: "Esse filme esta disponível!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao verificar o filme!", error });
  }
};

