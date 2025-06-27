const bcrypt = require("bcryptjs"); // Criptografia e comparação de senhas
const jwt = require("jsonwebtoken"); // Cria token no login e cadastro
const { User } = require("../models"); // Modelo Sequelize do usuário
const sendWelcomeEmail = require("../emails/welcomeEmail"); // Função para enviar o e-mail

// Função assíncrona que cria o usuário e recebe objeto com dados do controller
const registerUser = async ({ name, email, phone, password }) => {
  // Verifica se o e-mail já está cadastrado no banco
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    // Define mensagem de erro, que será capturada pelo controller
    throw new Error("Usuário já cadastrado");
  }

  // Criptografa a senha 
  const hashedPassword = await bcrypt.hash(password, 10);
  // Cria usuário no banco de dados com a senha criptografada
  const user = await User.create({ name, email, phone, password: hashedPassword });

  // Tenta enviar o e-mail de boas-vindas
  try {
    // Usa a função importada com os dados name e email e loga a mensagem de sucesso
    await sendWelcomeEmail(name, email);
    console.log("E-mail de boas-vindas enviado para:", email);
    // Se der errado, o erro é logado mas o cadstro continua
  } catch (emailErr) {
    console.error("Erro ao enviar e-mail de boas-vindas:", emailErr.message);
  }

  // Gera um token JWT válido por 2h com o id do usuário como payload
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "2h" });

  // Retorna id e token para o controller
  return { id: user.id, token };
};

// Função assíncrona responsável por autenticar o usuário
const loginUser = async ({ email, password }) => {
    // Procura o usuário no banco pelo e-mail
  const user = await User.findOne({ where: { email } });
  // Se não encontrar, lança o erro com a mensagem específica, que será interpretada pelo controller e respondida com o HTTP
  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  // Compara a senha informada com a senha criptografada no banco
  const isMatch = await bcrypt.compare(password, user.password);
  // Se não bater, lança o erro com a mensagem específica
  if (!isMatch) {
    throw new Error("Senha incorreta");
  }

  // Gera um token se o login for válido
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "2h" });

  // Retorna o id(para o front) e token(para as reqs) para o controller 
  return { token, id: user.id };
};

// Exporta as funções
module.exports = { registerUser, loginUser };
