import React from 'react';

const LeftPanel: React.FC = () => {
  return (
    <aside className="flex flex-col h-full w-20 bg-gray-800 text-white shadow-lg relative">
      {/* Самый верх */}
      <span className = "justify-center flex p-2">Лого</span>
      <div className="grow">
        {/* Сверху */}
        <button className="w-full flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-700 text-sm mb-2">
          <span className="text-xl">💬</span>
          <span>Чаты</span>
        </button>
      </div>

      {/* Снизу */}
      <nav className="p-2 border-t border-gray-700">
        
        <button className="w-full flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-700 text-sm">
          <span className="text-xl">👤</span>
          <span>Аккаунт</span>
        </button>
      </nav>
    </aside>
  );
};

export default LeftPanel;
