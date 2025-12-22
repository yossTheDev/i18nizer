import { GoogleGenAI } from "@google/genai";
import { InferenceClient } from "@huggingface/inference";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export type Provider = "gemini" | "huggingface";

const CONFIG_FILE = path.join(os.homedir(), ".18nizer", "api-keys.json");

let GEMINI_API_KEY = "";
let HUGGING_FACE_API_KEY = "";

if (fs.existsSync(CONFIG_FILE)) {
    try {
        const keys = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
        GEMINI_API_KEY = keys.gemini || "";
        HUGGING_FACE_API_KEY = keys.huggingface || "";
    } catch (error) {
        console.error("❌ Error reading API keys:", error);
    }
} else {
    console.warn(`⚠️ API keys file not found: ${CONFIG_FILE}`);
}

const gemini = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const hfClient = new InferenceClient(HUGGING_FACE_API_KEY);

export async function generateTranslations(
    prompt: string,
    provider: Provider = "huggingface"
) {
    if (provider === "gemini") {
        if (!GEMINI_API_KEY) {
            throw new Error("Gemini API key is not set.");
        }

        console.log("🤖 Using Google Gemini...");

        const result = await gemini.models.generateContent({
            contents: prompt,
            model: "gemini-2.5-flash",
        });
        return result.text;
    }

    if (provider === "huggingface") {
        if (!HUGGING_FACE_API_KEY) {
            throw new Error("Hugging Face API key is not set.");
        }

        console.log("🤖 Using Hugging Face (DeepSeek-V3.2)...");
        try {
            const chatCompletion = await hfClient.chatCompletion({
                messages: [
                    {
                        content: prompt,
                        role: "user",
                    },
                ],
                model: "deepseek-ai/DeepSeek-V3.2",
            });

            const generatedText =
                chatCompletion.choices?.[0]?.message?.content || chatCompletion.output_text || "";

            return generatedText as string;
        } catch (error) {
            console.error("❌ Error calling Hugging Face:", error);
            return "";
        }
    }

    throw new Error("Provider not supported");
}
