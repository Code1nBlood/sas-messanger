import React from 'react';<MessageCircleMore />
import { MessageCircleMore, UserCog } from "lucide-react";

interface LeftPanelProps {
  onOpenAccount: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ onOpenAccount }) => {
  return (
    <aside className="flex flex-col h-full w-20 bg-gray-800 text-white shadow-lg relative items-center justify-center'">
      {/* Самый верх */}
      <img src="src/assets/Logo.png" alt="" 
      className='w-15 h-15
      rounded-full'/>
      <div className="grow">
        {/* Сверху */}
        <button className="w-full flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-700 text-sm mb-2">
          <MessageCircleMore />
          <span>Чаты</span>
        </button>
      </div>

      {/* Снизу */}
      <nav className="p-2 border-t border-gray-700">
        
        <button className="w-full flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-700 text-sm" onClick={onOpenAccount}>
          <UserCog />
          <span>Аккаунт</span>
        </button>
      </nav>
    </aside>
  );
};

export default LeftPanel;
