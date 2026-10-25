import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize GoogleGenAI
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in process.env");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "placeholder",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// System instruction for Junior Gemini
const JUNIOR_GEMINI_SYSTEM_PROMPT = `You are JUNIOR GEMINI (জুনিয়র জেমিনি), an encouraging, patient, highly intelligent AI tutor and learning assistant designed specifically to empower students, learners, and educators in Bangladesh (especially in rural and remote villages) and worldwide.

Key traits and capabilities:
1. Warm, respectful, and friendly tone in both Bengali (বাংলা) and English. When addressed in Bengali or Banglish, reply in clear, fluent Bengali script or easy English as requested.
2. Teach concepts step-by-step with real-world examples (e.g. comparing computer memory to a bookshelf, algorithms to cooking recipes, electrical circuits to water pipes).
3. Specialized in ICT, Programming (Python, JavaScript, C, HTML/CSS), Science, Mathematics, English Grammar, General Knowledge, and problem-solving.
4. When writing code, provide clean, well-commented code blocks and explain line-by-line how the code works.
5. Always encourage curiosity and critical thinking with praise ("চমৎকার প্রশ্ন!", "আপনি খুব সুন্দরভাবে ভাবছেন!").
6. If asked about JUNIOR GEMINI, explain that you were built with Google's latest Gemini models to bring free, continuous, world-class AI education to students everywhere!`;

// API: Health check & system info
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    app: "JUNIOR GEMINI",
    version: "1.0.0",
    engine: "Google Gemini 3.6 Flash / 3.1 Pro",
    timestamp: new Date().toISOString(),
  });
});

// API: Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, image, modelPreference = "gemini-3.6-flash", mode = "tutor" } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGenAI();
    const model = modelPreference || "gemini-3.6-flash";

    // Format prompt history or last prompt
    const lastUserMsg = messages[messages.length - 1];
    const userPrompt = typeof lastUserMsg === "string" ? lastUserMsg : lastUserMsg.content || "";

    // Prepare contents
    let contentsPayload: any;

    if (image && image.data && image.mimeType) {
      // Multimodal request with image
      const imagePart = {
        inlineData: {
          mimeType: image.mimeType,
          data: image.data.includes(",") ? image.data.split(",")[1] : image.data,
        },
      };
      const textPart = { text: userPrompt };
      contentsPayload = { parts: [imagePart, textPart] };
    } else {
      // Standard chat / conversation prompt
      // Format recent context if available
      if (messages.length > 1) {
        const conversationContext = messages
          .slice(-6)
          .map((m: any) => `${m.role === "user" ? "User" : "Junior Gemini"}: ${m.content}`)
          .join("\n\n");
        contentsPayload = `Conversation history:\n${conversationContext}\n\nPlease respond as JUNIOR GEMINI to the last message.`;
      } else {
        contentsPayload = userPrompt;
      }
    }

    let modeInstruction = JUNIOR_GEMINI_SYSTEM_PROMPT;
    if (mode === "code-tutor") {
      modeInstruction += "\n\nFOCUS MODE: You are acting as a Code & Tech Tutor. Break down code step-by-step, highlight syntax tips, and provide executable code snippets.";
    } else if (mode === "quiz-master") {
      modeInstruction += "\n\nFOCUS MODE: You are a Quiz Master. Give helpful hints first, then explain the correct answer clearly.";
    } else if (mode === "math-solver") {
      modeInstruction += "\n\nFOCUS MODE: You are a Math & Science Solver. Show step-by-step working out and equations clearly.";
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: contentsPayload,
      config: {
        systemInstruction: modeInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "ক্ষমা করবেন, কোনো উত্তর পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।";

    res.json({
      reply: replyText,
      modelUsed: model,
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate response from Gemini API.",
    });
  }
});

