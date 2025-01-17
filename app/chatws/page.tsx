"use client";
import "regenerator-runtime/runtime";

import Link from "next/link";
import Image from "next/image";

import { ChangeEvent, useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import useWebSocket from "react-use-websocket";

import ChatSection from "@component/chat/ChatSection";

import chatStyle from "@style/chat.module.css";
import layoutStyle from "@style/layout.module.css";
import headerStyle from "@style/header.module.css";

export default function Chat() {
    const [messageText, setMessageText] = useState("");
    const [chatHistory, setChatHistory] = useState<{
        role: "user" | "assistant",
        content: string
    }[]>([]);
    const [chatReady, setChatReady] = useState<boolean>(true);
    const {sendJsonMessage} = useWebSocket("ws://localhost:8000/ws", {
        retryOnError: true,
        onMessage: (message) => {
            let dataJson = JSON.parse(message.data);
            if (Object.keys(dataJson).includes("content")) {
                let tempChatHistory = chatHistory;
                chatHistory[chatHistory.length - 1].content += dataJson["content"];
                setChatHistory((tempChatHistory));
            } else {
                setChatReady(true);
            }
        }
    });
    const {
        transcript,
        listening,
        resetTranscript
    } = useSpeechRecognition();
    // Get chat history
    useEffect(() => {
        (async () => {
            const checkKeyFetch = await fetch("http://localhost:8000/checkUserID", {
                method: "POST",
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    key: localStorage.getItem("key")
                })
            });
            if (checkKeyFetch.status == 400 || checkKeyFetch.status == 422) {
                const responseKey = await fetch("http://localhost:8000/generateUserID");
                const data = await responseKey.json();
                localStorage.setItem("key", data.key);
            } else if (checkKeyFetch.status == 200) {
                const chatHistoryFetch = await fetch("http://localhost:8000/getChatHistory", {
                    method: "POST",
                    cache: "no-store",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        key: localStorage.getItem("key")
                    })
                });
                setChatHistory(await chatHistoryFetch.json());
            }
        })();
    }, []);

    // Speech to text from browser
    useEffect(() => {
        if (listening && messageText != transcript) {
            setMessageText(transcript);
        }
    }, [listening, messageText, transcript]);

    // Handle speech to text
    async function handleToggleTranscript() {
        switch (listening) {
            case true:
                await SpeechRecognition.stopListening();
                break;
            case false:
                resetTranscript();
                await SpeechRecognition.startListening();
                break;
        }
    }

    function handleMessageInputChange(e: ChangeEvent<HTMLInputElement>) {
        setMessageText(e.target.value);
    }

    async function handleSendMessage() {
        const userChatMessage = messageText;
        if (chatReady) {
            setMessageText("");
            setChatHistory((chatHistory) => [
                ...chatHistory,
                {role: "user", content: userChatMessage},
                {role: "assistant", content: ""}
            ]);
            sendJsonMessage({
                key: localStorage.getItem("key"),
                command: "generateChat",
                message: userChatMessage,
            });
            setChatReady(false);
        }
    }

    return (
        <div className={layoutStyle.mainContainer}>
            <div className={layoutStyle.headerContainer}>
                <Link href={"/chat"} className={headerStyle.changeModeButton}>
                    <Image src={"/logo.svg"} alt={"logo"} fill={true}/>
                </Link>
                <Link href={"/"} className={headerStyle.shootButton}/>
                <button onClick={handleToggleTranscript} className={chatStyle.sendButton}>
                    {listening ?
                        <Image src={"/microphone.svg"} alt={""} fill={true}/> :
                        <Image src={"/microphone-slash.svg"} alt={""} fill={true}/>
                    }
                </button>
            </div>
            <div className={layoutStyle.mainContent}>
                <div className={chatStyle.chatPage}>
                    <div className={chatStyle.userHeader}>
                        <button className={chatStyle.userButton}>
                            <div>
                                <Image src={"/user.svg"} alt={""} fill={true}/>
                            </div>
                        </button>
                    </div>
                    <ChatSection chatHistory={chatHistory}/>
                    <div className={chatStyle.chatInputContainer}>
                        <input type="text" value={messageText} onChange={handleMessageInputChange}
                               className={chatStyle.chatInput}/>
                        <button className={chatStyle.sendButton} onClick={handleSendMessage}>
                            <Image src={"/send.svg"} alt={""} fill={true}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}