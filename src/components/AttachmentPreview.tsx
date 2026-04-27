import type { Attachment } from "../types/message";

type AttachmentPreviewProps = {
  attachments: Attachment[];
  onRemove: (id: string) => void;
};

export function AttachmentPreview({ attachments, onRemove }: AttachmentPreviewProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((att) => (
        <div
          key={att.id}
          className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 text-sm"
        >
          {att.type === "image" ? (
            <img
              src={att.url}
              alt={att.name}
              className="w-10 h-10 rounded object-cover"
            />
          ) : (
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
              className="text-slate-500 shrink-0"
            >
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg>
          )}
          <span className="text-slate-600 truncate max-w-37.5">
            {att.name}
          </span>
          <button
            onClick={() => onRemove(att.id)}
            className="text-slate-400 hover:text-red-500 transition shrink-0"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}