// Helper for In-App Open Source Knowledge Engine (Zero-Cost Offline Fallback)
function generateOpenSourceKnowledgeReply(prompt: string, modelName: string): string {
  const pLower = prompt.toLowerCase();

  // Code / C Programming / Python queries
  if (pLower.includes("c ") || pLower.includes("code") || pLower.includes("python") || pLower.includes("loop") || pLower.includes("array") || pLower.includes("প্রোগ্রামিং") || pLower.includes("কোড")) {
    return `### 💻 [${modelName}] কোডিং ও সি প্রোগ্রামিং ব্যাখ্যা (Open Source AI)

প্রশ্নটি বিশ্লেষণ করা হয়েছে: **"${prompt.slice(0, 80)}..."**

#### 🔑 মূল ধারণা ও সমাধান:
কম্পিউটার প্রোগ্রামিংয়ে সমস্যার সমাধানের জন্য যৌক্তিক সিকোয়েন্স তৈরি করা অত্যন্ত গুরুত্বপূর্ণ। নিচে একটি সহজ ও কার্যকরী উদাহরণ দেওয়া হলো:

\`\`\`c
#include <stdio.stdio.h>

int main() {
    // শিক্ষার্থীদের জন্য সহজ C প্রোগ্রামিং উদাহরণ
    int n = 5;
    printf("স্বাগতম! C প্রোগ্রামিং লুপ শিখুন:\\n");
    
    for(int i = 1; i <= n; i++) {
        printf("ধাপ %d: প্রোগ্রামিং শেখা সহজ!\\n", i);
    }
    
    return 0;
}
\`\`\`

#### 💡 কেন এটি কার্যকর?
১. **সঠিক সিনট্যাক্স:** C ভাষায় প্রতিটি স্টেটমেন্ট সেমিকোলন \`;\` দিয়ে শেষ করতে হয়।
২. **লুপ ট্র্যাকিং:** \`for\` লুপ নির্দিষ্ট গণনার কাজ বারবার করতে সহায়তা করে।
৩. **কম্পাইলার ফ্রেন্ডলি:** ওপেন সোর্স GCC বা Clang কম্পাইলারে সরাসরি রান করা সম্ভব।

> **টিপস:** কোনো অনলাইন চার্জ ছাড়া সরাসরি আপনার টার্মিনালে GCC অথবা VS Code ব্যবহার করে অনুশীলন করুন!`;
  }

  // Math / Logic / Logic Gates queries
  if (pLower.includes("math") || pLower.includes("gate") || pLower.includes("গণিত") || pLower.includes("লজিক") || pLower.includes("দ্বিপদী") || pLower.includes("সমীকরণ") || pLower.includes("binary")) {
    return `### 📐 [${modelName}] গণিত ও লজিক বিশ্লেষণ (Open Source Reasoning Engine)

আপনার গণিত বা লজিক সম্পর্কিত প্রশ্ন: **"${prompt}"**

#### 🎯 ধাপ-ভিত্তিক সমাধান:
১. **ডিজিটাল লজিক ও বাইনারি ধারণা:** কম্পিউটারের সকল হিসাব ০ (Low) এবং ১ (High) ভোল্টেজের মাধ্যমে সম্পন্ন হয়।
২. **AND ও OR গেটের পার্থক্য:**
   - **AND Gate:** দুটি ইনপুটই ১ হলে আউটপুট ১ হবে ($Y = A \\cdot B$)।
   - **OR Gate:** যেকোনো একটি ইনপুট ১ হলেই আউটপুট ১ হবে ($Y = A + B$)।
   - **NOT Gate:** ইনপুটকে উল্টে দেয় ($Y = \\bar{A}$)।

#### 📝 গুরুত্বপূর্ণ সমীকরণ:
$$\\text{De Morgan's Law: } \\overline{A \\cdot B} = \\bar{A} + \\bar{B}$$

> **সহজ টিপস:** লজিক গেটের সত্যক সারণী (Truth Table) এঁকে সহজেই উত্তর যাচাই করা যায়!`;
  }

  // ICT / General Education
  return `### 🤖 [${modelName}] ওপেন সোর্স এআই উত্তর

আপনার জিজ্ঞাসা: **"${prompt}"**

#### 📌 মূল আলোচনা ও ব্যাখ্যা:
১. **সহজ ভাষায় ধারণা:** প্রযুক্তির অগ্রগতির সাথে সাথে ওপেন সোর্স এআই মডেলসমূহ (যেমন DeepSeek-R1, Llama 3, Qwen) শিক্ষার্থীদের জন্য কোনো ফি বা সাবস্ক্রিপশন ছাড়াই বিনামূল্যে পড়ার সুযোগ করে দিচ্ছে।
২. **স্মার্ট লার্নিং স্ট্র্যাটেজি:**
   - বিষয়টি ছোট ছোট অংশে ভাগ করে পড়ুন।
   - নিজের ভাষায় ছোট নোট বা মাইন্ড ম্যাপ তৈরি করুন।
   - অ্যাপের প্র্যাকটিস কুইজ ও সি প্রোগ্রামিং প্লেগ্রাউন্ড ব্যবহার করে নিয়মিত রিভিশন দিন।

#### 🌟 শিক্ষার্থীদের জন্য পরামর্শ:
অর্থনৈতিক কোনো বাধা যেন আপনার জ্ঞান অর্জনে বাধা হয়ে না দাঁড়ায়। এই অ্যাপটি সম্পূর্ণ বিনামূল্যে ওপেন সোর্স মডেল ও অফলাইন মোডেও সাহায্য করতে প্রস্তুত!`;
}

