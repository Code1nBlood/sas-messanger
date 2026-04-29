import { useRef, useEffect } from "react";
import { EmojiPicker } from "./EmojiPicker";
import { Smile, Paperclip } from "lucide-react";

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
        <Paperclip />
      </button>
      <div className="relative" ref={emojiPickerRef}>
        <button
          onClick={onToggleEmoji}
          className="p-3 text-slate-500 hover:bg-slate-100 rounded-xl transition"
          title="Добавить эмодзи"
        >
          <Smile color="#3e9392" />
        </button>
        {showEmoji && <EmojiPicker onSelectEmoji={onEmojiSelect} />}
      </div>
    </div>
  );
}
