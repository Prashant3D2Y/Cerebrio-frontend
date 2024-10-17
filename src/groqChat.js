import Groq from 'groq-sdk';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main(content) {
    return getGroqChatCompletion(content);
}

export async function getGroqChatCompletion(content) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: content,
            },
        ],
        model: "llama3-8b-8192",
    });
}
