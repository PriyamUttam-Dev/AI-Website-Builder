import dotenv from "dotenv";
dotenv.config();

console.log("API Key loaded:", process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "Yes (length: " + process.env.GOOGLE_GENERATIVE_AI_API_KEY.length + ")" : "No");

import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import {basePrompt as nodeBasePrompt} from "./defaults/node";
import {basePrompt as reactBasePrompt} from "./defaults/react";
import cors from "cors";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
});

function sendLLMError(res: express.Response, err: unknown) {
    const anyErr = err as any;
    const status: number | undefined = typeof anyErr?.status === "number" ? anyErr.status : undefined;
    const statusText: string | undefined = typeof anyErr?.statusText === "string" ? anyErr.statusText : undefined;
    const message: string =
        typeof anyErr?.message === "string" ? anyErr.message : "LLM request failed";

    const httpStatus = status && status >= 400 && status <= 599 ? status : 500;

    res.status(httpStatus).json({
        message,
        status: status ?? httpStatus,
        statusText,
    });
}
const app = express();
app.use(cors())
app.use(express.json())

// Simple in-memory cache for template responses
const templateCache = new Map<string, { answer: string; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

function getCachedTemplate(prompt: string): string | null {
    const cached = templateCache.get(prompt);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
        templateCache.delete(prompt);
        return null;
    }
    return cached.answer;
}

function setCachedTemplate(prompt: string, answer: string): void {
    templateCache.set(prompt, { answer, timestamp: Date.now() });
}

app.post("/template", async (req, res) => {
    try {
        const prompt = req.body.prompt;
        
        // Check cache first
        const cachedAnswer = getCachedTemplate(prompt);
        if (cachedAnswer) {
            console.log(`Cache hit for prompt: "${prompt.substring(0, 50)}..." -> ${cachedAnswer}`);
            if (cachedAnswer === "react") {
                res.json({
                    prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                    uiPrompts: [reactBasePrompt]
                });
                return;
            }
            if (cachedAnswer === "node") {
                res.json({
                    prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                    uiPrompts: [nodeBasePrompt]
                });
                return;
            }
        }
        
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                maxOutputTokens: 200,
            },
            systemInstruction: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
        });

        const response = await result.response;
        const answer = response.text().trim().toLowerCase(); // react or node
        
        // Cache the result
        if (answer === "react" || answer === "node") {
            setCachedTemplate(prompt, answer);
        }

        if (answer == "react") {
            res.json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [reactBasePrompt]
            })
            return;
        }

        if (answer === "node") {
            res.json({
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [nodeBasePrompt]
            })
            return;
        }

        res.status(403).json({message: "You cant access this"})
        return;
    } catch (err) {
        console.error(err);
        sendLLMError(res, err);
    }

})

app.post("/chat", async (req, res) => {
    try {
        const messages = req.body.messages;
        
        const result = await model.generateContent({
            contents: messages.map((m: any) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            })),
            generationConfig: {
                maxOutputTokens: 8000,
            },
            systemInstruction: getSystemPrompt()
        });

        const response = await result.response;
        const text = response.text();

        console.log(text);

        res.json({
            response: text
        });
    } catch (err) {
        console.error(err);
        sendLLMError(res, err);
    }
})

const port = Number(process.env.PORT) || 3000;
app.listen(port);
