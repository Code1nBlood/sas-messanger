import type { Message } from "../types/message";

type MessageBubbleProps = {
  message: Message;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isMine = message.sender === "me";

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[70%] rounded-2xl px-3 py-2 shadow-sm",
          isMine
            ? "rounded-br-md bg-blue-500 text-white"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-900",
        ].join(" ")}
      >
        <div className="break-words">{message.text}</div>
        <div
          className={`mt-1 text-right text-xs ${
            isMine ? "text-blue-100" : "text-slate-400"
          }`}
        >
          {message.time}
        </div>
      </div>
    </div>
  );
}