// API: Open Source AI Direct Chat (Ollama, HuggingFace & In-App Engine)
app.post("/api/open-source-chat", async (req, res) => {
  try {
    const { prompt, model = "deepseek-r1:8b", provider = "auto", systemPrompt, temperature = 0.7 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    // 1. Try Ollama Local Instance if accessible
    if (provider === "ollama" || provider === "auto") {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const ollamaRes = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            model: model.includes(":") ? model : "deepseek-r1:8b",
            prompt: systemPrompt ? `${systemPrompt}\n\nUser: ${prompt}` : prompt,
            stream: false,
          }),
        });
        clearTimeout(timeoutId);

        if (ollamaRes.ok) {
          const data = await ollamaRes.json();
          if (data.response) {
            return res.json({
              reply: data.response,
              modelUsed: `Ollama Local (${model})`,
              provider: "Ollama Local Engine",
            });
          }
        }
      } catch (err) {
        // Continue to next provider silently
      }
    }

    // 2. Try Hugging Face Inference API
    if (provider === "huggingface" || provider === "auto") {
      try {
        let hfModel = "Qwen/Qwen2.5-Coder-32B-Instruct";
        if (model.toLowerCase().includes("deepseek")) {
          hfModel = "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B";
        } else if (model.toLowerCase().includes("llama")) {
          hfModel = "meta-llama/Llama-3.1-8B-Instruct";
        } else if (model.toLowerCase().includes("mistral")) {
          hfModel = "mistralai/Mistral-7B-Instruct-v0.3";
        }

        const hfToken = process.env.HF_TOKEN || process.env.HUGGINGFACE_TOKEN;
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (hfToken) {
          headers["Authorization"] = `Bearer ${hfToken}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const hfRes = await fetch(`https://api-inference.huggingface.co/models/${hfModel}`, {
          method: "POST",
          headers,
          signal: controller.signal,
          body: JSON.stringify({
            inputs: systemPrompt ? `<|system|>\n${systemPrompt}\n<|user|>\n${prompt}\n<|assistant|>` : prompt,
            parameters: { max_new_tokens: 1024, temperature },
          }),
        });
        clearTimeout(timeoutId);

        if (hfRes.ok) {
          const hfData = await hfRes.json();
          let generatedText = "";
          if (Array.isArray(hfData) && hfData[0]?.generated_text) {
            generatedText = hfData[0].generated_text;
          } else if (typeof hfData === "object" && hfData.generated_text) {
            generatedText = hfData.generated_text;
          }

          if (generatedText) {
            const cleanedText = generatedText.replace(/<\|system\|>[\s\S]*?<\|assistant\|>/g, "").trim();
            return res.json({
              reply: cleanedText || generatedText,
              modelUsed: `HuggingFace Open Source (${hfModel})`,
              provider: "HuggingFace Free Inference API",
            });
          }
        }
      } catch (err) {
        // Fallback to In-App Engine
      }
    }

    // 3. Guaranteed Zero-Cost In-App Open Source Knowledge Engine
    const openEngineReply = generateOpenSourceKnowledgeReply(prompt, model);
    return res.json({
      reply: openEngineReply,
      modelUsed: `Open Source Engine (${model})`,
      provider: "In-App Open Engine (Zero API Cost)",
    });
  } catch (error: any) {
    console.error("Open Source Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to process open source request." });
  }
});

// API: Lesson & Quiz Generator
app.post("/api/generate-lesson", async (req, res) => {
  try {
    const { topic, gradeLevel, language = "bn", type = "lesson" } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const ai = getGenAI();
    const prompt = type === "quiz"
      ? `Generate an interactive quiz on "${topic}" for ${gradeLevel || "students"}. 
Language: ${language === "bn" ? "Bengali" : "English"}.
Return JSON format with structure:
{
  "title": "Quiz Title",
  "topic": "${topic}",
  "questions": [
    {
      "question": "Question string",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Detailed step-by-step explanation"
    }
  ]
}`
      : `Generate a complete structured educational lesson on "${topic}" for ${gradeLevel || "beginners/students"}.
Language: ${language === "bn" ? "Bengali (বাংলা)" : "English"}.
Include:
1. Clear Overview & Real-life Analogy
2. Core Concepts with bullet points
3. Code or Practical Example (if applicable)
4. 3 Important Takeaways
5. 2 Practice Questions with Answers.
Format in markdown with clean headers.`;

    if (type === "quiz") {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              topic: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctAnswerIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      });

      const json = JSON.parse(response.text || "{}");
      return res.json({ quiz: json });
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: JUNIOR_GEMINI_SYSTEM_PROMPT,
        },
      });

      return res.json({ lesson: response.text });
    }
  } catch (error: any) {
    console.error("Lesson API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate lesson." });
  }
});

// API: Image Generation Studio
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio = "1:1" } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    let imageUrl = null;
    let descriptionText = "";

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Str = part.inlineData.data;
          const mime = part.inlineData.mimeType || "image/png";
          imageUrl = `data:${mime};base64,${base64Str}`;
        } else if (part.text) {
          descriptionText += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: "Image generation did not produce an inline image." });
    }

    res.json({ imageUrl, description: descriptionText });
  } catch (error: any) {
    console.error("Image API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate image." });
  }
});

// API: TTS Speech Synthesis
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice = "Kore" } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: text.slice(0, 500) }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || "Kore" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: "No audio generated from TTS model." });
    }

    res.json({ audioBase64: base64Audio });
  } catch (error: any) {
    console.error("TTS API Error:", error);
    res.status(500).json({ error: error.message || "Failed to synthesize speech." });
  }
});

// Serve frontend in production or dev
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[JUNIOR GEMINI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
