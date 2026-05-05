import React from "react";
<MessageCircleMore />;
import { MessageCircleMore, UserCog, Contact } from "lucide-react";

interface LeftPanelProps {
  onOpenAccount: () => void;
  activePanelTab: 'chats' | 'friends' | 'account';
  onSelectPanelTab: (tab: 'chats' | 'friends' | 'account') => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ onOpenAccount, activePanelTab, onSelectPanelTab }) => {
  return (
    <aside className="flex flex-col h-full w-20 bg-gray-800 text-white shadow-lg relative items-center justify-center'">
      {/* Самый верх */}
      <img
        src="/Logo.png"
        alt=""
        className="w-15 h-15
      rounded-full"
      />
      <div className="">
        {/* Сверху */}
        <button
          className={`w-full flex flex-col items-center justify-center p-2 rounded-md text-sm mb-2 ${
            activePanelTab === 'chats' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
          onClick={() => onSelectPanelTab('chats')}
        >
          <MessageCircleMore />
          <span>Чаты</span>
        </button>
      </div>

      <div className="">
        {/* Сверху */}
        <button
          className={`w-full flex flex-col items-center justify-center p-2 rounded-md text-sm mb-2 ${
            activePanelTab === 'friends' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
          onClick={() => onSelectPanelTab('friends')}
        >
          <Contact />
          <span>Друзья</span>
        </button>
      </div>

      {/* Снизу */}
      <nav className="p-2 border-t border-gray-700">
        <button
          className={`w-full flex flex-col items-center justify-center p-2 rounded-md text-sm ${
            activePanelTab === 'account' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
          onClick={onOpenAccount}
        >
          <UserCog />
          <span>Аккаунт</span>
        </button>
      </nav>
    </aside>
  );
};

export default LeftPanel;
