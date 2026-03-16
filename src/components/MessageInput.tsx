type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
};

export function MessageInput({
  value,
  onChange,
  onSend,
}: MessageInputProps) {
  const isDisabled = value.trim() === "";
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !isDisabled) {
      onSend();
    }
  }

  return (
    <div className="flex gap-3 border-t border-slate-200 bg-white p-4">
      <input
        type="text"
        placeholder="Введите сообщение..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
      />
      <button
        onClick={onSend}
        disabled={isDisabled}
        className={["rounded-xl px-5 py-3 font-medium text-white transition", isDisabled ? "cursor-not-allowed bg-slate-300" : "bg-blue-500 hover:bg-blue-600",].join(" ")}
      >
        Send
      </button>
    </div>
  );
}