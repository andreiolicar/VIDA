const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyBFLvf5vUfDFj7IN8531Xq3Ikf2tbY_40I"; 
const genAI = new GoogleGenerativeAI(API_KEY);

async function suggestPriority(userProfile, taskTitle, taskDescription) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt = `
Você é um assistente especialista em priorização de tarefas usando técnicas como:
- Matriz Impacto x Esforço
- Método MoSCoW (Must have, Should have, Could have)
- Princípio de Eisenhower (urgente/importante)

Perfil do usuário:
${userProfile}

Tarefa a ser priorizada:
- Título: ${taskTitle}
- Descrição: ${taskDescription || "Sem descrição"}

Analise considerando:
1. Padrões históricos do usuário
2. Complexidade implícita na descrição
3. Alinhamento com metas pessoais do usuário

Sugira prioridade entre: alta, media, baixa.
Resposta (apenas a palavra):`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const priority = response.text().trim().toLowerCase();

    const validPriorities = ["alta", "media", "baixa"];
    return validPriorities.includes(priority) ? priority : "media";
  } catch (error) {
    console.error("Erro na Gemini:", error);
    return "media";
  }
}

module.exports = { suggestPriority };
