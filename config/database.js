const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://migueldsa2007:slapnoflap@my-db.xt42u.mongodb.net/?retryWrites=true&w=majority&appName=my-db', {dbName: 'StarlitDatabase'});
    console.log('Conectado ao banco de dados!');
  } catch (error) {
    console.log('Erro ao conectar ao banco de dados!', error);
  }
}

module.exports = {connectDB}