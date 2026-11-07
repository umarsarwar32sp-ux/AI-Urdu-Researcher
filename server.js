
require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/research", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "Please enter your question."
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-OpenRouter-Title": "Urdu Research AI"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are Urdu Research AI, an expert research assistant.
              Help users with Urdu language, literature, poetry,
              grammar, history and academic research.
              Answer in the language used by the user.
              Give detailed, accurate and organized answers.
              Never invent references or quotations.`
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
      console.error("OpenRouter Error:", data);

      return res.status(response.status).json({
        error: data.error?.message || "AI service error."
      });
    }

    const answer = data.choices?.[0]?.message?.content;

    if (!answer) {
      return res.status(502).json({
        error: "AI returned an empty answer."
      });
    }

    res.json({ answer });

  } catch (error) {
    console.error("Server Error:", error);

    res.status(500).json({
      error: "Server connection failed."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Urdu Research AI running on port ${PORT}`);
});
