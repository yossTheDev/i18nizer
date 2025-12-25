import { GoogleGenAI } from "@google/genai";
import { InferenceClient as HFClient } from "@huggingface/inference";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { OpenAI } from "openai";

export type Provider = "gemini" | "huggingface" | "openai";

const CONFIG_FILE = path.join(os.homedir(), ".i18nizer", "api-keys.json");

interface ApiKeys {
    gemini?: string;
    huggingface?: string;
    openai?: string;
}

function loadApiKeys(): ApiKeys {
    if (!fs.existsSync(CONFIG_FILE)) {
        console.warn(`⚠️ API keys file not found: ${CONFIG_FILE}`);
        return {};
    }

    try {
        const keys = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8")) as ApiKeys;
        return keys;
    } catch (error) {
        console.error("❌ Error reading API keys:", error);
        return {};
    }
}

export async function generateTranslations(
    prompt: string,
    provider: Provider = "huggingface"
): Promise<string | undefined> {
    const keys = loadApiKeys();

    switch (provider) {
        case "gemini": {
            const apiKey = keys.gemini;
            if (!apiKey) throw new Error("Gemini API key is not set.");
            console.log("🤖 Using Google Gemini...");
            const gemini = new GoogleGenAI({ apiKey });
            const result = await gemini.models.generateContent({
                contents: prompt,
                model: "gemini-2.5-flash",
            });
            return result.text;
        }

        case "huggingface": {
            const apiKey = keys.huggingface;
            if (!apiKey) throw new Error("Hugging Face API key is not set.");
            console.log("🤖 Using Hugging Face (DeepSeek-V3.2)...");
            const hfClient = new HFClient(apiKey);
            try {
                const chatCompletion = await hfClient.chatCompletion({
                    messages: [{ content: prompt, role: "user" }],
                    model: "deepseek-ai/DeepSeek-V3.2",
                });

                return chatCompletion.choices?.[0]?.message?.content || (typeof chatCompletion.output_text === "string" ? chatCompletion.output_text : undefined);
            } catch (error) {
                console.error("❌ Error calling Hugging Face:", error);
                return undefined;
            }
        }

        case "openai": {
            const apiKey = keys.openai;
            if (!apiKey) throw new Error("OpenAI API key is not set.");
            console.log("🤖 Using OpenAI...");
            const openai = new OpenAI({ apiKey });
            try {
                const completion = await openai.chat.completions.create({
                    messages: [{ content: prompt, role: "user" }],
                    model: "gpt-4o-mini",
                });
                return completion.choices?.[0]?.message?.content || "";
            } catch (error) {
                console.error("❌ Error calling OpenAI:", error);
                return "";
            }
        }

        default: {
            throw new Error("Provider not supported");
        }
    }
}
