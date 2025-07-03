const { chatWithGeminiService, summarizeWithGeminiService } = require('../services/ia.service');

exports.chatWithGemini = async (req, res) => {
  try {
    const { message } = req.body;
    const response = await chatWithGeminiService(message);

    res.json({ answer: response.answer });
  } catch (error) {
    console.error("Erro ao conversar com Gemini:", error?.response?.data || error.message);
    res.status(500).json({ error: "Erro ao conversar com Gemini API." });
  }
};

exports.summarizeWithGemini = async (req, res) => {
  try {
    const { text } = req.body;
    const response = await summarizeWithGeminiService(text);

    res.json({ summary: response.summary });
  } catch (error) {
    console.error("Erro ao gerar resumo com Gemini:", error?.response?.data || error.message);
    res.status(error.statusCode || 500).json({ error: error.message || "Erro interno." });
  }
};
