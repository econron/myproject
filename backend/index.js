require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = 3000;

// OpenAIクライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

// 意見処理エンドポイント
app.post('/api/process-opinion', async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    let result;
    if (language === 'en') {
      // 英語の添削
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an English teacher providing feedback on student opinions. Focus on grammar, vocabulary, and expression improvements while maintaining a supportive tone."
          },
          {
            role: "user",
            content: `Please provide feedback on this opinion: ${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      // 重要な表現の抽出
      const expressionsCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an English teacher. Extract key expressions, idioms, and fixed phrases from the text that would be essential for speaking in conversation. For each expression, provide its Japanese translation and a brief explanation of its usage. Format the response as a JSON array of objects with 'expression', 'translation', and 'usage' fields."
          },
          {
            role: "user",
            content: `Extract key expressions from this text: ${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      result = {
        feedback: completion.choices[0].message.content,
        translation: null,
        keyExpressions: JSON.parse(expressionsCompletion.choices[0].message.content)
      };
    } else {
      // 日本語から英語への翻訳
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional translator. Translate the Japanese text to natural English while maintaining the original meaning and tone."
          },
          {
            role: "user",
            content: `Translate this Japanese text to English: ${text}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const translatedText = completion.choices[0].message.content;

      // 翻訳された英文から重要な表現を抽出
      const expressionsCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an English teacher. Extract key expressions, idioms, and fixed phrases from the text that would be essential for speaking in conversation. For each expression, provide its Japanese translation and a brief explanation of its usage. Format the response as a JSON array of objects with 'expression', 'translation', and 'usage' fields."
          },
          {
            role: "user",
            content: `Extract key expressions from this text: ${translatedText}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      result = {
        feedback: null,
        translation: translatedText,
        keyExpressions: JSON.parse(expressionsCompletion.choices[0].message.content)
      };
    }

    res.json(result);
  } catch (error) {
    console.error('Error processing opinion:', error);
    res.status(500).json({ error: 'Failed to process opinion' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 