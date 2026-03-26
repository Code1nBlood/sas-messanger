export function EmptyChatState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="mb-4 rounded-full bg-white p-5 shadow-sm">
        <span className="text-3xl">💬</span>
      </div>

      <h2 className="mb-2 text-xl font-semibold text-slate-800">
        Выберите чат
      </h2>
    </div>
  );
}