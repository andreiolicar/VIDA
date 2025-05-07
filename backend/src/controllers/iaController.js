const axios = require('axios');

exports.chatWithGemini = async (req, res) => {
  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: message }]
          }
        ]
      }
    );

    const answer = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Não consegui responder.";
    res.json({ answer });
  } catch (error) {
    console.error('Erro ao conversar com Gemini:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao conversar com Gemini API.' });
  }
};
