import type { Message } from "../types/message";

type MessageBubbleProps = {
  message: Message;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " Б";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " КБ";
  return (bytes / (1024 * 1024)).toFixed(1) + " МБ";
}

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
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-2 space-y-2">
            {message.attachments.map((att) => (
              <div key={att.id}>
                {att.type === "image" ? (
                  <img
                    src={att.url}
                    alt={att.name}
                    className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition"
                    onClick={() => window.open(att.url, "_blank")}
                  />
                ) : (
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 p-2 rounded-lg transition ${
                      isMine
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-slate-100 hover:bg-slate-200"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="flex-shrink-0"
                    >
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                      <polyline points="13 2 13 9 20 9" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{att.name}</div>
                      {att.size && (
                        <div className={`text-xs ${isMine ? "text-blue-200" : "text-slate-500"}`}>
                          {formatFileSize(att.size)}
                        </div>
                      )}
                    </div>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        {message.text && (
          <div className="break-words">{message.text}</div>
        )}
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