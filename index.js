const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const movieRouter = require("./api/routes/movie_routes");
const { connectDB } = require("./api/config/database");
const userRouter = require("./api/routes/user_routes");
const reviewRouter = require("./api/routes/review_routes");
const chatRouter = require("./api/routes/review_routes");

const app = express();

const corsConfig = {
  credentials: true,
  origin: true,
};

//define os middlewares
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
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
app.use(cookieParser());
app.use(express.json());

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

//define o ouvinte
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
