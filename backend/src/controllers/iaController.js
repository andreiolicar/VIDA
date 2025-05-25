const axios = require("axios");

// Lista de palavras/tópicos proibidos (adicione conforme sua política)
const forbiddenWords = [
  // Ofensivas
  "idiota",
  "burro",
  "otário",
  "palavrão1",
  "palavrão2",
  // Violência
  "matar",
  "assassinar",
  "agredir",
  "explodir",
  "bater em",
  // Drogas
  "maconha",
  "cocaína",
  "crack",
  "heroína",
  // Conteúdo sexual
  "sexo",
  "pornografia",
  "nudez",
  "nua",
  "nudes",
  // Discriminação
  "racista",
  "preconceito",
  "homofóbico",
  "machista",
  // Ilegais
  "hackear",
  "invadir sistema",
  "roubar",
  "furtar",
];

// Prompt de sistema reforçando o idioma
const systemPrompt = `
Você é um assistente do sistema V.I.D.A. Responda sempre de forma educativa, informativa e respeitosa.
Nunca responda perguntas ofensivas, ilegais, discriminatórias ou impróprias.
**Responda sempre em português do Brasil, a não ser que a pergunta esteja em outro idioma.**
`;

exports.chatWithGemini = async (req, res) => {
  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const hasForbidden = forbiddenWords.some((word) =>
    message.toLowerCase().includes(word)
  );

  if (hasForbidden) {
    return res.json({
      answer:
        "Desculpe, não posso responder perguntas com conteúdo ofensivo, impróprio ou ilegal. Por favor, faça perguntas educativas e respeitosas.",
    });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
      }
    );

    const answer =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Não consegui responder.";
    res.json({ answer });
  } catch (error) {
    console.error(
      "Erro ao conversar com Gemini:",
      error?.response?.data || error.message
    );
    res.status(500).json({ error: "Erro ao conversar com Gemini API." });
  }
};
