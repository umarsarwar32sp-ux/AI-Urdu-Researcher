
const express = require("express");

const app = express();

app.use(express.json());

app.post("/api/research", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "Please enter a question."
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-OpenRouter-Title": "Urdu Research AI"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are Urdu Research AI. You are an expert in Urdu language, literature, poetry, grammar, history and academic research. Answer accurately in the user's language. Never invent references."
            },
            {
              role: "user",
              content: question
            }
          ],
          temperature: 0.5,
          max_tokens: 1500
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenRouter error"
      });
    }

    res.json({
      answer: data.choices?.[0]?.message?.content || "No answer received."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server connection failed."
    });
  }
});

module.exports = app;
