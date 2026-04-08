import { useState, useRef, useEffect } from "react";
import { EmojiPicker } from "./EmojiPicker";

type MessageToolbarProps = {
  onAttachClick: () => void;
  onToggleEmoji: () => void;
  showEmoji: boolean;
  onEmojiSelect: (emoji: string) => void;
};

export function MessageToolbar({
  onAttachClick,
  onToggleEmoji,
  showEmoji,
  onEmojiSelect,
}: MessageToolbarProps) {
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        onToggleEmoji();
      }
    }

    if (showEmoji) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmoji, onToggleEmoji]);

  return (
    <div className="flex gap-1 items-center relative">
      <button
        onClick={onAttachClick}
        className="p-3 text-slate-500 hover:text-blue-500 hover:bg-slate-100 rounded-xl transition"
        title="Прикрепить файл"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
      </button>
      <div className="relative" ref={emojiPickerRef}>
        <button
          onClick={onToggleEmoji}
          className="p-3 text-slate-500 hover:text-yellow-500 hover:bg-slate-100 rounded-xl transition"
          title="Добавить эмодзи"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>
        {showEmoji && <EmojiPicker onSelectEmoji={onEmojiSelect} />}
      </div>
    </div>
  );
}
