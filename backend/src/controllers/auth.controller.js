// Importa funções do service responsáveis por login e regisro
const { registerUser, loginUser } = require("../services/auth.service");

// Define uma função assíncrona que trata a rota de cadastro
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const result = await registerUser({ name, email, phone, password });

    // Retornar mesma estrutura do login
    res.status(201).json({
      message: "Usuário criado com sucesso",
      token: result.token, // Token separado
      user: result.id,     // Apenas ID do usuário
    });
  } catch (err) {
    const msg = err.message || "Erro ao registrar usuário";
    const status = msg === "Usuário já cadastrado" ? 400 : 500;
    console.error("Erro em register:", msg);
    res.status(status).json({ message: msg });
  }
};

// Função assíncrona que trata a rota de login de usuário
const login = async (req, res) => {
  try {
    // Extrai email e senha do corpo da requisição
    const { email, password } = req.body;
    // Chama o service para autenticar o usuário
    const result = await loginUser({ email, password });

    // Envia resposta de sucesso com token JWT e id do usuário
    res.json({
      message: "Login realizado com sucesso",
      token: result.token,
      user: result.id,
    });
  } catch (err) {
    // Captura erros lançados no loginUser
    const msg = err.message || "Erro ao fazer login";
    // Define status com base em mensagens conhecidas
    const status = msg === "Usuário não encontrado" || msg === "Senha incorreta" ? 400 : 500;

    // Loga o erro no console 
    console.error("Erro em login:", msg);
    // Retorna a mensagem de erro com status
    res.status(status).json({ message: msg });
  }
};

// Exporta funções
module.exports = { register, login };
