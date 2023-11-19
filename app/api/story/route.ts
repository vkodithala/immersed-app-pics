import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration } from 'openai-edge'
import { OpenAI } from 'openai';

// Create an OpenAI API 
const model = 'gpt-4'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: `https://personal-aiatl2.openai.azure.com/openai/deployments/${model}`,
  defaultQuery: { 'api-version': '2023-09-15-preview' },
  defaultHeaders: { 'api-key': process.env.OPENAI_API_KEY }
})
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'
 
export async function POST(req: Request) {
  console.log("req")
  // Extract the `messages` from the body of the request
  const { messages } = await req.json()
 
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages
  })
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}