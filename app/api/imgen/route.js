import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.DALLE_API_KEY
});

export async function POST(req) {
    let { prompt } = await req.json();
    const image = await openai.images.generate({ model: "dall-e-3", prompt, quality: "standard" });
    console.log(image.data[0].url);
    return new NextResponse(image.data[0].url)
}