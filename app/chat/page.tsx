"use client";
import "regenerator-runtime/runtime";
import chatStyle from "@style/chat.module.css";
import ChatSection from "@component/chat/ChatSection";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import layoutStyle from "@style/layout.module.css";
import Link from "next/link";
import headerStyle from "@style/header.module.css";

export default function Chat() {
    const [ text, setText ] = useState("");
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();
    const [ chatContent, setChatContent ] = useState({});

    useEffect(() => {
        (async () => {
            const checkKey = await fetch("http://localhost:8000/checkUserID", {
                method: "POST",
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    key: localStorage.getItem("key")
                })
            });
            if (checkKey.status == 400) {
                const responseKey = await fetch("http://localhost:8000/generateUserID");
                const data = await responseKey.json();
                localStorage.setItem("key", data.key);
            }
        })();
    }, []);

    useEffect(() => {
        console.log(transcript);
        if (listening && text != transcript) {
            setText(transcript);
        }
    }, [ listening, text, transcript ]);

    async function toggleTranscript() {
        switch (listening) {
            case true:
                console.log("Stop");
                await SpeechRecognition.stopListening();
                break;
            case false:
                console.log("Listening");
                resetTranscript();
                await SpeechRecognition.startListening();
                break;
        }
    }

    function setValueText(e: ChangeEvent<HTMLInputElement>) {
        setText(e.target.value);
    }

    return (
        <div className={layoutStyle.mainContainer}>
            <div className={layoutStyle.headerContainer}>
                <Link href={"/chat"} className={headerStyle.changeModeButton}>
                    <Image src={"/logo.svg"} alt={"logo"} fill={true}/>
                </Link>
                <Link href={"/"} className={headerStyle.shootButton}/>
                <button onClick={toggleTranscript} className={chatStyle.sendButton}>
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
                    <ChatSection chatHistory={[]}/>
                    <div className={chatStyle.chatInputContainer}>
                        <input type="text" value={text} onChange={setValueText} className={chatStyle.chatInput}/>
                        <button className={chatStyle.sendButton}>
                            <Image src={"/send.svg"} alt={""} fill={true}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}