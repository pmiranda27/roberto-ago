const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const webSocket = require('ws');
const webSocketController = require('./controllers/web_socket_chat')

const movieRouter = require("./routes/movie_routes");
const { connectDB } = require("./config/database");
const userRouter = require("./routes/user_routes");
const reviewRouter = require("./routes/review_routes");
const chatRouter = require("./routes/review_routes");
const messageRoutes = require('./routes/message_routes');

const app = express();

const corsOptions = {
  origin: '*',
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type', 
};

//define os middlewares
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // For preflight requests (OPTIONS request)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

//define o ponto de partida da aplicação

const PORT = process.env.PORT || 3000;
//faz a conexão com o banco de dados
connectDB();

//rotas
// app.use('/products', router);
app.use("/user", userRouter);
app.use("/reviews", reviewRouter);
app.use("/movies", movieRouter);
app.use("/chat", chatRouter);
app.use("/mensagem", messageRoutes);

//define o ouvinte
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

webSocketController(server)