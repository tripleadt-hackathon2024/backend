import ChatBubble from "@component/chat/ChatBubble";

import chatStyle from "@style/chat.module.css";

type ChatSectionProps = {
    chatHistory: {
        role: "user" | "assistant",
        message: string
    }[]
}

export default function ChatSection({ chatHistory }: ChatSectionProps) {
    return (
        <div className={chatStyle.chatContainer}>
            {chatHistory.map(({ role, message }, key) => (
                <ChatBubble key={"chatBubble_" + key} role={role} message={message}/>
            ))}
            <ChatBubble role={"assistant"}
                        message={"Lorem ipsum dolor sit amet, consectetur adipisicing elit. At beatae blanditiis consectetur cum debitis doloremque eius error et ex inventore maiores nesciunt non odio perferendis, quasi quibusdam recusandae tempora temporibus!\n"}/>
            <ChatBubble role={"user"}
                        message={"Lorem ipsum dolor sit amet, consectetur adipisicing elit. At beatae blanditiis consectetur cum debitis doloremque eius error et ex inventore maiores nesciunt non odio perferendis, quasi quibusdam recusandae tempora temporibus!\n"}/>
        </div>
    );
}