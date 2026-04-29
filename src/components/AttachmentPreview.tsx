import type { Attachment } from "../types/message";
import { File } from "lucide-react";

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
              loading="lazy"
              className="w-10 h-10 rounded object-cover"
            />
          ) : 
          <File className="shrink-0"/>}
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