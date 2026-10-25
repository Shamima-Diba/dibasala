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

// API: Lesson & Quiz Generator
app.post("/api/generate-lesson", async (req, res) => {
  try {
    const { topic, gradeLevel, language = "bn", type = "lesson" } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const ai = getGenAI();
    let prompt = "";
    if (type === "quiz") {
      prompt = `Generate an interactive quiz on "${topic}" for ${gradeLevel || "students"}. 
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
}`;
    } else if (type === "research") {
      prompt = `Generate an in-depth Academic Research & Educational STEM Breakdown for "${topic}" at level ${gradeLevel || "HSC / University"}.
Language: ${language === "bn" ? "Bengali (বাংলা)" : "English"}.
Include:
1. **Research Overview & Significance (গবেষণার প্রেক্ষাপট ও গুরুত্ব)**
2. **Key Research Questions & Hypotheses (মূল প্রশ্ন ও গবেষণার ধারণা)**
3. **Core Scientific & Theoretical Methodology (বৈজ্ঞানিক তত্ত্ব ও কার্যপ্রণালী)**
4. **Current Global Trends & Real-world Applications (আধুনিক বিশ্বব্যাপী ব্যবহার ও প্রয়োগ)**
5. **Thesis / Paper Outline & Future Scope (থিসিস রূপরেখা ও ভবিষ্যৎ সম্ভাবনা)**
6. **Key Research Terminology Glossary (গুরুত্বপূর্ণ বৈজ্ঞানিক শব্দকোষ)**
Format cleanly with Markdown headers and bullet points.`;
    } else {
      prompt = `Generate a complete structured educational lesson on "${topic}" for ${gradeLevel || "beginners/students"}.
Language: ${language === "bn" ? "Bengali (বাংলা)" : "English"}.
Include:
1. Clear Overview & Real-life Analogy
2. Core Concepts with bullet points
3. Code or Practical Example (if applicable)
4. 3 Important Takeaways
5. 2 Practice Questions with Answers.
Format in markdown with clean headers.`;
    }

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

// Helper: Fallback SVG Educational Illustration Generator
function generateFallbackSvg(prompt: string, aspectRatio: string = "1:1"): string {
  let width = 800;
  let height = 800;
  if (aspectRatio === "16:9") { width = 1200; height = 675; }
  else if (aspectRatio === "4:3") { width = 1000; height = 750; }
  else if (aspectRatio === "9:16") { width = 675; height = 1200; }

  const cleanTitle = prompt.replace(/[<>&"]/g, "").slice(0, 80);
  const words = cleanTitle.split(" ");
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A"/>
        <stop offset="50%" stop-color="#1E1B4B"/>
        <stop offset="100%" stop-color="#0284C7"/>
      </linearGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38BDF8"/>
        <stop offset="50%" stop-color="#C084FC"/>
        <stop offset="100%" stop-color="#F472B6"/>
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="20" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    
    <rect width="100%" height="100%" fill="url(#bgGrad)"/>
    
    <circle cx="${width * 0.2}" cy="${height * 0.3}" r="${width * 0.22}" fill="#38BDF8" opacity="0.2" filter="url(#glow)"/>
    <circle cx="${width * 0.8}" cy="${height * 0.7}" r="${width * 0.28}" fill="#C084FC" opacity="0.2" filter="url(#glow)"/>
    <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${width * 0.15}" fill="#F59E0B" opacity="0.15" filter="url(#glow)"/>

    <g opacity="0.08" stroke="#FFFFFF" stroke-width="1.5">
      <path d="M 0,${height*0.25} L ${width},${height*0.25} M 0,${height*0.5} L ${width},${height*0.5} M 0,${height*0.75} L ${width},${height*0.75}" />
      <path d="M ${width*0.25},0 L ${width*0.25},${height} M ${width*0.5},0 L ${width*0.5},${height} M ${width*0.75},0 L ${width*0.75},${height}" />
    </g>

    <rect x="${width * 0.08}" y="${height * 0.12}" width="${width * 0.84}" height="${height * 0.76}" rx="24" fill="#030712" fill-opacity="0.65" stroke="url(#textGrad)" stroke-width="2.5"/>

    <rect x="${width * 0.12}" y="${height * 0.18}" width="240" height="36" rx="18" fill="url(#textGrad)" fill-opacity="0.2" stroke="#38BDF8" stroke-opacity="0.5"/>
    <text x="${width * 0.12 + 120}" y="${height * 0.18 + 23}" font-family="system-ui, -apple-system, sans-serif" font-weight="bold" font-size="13" fill="#38BDF8" text-anchor="middle">✨ MATI AI EDUCATIONAL ART</text>

    <text x="${width * 0.12}" y="${height * 0.38}" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="${Math.min(width * 0.04, 30)}" fill="#FFFFFF">
      ${line1}
    </text>
    ${line2 ? `<text x="${width * 0.12}" y="${height * 0.46}" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="${Math.min(width * 0.04, 30)}" fill="url(#textGrad)">${line2}</text>` : ''}

    <g transform="translate(${width * 0.5 - 30}, ${height * 0.58}) scale(1.3)">
      <path d="M24 0L29.5 18.5L48 24L29.5 29.5L24 48L18.5 29.5L0 24L18.5 18.5L24 0Z" fill="url(#textGrad)"/>
    </g>

    <text x="${width * 0.5}" y="${height * 0.82}" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#9CA3AF" text-anchor="middle">
      JUNIOR GEMINI AI STUDIO • EDUCATIONAL VISUAL LAB
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// API: Image Generation Studio
app.post("/api/generate-image", async (req, res) => {
  const { prompt, aspectRatio = "1:1" } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
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

    if (imageUrl) {
      return res.json({ imageUrl, description: descriptionText, source: "gemini-ai" });
    }

    // Fallback if no inline image was generated
    const fallbackUrl = generateFallbackSvg(prompt, aspectRatio);
    return res.json({
      imageUrl: fallbackUrl,
      description: "Generated Educational Visual Illustration for prompt.",
      source: "fallback-svg",
    });
  } catch (error: any) {
    console.warn("Image API Notice (Quota or API limits reached, using fallback artwork):", error.message || error);
    // Return high quality fallback SVG illustration so UI never breaks
    const fallbackUrl = generateFallbackSvg(prompt, aspectRatio);
    return res.json({
      imageUrl: fallbackUrl,
      description: "Generated Educational Visual Illustration for prompt.",
      source: "fallback-svg",
    });
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

// API: Legal Document & Policy Generator
app.post("/api/generate-legal-doc", async (req, res) => {
  try {
    const { docType, appName, entityName, appCategory, language = "bn", extraDetails } = req.body;

    if (!docType || !appName) {
      return res.status(400).json({ error: "docType and appName are required" });
    }

    const ai = getGenAI();
    const isBn = language === "bn";

    let promptText = "";
    if (docType === "tos") {
      promptText = `Draft a comprehensive, legal Terms of Service (ব্যবহারের শর্তাবলী) document for the application/website named "${appName}".
Entity / Owner / Company: "${entityName || "The Developer"}".
App Category / Features: "${appCategory || "Software & Web Application"}".
Language: ${isBn ? "Bengali (বাংলা)" : "English"}.
Extra Context: ${extraDetails || "Standard digital software provisions"}.

Include standard sections:
1. Introduction & Acceptance of Terms
2. Intellectual Property & Ownership Rights (Declaring that all source code, design, logos, and features belong exclusively to ${entityName || appName})
3. User Conduct & Acceptable Use Rules
4. Limitation of Liability & Disclaimer of Warranties
5. Termination of Service
6. Governing Law (Mentioning Bangladesh / Applicable Local Laws)`;
    } else if (docType === "privacy") {
      promptText = `Draft a complete Privacy Policy (গোপনীয়তা নীতি) document for the application/website named "${appName}".
Entity / Owner: "${entityName || "The Developer"}".
Data Collected: "${appCategory || "Basic User Account Data, Cookies, Usage Analytics"}".
Language: ${isBn ? "Bengali (বাংলা)" : "English"}.

Include standard sections:
1. Information We Collect (Personal data, device logs, usage)
2. How We Use Your Information (Service provision, security, updates)
3. Data Storage, Encryption & Security Measures
4. Third-Party Services & Analytics Disclosure
5. User Rights (Right to access, modify, or delete data)
6. Cookies Policy & Contact Details for Data Inquiries`;
    } else if (docType === "nda") {
      promptText = `Draft a formal Non-Disclosure Agreement (এনডিএ - তথ্য গোপনীয়তা চুক্তি) between "${entityName || "Disclosing Party / App Owner"}" and "Receiving Party / Developer / Contractor" regarding the app project "${appName}".
Language: ${isBn ? "Bengali (বাংলা)" : "English"}.

Include:
1. Definition of Confidential Information (Source code, algorithms, UI mockups, business logic)
2. Non-Disclosure & Non-Use Obligations
3. Exclusions from Confidentiality
4. Term & Duration of Obligations
5. Consequences of Breach
6. Signatures Placeholder`;
    } else if (docType === "ip_assignment") {
      promptText = `Draft a Copyright & IP Assignment Agreement (মেধা সম্পত্তি ও সোর্স কোড হস্তান্তর চুক্তি) where a freelance developer or contractor transfers 100% of the Intellectual Property, Source Code, Patents, and Copyrights for "${appName}" to "${entityName || "The App Owner"}".
Language: ${isBn ? "Bengali (বাংলা)" : "English"}.

Include:
1. Transfer of Rights (Complete assignment of source code, designs, algorithms)
2. Consideration & Payment Confirmation
3. Representation & Warranties (Developer guarantees code is original and non-infringing)
4. Waiver of Moral Rights
5. Governing Law & Signatures`;
    } else {
      promptText = `Draft a legal notice and Copyright Header Notice (কপিরাইট ও স্বত্বাধিকার নির্দেশিকা) to embed in the source code files and footer of "${appName}" owned by "${entityName || "The Owner"}". Language: ${isBn ? "Bengali" : "English"}.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are an expert technology lawyer and software intellectual property specialist in Bangladesh and international cyber law. Write clear, formal, professionally structured legal documents.",
      },
    });

    res.json({ document: response.text });
  } catch (error: any) {
    console.error("Legal Doc API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate legal document." });
  }
});

// API: AI Video Storyboard & Script Generator
app.post("/api/generate-video-storyboard", async (req, res) => {
  try {
    const { videoPrompt, style = "Cinematic 4K", language = "bn" } = req.body;
    if (!videoPrompt) {
      return res.status(400).json({ error: "Video prompt is required" });
    }

    const ai = getGenAI();
    const isBn = language === "bn";

    const promptText = `Create an AI Video Storyboard and Editor Script for the theme: "${videoPrompt}".
Style: "${style}".
Language: ${isBn ? "Bengali (বাংলা)" : "English"}.

Return JSON format with:
{
  "title": "Short catchy title",
  "synopsis": "Brief overview",
  "scenes": [
    {
      "sceneNumber": 1,
      "visualDescription": "Detailed visual description of what happens in scene 1",
      "subtitleText": "Bangla subtitle text to overlay on video",
      "cameraMotion": "Pan Right / Zoom In / Drone Shot",
      "audioMood": "Energetic / Sci-Fi Synth / Cinematic Folk",
      "durationSec": 5
    },
    {
      "sceneNumber": 2,
      "visualDescription": "Detailed visual description of scene 2",
      "subtitleText": "Subtitle text for scene 2",
      "cameraMotion": "Slow Motion Zoom / Orbit 360",
      "audioMood": "Inspirational",
      "durationSec": 5
    },
    {
      "sceneNumber": 3,
      "visualDescription": "Detailed visual description of scene 3",
      "subtitleText": "Subtitle text for scene 3",
      "cameraMotion": "Aerial Flyover / Fade Out",
      "audioMood": "Triumphant",
      "durationSec": 5
    }
  ],
  "editingTips": ["Tip 1 on color grading", "Tip 2 on audio sync", "Tip 3 on transition effects"]
}
ONLY return raw valid JSON without markdown formatting backticks if possible, or plain JSON string.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are an expert AI Video Producer, Director, and Video Editor. You create high quality video storyboards and scripts in Bengali.",
      },
    });

    let rawText = response.text || "{}";
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(rawText);
      return res.json(parsed);
    } catch (e) {
      return res.json({
        title: videoPrompt,
        synopsis: isBn ? "এআই ভিডিও দৃশ্য তৈরি সম্পন্ন হয়েছে।" : "AI Video Storyboard generated.",
        scenes: [
          {
            sceneNumber: 1,
            visualDescription: isBn ? `দৃশ্য ১: ${videoPrompt} এর প্রাথমিক সিনেম্যাটিক শট` : `Scene 1: Cinematic intro of ${videoPrompt}`,
            subtitleText: isBn ? "স্বাগতম আমাদের নতুন এআই ভিডিও ভিজ্যুয়াল এডিটর-এ!" : "Welcome to our AI Video Visual Editor!",
            cameraMotion: "Cinematic Slow Zoom In",
            audioMood: "Cinematic Orchestral",
            durationSec: 5
          },
          {
            sceneNumber: 2,
            visualDescription: isBn ? `দৃশ্য ২: মেধা ও উদ্ভাবনের প্রধান ফোকাস শট` : `Scene 2: Core innovation focus shot`,
            subtitleText: isBn ? "কুইজ জয়ীদের জন্য বিশেষ এআই ভিডিও এডিটিং সুবর্ণ সুযোগ।" : "Special AI Video Editing unlocked for quiz champions.",
            cameraMotion: "Pan Right & Tilt Up",
            audioMood: "Energetic Beat",
            durationSec: 5
          },
          {
            sceneNumber: 3,
            visualDescription: isBn ? `দৃশ্য ৩: ভবিষ্যৎ সমৃদ্ধ বাংলাদেশের চূড়ান্ত দৃশ্য` : `Scene 3: Inspiring final climax shot`,
            subtitleText: isBn ? "আজই নিজের চিন্তাকে এআই ভিডিওতে রূপান্তর করো!" : "Transform your imagination into AI video today!",
            cameraMotion: "Drone Aerial Lift",
            audioMood: "Triumphant Climax",
            durationSec: 5
          }
        ],
        editingTips: [
          isBn ? "কালার গ্রেডিং: এডিটর থেকে 'গোল্ডেন আওয়ার' নাইট ভিব সিলেক্ট করুন।" : "Color Grading: Select Golden Hour vibe.",
          isBn ? "সাউন্ড সিন্ক্রোনাইজেশন: টাইটেল সাবটাইটেলের সাথে ট্রানজিশন ম্যাচ করুন।" : "Sync transition with subtitle text."
        ]
      });
    }
  } catch (error: any) {
    console.error("Video Storyboard API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate video storyboard." });
  }
});

// API: Grant Pitch, Funding Proposal & School Outreach Generator
app.post("/api/generate-pitch", async (req, res) => {
  try {
    const { pitchType, organizationName, appTitle, targetAudience, language = "bn", specialRequest } = req.body;

    const ai = getGenAI();
    const isBn = language === "bn";

    let promptText = "";
    if (pitchType === "google_for_startups") {
      promptText = `Draft a formal application proposal for "Google for Startups / Google Cloud Credits Program" for the AI learning platform "${appTitle || "Mati AI"}".
Organization/Founder: "${organizationName || "Mati AI Foundation"}".
Target Audience: "${targetAudience || "Students and youth in rural Bangladesh"}".
Language: ${isBn ? "Bengali" : "English"}.
Context: ${specialRequest || "Empowering offline & low-bandwidth rural AI literacy in Bangladesh"}.

Include standard Google Grant Sections:
1. Executive Summary & Problem Statement (Digital divide in rural Bangladesh)
2. Solution & Technical Architecture (Built on Gemini API, low-latency, Bengali natural language)
3. Social Impact & Metrics (Targeting 100,000+ students across schools and colleges)
4. Resource Request (Google Cloud Credits, Technical Mentorship, AI Studio partnership)
5. Sustainability & Future Roadmap`;
    } else if (pitchType === "ict_division_grant") {
      promptText = `Draft an official Innovation Grant Application to "ICT Division Bangladesh (iDEA Project / Startup Bangladesh)" for "${appTitle || "Mati AI (মাটি এআই)"}".
Applicant: "${organizationName || "Mati AI Team"}".
Language: ${isBn ? "Bengali (বাংলা)" : "English"}.

Include:
১. প্রকল্পের পটভূমি ও সামাজিক গুরুত্ব (Project Background & Rural AI Need)
২. প্রযুক্তিগত উদ্ভাবন (Technical Innovation using Gemini AI & Bengali Localization)
৩. বাস্তবায়ন পরিকল্পনা ও বাজেট আবেদন (Implementation Plan & Grant Funding Breakdown)
৪. জাতীয় উন্নয়ন ও ভিশন ২০৪১ এ ভূমিকা (Role in Smart Bangladesh / Vision 2041)
৫. প্রত্যাশিত ফলাফল ও পরিমাপক (Expected Outcomes & Student Reach Metrics)`;
    } else if (pitchType === "school_outreach_letter") {
      promptText = `Draft a professional, formal Proposal Letter to High School Principals & ICT Teachers in Bangladesh requesting permission to conduct a free "Mati AI Literacy Workshop" for students.
App Name: "${appTitle || "Mati AI (মাটি এআই)"}".
Sender: "${organizationName || "Mati AI Education Ambassador Team"}".
Language: ${isBn ? "Bengali (বাংলা)" : "English"}.

Include:
- Formal salutation to School Authority
- Introduction to Mati AI (Free, accessible AI learning platform)
- Benefits for 8th-12th grade students (Coding, Study Assistance, IP/Patent awareness)
- Proposed 45-minute workshop schedule (Zero cost to school)
- Call to action & contact details placeholder`;
    } else if (pitchType === "telecom_csr_sponsorship") {
      promptText = `Draft a CSR & Digital Inclusion Sponsorship Proposal to Telecommunication Operators (Grameenphone / Robi / Banglalink) or Corporate Sponsors for "${appTitle || "Mati AI"}".
Language: ${isBn ? "Bengali (বাংলা)" : "English"}.

Include:
1. Executive Summary & Co-Branding Opportunity
2. Zero-Rating / Data-Free Access Request (Requesting 0-rated data for Mati AI domain for rural students)
3. Brand Visibility & Social Impact Metrics
4. Sponsorship Tiers (Device distribution, local server hosting, student competitions)`;
    } else {
      promptText = `Draft a 45-minute Interactive AI Workshop Slide-by-Slide Outline and Script for School Teachers & Campus Ambassadors to present "${appTitle || "Mati AI"}" to students. Language: ${isBn ? "Bengali" : "English"}.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are an expert startup pitch consultant, educational outreach director, and grant proposal writer specializing in Bangladesh technology ecosystem and social impact projects.",
      },
    });

    res.json({ pitch: response.text });
  } catch (error: any) {
    console.error("Pitch API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate pitch proposal." });
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
