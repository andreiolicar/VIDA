const axios = require('axios');

// Lista de palavras/tópicos proibidos
const forbiddenWords = [
  "idiota", "burro", "otário", "palavrão1", "palavrão2",
  "matar", "assassinar", "agredir", "explodir", "bater em",
  "maconha", "cocaína", "crack", "heroína",
  "sexo", "pornografia", "nudez", "nua", "nudes",
  "racista", "preconceito", "homofóbico", "machista",
  "hackear", "invadir sistema", "roubar", "furtar",
];

// Prompt de sistema padrão
const systemPrompt = `
Você é um assistente do sistema V.I.D.A. Responda sempre de forma educativa, informativa e respeitosa.
Nunca responda perguntas ofensivas, ilegais, discriminatórias ou impróprias.
**Responda sempre em português do Brasil, a não ser que a pergunta esteja em outro idioma.**
`;

function containsForbiddenContent(text) {
  return forbiddenWords.some(word => text.toLowerCase().includes(word));
}

async function chatWithGeminiService(message) {
  if (containsForbiddenContent(message)) {
    return {
      blocked: true,
      answer: "Desculpe, não posso responder perguntas com conteúdo ofensivo, impróprio ou ilegal. Por favor, faça perguntas educativas e respeitosas.",
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    {
      contents: [{ parts: [{ text: message }] }],
    }
  );

  const answer = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Não consegui responder.";
  return { blocked: false, answer };
}

async function summarizeWithGeminiService(text) {
  if (!text) {
    const error = new Error("Texto para resumo é obrigatório.");
    error.statusCode = 400;
    throw error;
  }

  if (containsForbiddenContent(text)) {
    return {
      blocked: true,
      summary: "Desculpe, não posso processar textos com conteúdo ofensivo, impróprio ou ilegal.",
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  const promptText = `${systemPrompt}\n\nResuma a seguinte conversa de forma clara e concisa:\n\n${text}`;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        temperature: 0.3,
        candidateCount: 1,
        maxOutputTokens: 200,
      },
    }
  );

  const summary = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Não consegui gerar o resumo.";
  return { blocked: false, summary };
}

module.exports = {
  chatWithGeminiService,
  summarizeWithGeminiService,
};
