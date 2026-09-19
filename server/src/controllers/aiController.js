const { GoogleGenAI } = require('@google/genai');

const generateCaption = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = 'You are a social media expert. Write an engaging social media post caption based on the user prompt. Keep it concise, engaging, and include a few relevant hashtags.';
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
      }
    });

    res.status(200).json({ caption: response.text });
  } catch (error) {
    console.error('Error generating caption:', error);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
};

module.exports = {
  generateCaption,
};
