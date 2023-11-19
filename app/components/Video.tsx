"use client"
import { useEffect, useState, useRef } from 'react'
import { motion, useAnimation, useScroll } from 'framer-motion'
import OpenAI from "openai"
import { getInitial } from '../lib/conversation'
import { useChat } from 'ai/react';
import React from 'react'
import { Message } from 'ai'

export default function Video() {
    const initialized = useRef(false)

    const { messages, input, handleInputChange, handleSubmit, append } = useChat({
        api: '/api/story',
        initialMessages: getInitial(),
        onResponse(response) {
            console.log(response)
        }
    });

    const getStory = () => {
        console.log(messages)
        let lastMessage = messages.filter((message) => message.role === "assistant").at(-1) as Message
        try {
            let parsed = JSON.parse(lastMessage.content)
            return parsed.story
        } catch {
            try {
                let parsed = JSON.parse(lastMessage.content + '"}')
                return parsed.story || "..."
            } catch {
                return "..."
            }
        }
    }

    const getOptions = () => {
        let lastMessage = messages.filter((message) => message.role === "assistant").at(-1) as Message
        try {
            let parsed = JSON.parse(lastMessage.content)
            return parsed.options
        } catch {
            console.log(lastMessage.content)
            try {
                let parsed = JSON.parse(lastMessage.content + '"}')
                return parsed.options || []
            } catch {
                return []
            }
        }
    }

    const chooseOption = async (option) => {
        append({
            role: "user",
            content: option
        })
    }

    return (
        <div className="grid place-items-center h-screen">
            <div className="w-3/4">
                <p className="mb-2 font-mono font-bold text-3xl underline">IMMERSED</p>
                <div className="mt-3 rounded-md overflow-y-auto">
                    <p className="font-mono">
                        { getStory() }
                    </p>
                </div>
                <br />
                <p className="font-mono font-semibold">What will you do next?</p>
                <div className="mt-5 grid gap-x-8 grid-cols-3">
                    {
                        getOptions().map((option, index) => {
                            return (
                                <motion.a onClick={() => { chooseOption(option) }} key={index} whileHover={{ scale: 1.1, backgroundColor: 'lightgray' }} whileTap={{ scale: 0.8 }} className="bg-slate-200 rounded-md p-3">
                                    <p className="font-mono font-semibold text-slate-800">{option}</p>
                                </motion.a>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

