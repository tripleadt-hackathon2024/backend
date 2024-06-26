import chatStyle from "@style/chat.module.css";
import Image from "next/image";

type ChatBubbleProps = {
    role: "assistant" | "user";
    message: string;
}

type ChatBubbleChildProps = {
    message: string;
}

function ChatBubbleAssistant({ message }: ChatBubbleChildProps) {
    return (
        <div className={chatStyle.chatBubbleAssistant}>
            <div className={chatStyle.chatBubbleAssistantAvatar}>
                <div>
                    <Image src={"/logo.svg"} alt={"Message avatar"} fill={true}/>
                </div>
            </div>
            <p>{message}</p>
        </div>
    );
}

function ChatBubbleUser({ message }: ChatBubbleChildProps) {
    return (
        <div className={chatStyle.chatBubbleUser}>
            <p>{message}</p>
            <div className={chatStyle.chatBubbleUserAvatar}>
                <div>
                    <Image src={"/user.svg"} alt={"User avatar"} fill={true}/>
                </div>
            </div>
        </div>
    );
}

export default function ChatBubble({ role, message }: ChatBubbleProps) {

    switch (role) {
        case "assistant":
            return <ChatBubbleAssistant message={message}/>;
        case "user":
            return <ChatBubbleUser message={message}/>;
    }
}