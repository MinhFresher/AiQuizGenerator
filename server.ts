import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Increase limit to allow larger PDF/DOCX base64 strings
app.use(express.json({ limit: '30mb' }));

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-study-studio',
        },
      },
    });
  }
  return aiClient;
}

const PORT = 3000;

// Main endpoint: generates the full Study Set (Test, Flashcards, Study Guide) from uploaded material
app.post('/api/generate-study-set', async (req, res) => {
  try {
    const { fileName, fileType, fileData, customInstructions, generationCount = 10 } = req.body;

    if (!fileData) {
      res.status(400).json({ error: 'File data is required.' });
      return;
    }

    const isAuto = generationCount === 'auto' || generationCount === 'all';
    const targetCount = isAuto ? 30 : Math.min(Math.max(Number(generationCount) || 10, 1), 80);
    const ai = getGeminiClient();
    let contents: any[] = [];
    
    const sizeNote = isAuto
      ? `\nIMPORTANT: Since automatic question extraction is enabled, extract ALL the questions present in the file (up to a maximum limit of 80 to fit the response token window). If there are e.g. 25 questions, extract exactly 25. If there are e.g. 100 questions, extract the first 80. If the file is a textbook chapter/general reading material with no pre-existing questions, generate an appropriate number of questions (between 10 and 30) based on the depth and length of the content.`
      : (targetCount > 20
        ? `\nIMPORTANT: Since the user requested a large number of questions (${targetCount}), keep the explanation fields clear but highly concise (1-2 sentences) to guarantee the entire payload fits within the response limit without being cut off.`
        : '');

    const basePrompt = `You are an elite academic tutor, instructional designer, and test preparation expert.
Your goal is to parse the attached document/text and generate a comprehensive, highly-polished Study Set.

Analyze the uploaded document:
1. IF the document primarily consists of multiple-choice questions (with or without answers listed):
   - Extract those exact questions. Do not make up random questions if there are clear ones present.
   - For any questions that do not have answers specified, solve them accurately using your expert knowledge.
   - Write a detailed, friendly, step-by-step explanation for each correct option explaining why it is correct and why other options are incorrect.
   - Maintain the structure of the questions found. ${isAuto ? "Extract ALL questions present in the document up to 80." : `Extract/generate exactly ${targetCount} questions.`}

2. IF the document is general reading material, notes, slides, or chapters:
   - Identify the core concepts, definitions, formulas, and relationships.
   - Generate a high-quality, comprehensive multiple-choice test consisting of ${isAuto ? "an appropriate number of questions (between 10 and 30 depending on complexity)" : `exactly ${targetCount} questions`} that thoroughly test the reader's comprehension.
   - Each question must have 4 clear, plausible options, one correct answer, and a robust explanation.

3. FOR BOTH CASES:
   - Generate 5 to 10 high-quality Flashcards (front: key concept/question, back: concise definition/answer) for active recall.
   - Generate a beautiful, highly structured Study Guide in Markdown summarizing the core concepts, key vocabulary, and major takeaways from the material. Use headers, bullet points, and highlight bold text for readability.
${sizeNote}

${customInstructions ? `Special User Instructions to follow: "${customInstructions}"` : ''}

Provide your response in strict JSON format matching the schema requested. Ensure all text and markdown are clean and properly escaped.`;

    if (fileType === 'pdf') {
      // Send PDF base64 directly to Gemini as inlineData!
      contents = [
        {
          inlineData: {
            data: fileData, // this is the base64 string
            mimeType: 'application/pdf'
          }
        },
        {
          text: basePrompt
        }
      ];
    } else if (fileType === 'docx') {
      // Extract raw text from docx on the server first
      try {
        const buffer = Buffer.from(fileData, 'base64');
        const result = await mammoth.extractRawText({ buffer });
        const extractedText = result.value;
        
        if (!extractedText || extractedText.trim().length === 0) {
          throw new Error('Extracted text from docx was empty.');
        }

        contents = [
          {
            text: `Here is the extracted text from the Word document "${fileName}":\n\n${extractedText}`
          },
          {
            text: basePrompt
          }
        ];
      } catch (mammothErr: any) {
        console.error('Mammoth extraction failed:', mammothErr);
        res.status(500).json({ error: `Failed to extract text from DOCX file: ${mammothErr.message}` });
        return;
      }
    } else {
      // Plain text, markdown, or copy-pasted text
      contents = [
        {
          text: `Here is the user-supplied study content from "${fileName || 'Input Text'}":\n\n${fileData}`
        },
        {
          text: basePrompt
        }
      ];
    }

    showLog(`Generating study set for "${fileName}" (type: ${fileType}) using gemini-3.5-flash...`);

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction: 'You are an elite, modern academic AI. You analyze study material with absolute precision and generate world-class assessments, flashcards, and study guides. You always output 100% valid JSON conforming to the requested schema. Do not output markdown codeblocks inside JSON string fields.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Descriptive title for this study set/test based on the content (e.g., "Intro to Quantum Mechanics - Quiz & Study Guide")' },
            description: { type: Type.STRING, description: 'A brief, encouraging overview of what this test and study material covers (1-2 sentences)' },
            questions: {
              type: Type.ARRAY,
              description: isAuto 
                ? 'List of multiple choice questions extracted or generated. Since auto-detect is enabled, extract ALL pre-existing questions in the file (up to 80), or generate a comprehensive set of 10-30 questions if none are in the file.'
                : `List of multiple choice questions extracted or generated from the material (exactly ${targetCount} items)`,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: 'The question text. Be clear, unambiguous, and rigorous.' },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Exactly 4 multiple-choice options.'
                  },
                  correctAnswerIndex: { type: Type.INTEGER, description: 'Zero-based index of the correct option (0, 1, 2, or 3).' },
                  explanation: { type: Type.STRING, description: 'Step-by-step friendly explanation of why this answer is correct and why the others are wrong.' }
                },
                required: ['text', 'options', 'correctAnswerIndex', 'explanation']
              }
            },
            flashcards: {
              type: Type.ARRAY,
              description: 'List of active-recall flashcards (5 to 10 items)',
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING, description: 'The term, key concept, formula, or active recall question on the front.' },
                  back: { type: Type.STRING, description: 'The short, concise definition, answer, or memory trick on the back.' }
                },
                required: ['front', 'back']
              }
            },
            studyGuide: { type: Type.STRING, description: 'A highly organized and comprehensive study summary formatted in beautiful Markdown.' }
          },
          required: ['title', 'description', 'questions', 'flashcards', 'studyGuide']
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    res.json(JSON.parse(responseText));
  } catch (error: any) {
    console.error('Generate Study Set Error:', error);
    res.status(500).json({ error: error.message || 'An error occurred during study set generation' });
  }
});

