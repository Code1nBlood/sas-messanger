import React, { useState, useMemo } from "react";

type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  lastSeen: Date;
  isOnline: boolean;
};

const MOCK_USERS: User[] = [
  {
    id: 1,
    username: "alex_dev",
    firstName: "Алексей",
    lastName: "Иванов",
    avatarUrl: "https://i.pravatar.cc/40?img=1",
    lastSeen: new Date(),
    isOnline: true,
  },
  {
    id: 2,
    username: "maria_k",
    firstName: "Мария",
    lastName: "Козлова",
    avatarUrl: "https://i.pravatar.cc/40?img=2",
    lastSeen: new Date(Date.now() - 1000 * 60 * 15),
    isOnline: false,
  },
  {
    id: 3,
    username: "ivan_p",
    firstName: "Иван",
    lastName: "Петров",
    avatarUrl: "https://i.pravatar.cc/40?img=3",
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 3),
    isOnline: false,
  },
  {
    id: 4,
    username: "kate_ui",
    firstName: "Катя",
    lastName: "Смирнова",
    avatarUrl: "https://i.pravatar.cc/40?img=4",
    lastSeen: new Date(),
    isOnline: true,
  },
];

const formatLastSeen = (date: Date, isOnline: boolean): string => {
  if (isOnline) return "В сети";

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Только что";
  if (minutes < 60) return `${minutes} мин. назад`;
  if (hours < 24) return `${hours} ч. назад`;
  return `${days} д. назад`;
};

// Компонент модалки
const ConfirmModal: React.FC<{
  isOpen: boolean;
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, userName, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Оверлей */}
      <div
        className="absolute inset-0 bg-white transparent  transition-opacity"
        onClick={onCancel}
      />

      {/* Модалка */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Удалить из друзей?
        </h3>
        <p className="text-gray-600 mb-6">
          Вы уверены что хотите удалить{" "}
          <span className="font-medium">{userName}</span> из друзей?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

const FriendsList: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      // TODO axios.delete(`/api/friends/${userToDelete.id}`)
    }
    setModalOpen(false);
    setUserToDelete(null);
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setUserToDelete(null);
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const query = search.toLowerCase();
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return (
          user.username.toLowerCase().includes(query) ||
          fullName.includes(query)
        );
      })
      .filter((user) => (onlineOnly ? user.isOnline : true))
      .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
  }, [users, search, onlineOnly]);

  return (
    <>
      <div className="flex-1 p-4 bg-gray-100 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Friends</h2>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Поиск по имени или username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            onClick={() => setOnlineOnly(!onlineOnly)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              onlineOnly
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {onlineOnly ? "Онлайн" : "Все"}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Пользователь
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Последний раз в сети
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Действие
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Друзья не найдены
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={user.avatarUrl}
                              alt={user.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            {user.isOnline && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <span
                          className={
                            user.isOnline ? "text-green-600 font-medium" : ""
                          }
                        >
                          {formatLastSeen(user.lastSeen, user.isOnline)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-500">
          Всего друзей: {filteredUsers.length}
        </div>
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        userName={
          userToDelete
            ? `${userToDelete.firstName} ${userToDelete.lastName}`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default FriendsList;
