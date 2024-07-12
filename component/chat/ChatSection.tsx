import ChatBubble from "@component/chat/ChatBubble";

import chatStyle from "@style/chat.module.css";

type ChatSectionProps = {
    chatHistory: {
        role: "user" | "assistant",
        content: string
    }[]
}

export default function ChatSection({ chatHistory }: ChatSectionProps) {
    return (
        <div className={chatStyle.chatContainer}>
            {chatHistory.map(({ role, content }, key) => (
                <ChatBubble key={"chatBubble_" + key} role={role} message={content}/>
            ))}
        </div>
    );
}