// Secondary endpoint: generate additional questions for a specific topic or current study set
app.post('/api/generate-more-questions', async (req, res) => {
  try {
    const { title, studyGuide, count = 5 } = req.body;
    
    if (!studyGuide) {
      res.status(400).json({ error: 'Study guide text is required to generate context-specific questions.' });
      return;
    }

    const ai = getGeminiClient();
    const contents = `Based on the following Study Guide titled "${title || 'Study Material'}", generate exactly ${count} NEW and UNIQUE multiple-choice questions.
Ensure they do not duplicate common, obvious facts, but instead test deeper conceptual understanding.
Provide each question with exactly 4 options, a correct answer index, and a comprehensive explanation.

Study Guide Context:
${studyGuide}

Response must be structured JSON.`;

    showLog(`Generating ${count} more questions for "${title}"...`);

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ['text', 'options', 'correctAnswerIndex', 'explanation']
              }
            }
          },
          required: ['questions']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error('Failed to get questions from Gemini.');
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Generate More Questions Error:', error);
    res.status(500).json({ error: error.message || 'An error occurred generating extra questions.' });
  }
});

// Simple logging helper
function showLog(msg: string) {
  console.log(`[PrepAI Studio] ${new Date().toISOString()} - ${msg}`);
}

// Serve Vite dev server or production static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    
    app.use(vite.middlewares);
    
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.use('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PrepAI Studio] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
