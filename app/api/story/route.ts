import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration } from 'openai-edge'
import { OpenAI } from 'openai';

// Create an OpenAI API 
const model = 'gpt-4'

const openai = new OpenAI({
  baseURL: `https://oai.hconeai.com/openai/deployments/${model}`,
  defaultHeaders: {
    "Helicone-Auth": `Bearer sk-helicone-a5e6uvq-ksteaki-racq5ba-y3sryri`,
    "Helicone-OpenAI-API-Base": "https://personal-aiatl3.openai.azure.com",
    "api-key": process.env.OPENAI_API_KEY2,
  },
  defaultQuery: { "api-version": "2023-09-15-preview" },
});


const openai2 = new OpenAI({
  baseURL: `https://oai.hconeai.com/openai/deployments/${model}`,
  defaultHeaders: {
    "Helicone-Auth": `Bearer sk-helicone-a5e6uvq-ksteaki-racq5ba-y3sryri`,
    "Helicone-OpenAI-API-Base": "https://personal-aiatl2.openai.azure.com",
    "api-key": process.env.OPENAI_API_KEY,
  },
  defaultQuery: { "api-version": "2023-09-15-preview" },
});
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'
 
export async function POST(req: Request) {
  console.log("req")
  // Extract the `messages` from the body of the request
  const { messages } = await req.json()
 
  let client = Math.random() < 0.5 ? openai : openai2;

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await client.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages
  })
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}