import { useState, useRef } from "react";
import { AttachmentPreview } from "./AttachmentPreview";
import { MessageToolbar } from "./MessageToolbar";
import type { Attachment } from "../types/message";

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: (attachments?: Attachment[]) => void;
  onAttachFiles: (files: FileList) => void;
  pendingAttachments: Attachment[] | null;
  onRemoveAttachment: (id: string) => void;
};

export function MessageInput({
  value,
  onChange,
  onSend,
  onAttachFiles,
  pendingAttachments,
  onRemoveAttachment,
}: MessageInputProps) {
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDisabled = value.trim() === "" && !pendingAttachments;

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !isDisabled) {
      handleSend();
    }
  }

  function handleSend() {
    onSend(pendingAttachments || undefined);
  }

  function handleEmojiSelect(emoji: string) {
    onChange(value + emoji);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAttachFiles(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleAttachClick() {
    fileInputRef.current?.click();
  }

  function handleToggleEmoji() {
    setShowEmoji(!showEmoji);
  }

  return (
    <div className="flex flex-col gap-2 border-t border-slate-200 bg-white p-4">
      {pendingAttachments && pendingAttachments.length > 0 && (
        <AttachmentPreview
          attachments={pendingAttachments}
          onRemove={onRemoveAttachment}
        />
      )}
      <div className="flex gap-2 items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx,.zip,.rar,.txt"
        />
        <MessageToolbar
          onAttachClick={handleAttachClick}
          onToggleEmoji={handleToggleEmoji}
          showEmoji={showEmoji}
          onEmojiSelect={handleEmojiSelect}
        />
        <input
          type="text"
          placeholder="Введите сообщение..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={isDisabled}
          className={[
            "rounded-xl px-5 py-3 font-medium text-white transition",
            isDisabled
              ? "cursor-not-allowed bg-slate-300"
              : "bg-blue-500 hover:bg-blue-600",
          ].join(" ")}
        >
          Send
        </button>
      </div>
    </div>
  );
}
