import { useState } from "react";

type EmojiPickerProps = {
  onSelectEmoji: (emoji: string) => void;
};

const EMOJI_CATEGORIES = {
  "Смайлики": ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🫢", "🫣", "🤫", "🤔", "🫡", "🤐", "🤨", "😐", "😑", "😶", "🫥", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐"],
  "Жесты": ["👋", "🤚", "🖐️", "✋", "🖖", "🫱", "🫲", "🫳", "🫴", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "🫵", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "🫶", "👐", "🤲", "🤝", "🙏"],
  "Сердца": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝"],
  "Предметы": ["🎉", "🎊", "🎈", "🎁", "🎀", "🏆", "🥇", "🎯", "📌", "✨", "⭐", "🌟", "💫", "🔥", "💯", "🚀", "💡", "📷", "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "💾", "💿", "📀", "📷", "📹", "🎥", "📽️", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭", "⏱️", "⏰", "📡", "🔋", "🔌"],
  "Природа": ["🌸", "🌺", "🌹", "🌷", "🌻", "🌼", "🌱", "🌲", "🌳", "🌴", "🌵", "🌾", "🌿", "☘️", "🍀", "🍁", "🍂", "🍃", "🍄", "🐚", "🌊", "🌈", "☀️", "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "❄️", "☃️", "⛄", "🌬️", "💨", "🌪️", "🌫️"],
};

export function EmojiPicker({ onSelectEmoji }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("Смайлики");

  return (
    <div className="w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-200">
        {Object.keys(EMOJI_CATEGORIES).slice(0, 5).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`flex-1 px-2 py-2 text-xs font-medium transition ${
              activeCategory === category
                ? "bg-blue-500 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-1 p-3 max-h-64 overflow-y-auto">
        {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES].map(
          (emoji, index) => (
            <button
              key={index}
              onClick={() => onSelectEmoji(emoji)}
              className="text-2xl hover:bg-slate-100 rounded p-1 transition cursor-pointer"
            >
              {emoji}
            </button>
          )
        )}
      </div>
    </div>
  );
}
