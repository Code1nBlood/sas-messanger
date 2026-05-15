import React, { useState, useMemo, useEffect } from "react";
import { authService } from "../services/authService";
import { X, UserX } from "lucide-react";

type Friend = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  lastSeen: Date;
  isOnline: boolean;
};

type FriendRequest = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
};

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
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 z-10">
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
  const [friends, setFriends] = useState<Friend[]>([]);
  const [search, setSearch] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState<Friend | null>(null);
  const [requestsPanelOpen, setRequestsPanelOpen] = useState(false);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const data = await authService.getFriends();
        console.log("Friends API response:", JSON.stringify(data, null, 2));
        const mapped: Friend[] = (data.friends || []).map((item: any) => ({
          id: item.id,
          username: item.username || "unknown",
          firstName: item.firstName || item.username || "",
          lastName: item.lastName || item.surname || "",
          avatarUrl:
            item.avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(item.username || "User")}&background=3b82f6&color=fff&size=40`,
          lastSeen: new Date(),
          isOnline: false,
        }));
        setFriends(mapped);
      } catch (error) {
        console.error("Failed to load friends:", error);
      }
    };

    loadFriends();
  }, []);

  useEffect(() => {
    // заявки для badge кнопки
    loadFriendRequests();
  }, []);

  useEffect(() => {
    if (requestsPanelOpen) {
      loadFriendRequests();
    }
  }, [requestsPanelOpen]);

  const loadFriendRequests = async () => {
    try {
      const data = await authService.getFriendRequests();
      const requests = Array.isArray(data)
        ? data
        : data.requests || data.items || [];
      const mapped: FriendRequest[] = requests.map((item: any) => ({
        id: item.id,
        username: item.username || "unknown",
        firstName: item.firstName || item.username || "",
        lastName: item.lastName || item.surname || "",
        avatarUrl:
          item.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(item.username || "User")}&background=8b5cf6&color=fff&size=40`,
      }));
      setFriendRequests(mapped);
    } catch (error) {
      console.error("Failed to load friend requests:", error);
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await authService.acceptFriendRequest(requestId);
      setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    }
  };

  const handleDeclineRequest = async (requestId: number) => {
    try {
      await authService.declineFriendRequest(requestId);
      setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.error("Failed to decline friend request:", error);
    }
  };

  const openDeleteModal = (friend: Friend) => {
    setFriendToDelete(friend);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (friendToDelete) {
      setFriends((prev) => prev.filter((f) => f.id !== friendToDelete.id));
    }
    setModalOpen(false);
    setFriendToDelete(null);
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setFriendToDelete(null);
  };

  const filteredFriends = useMemo(() => {
    return friends
      .filter((friend) => {
        const query = search.toLowerCase();
        const fullName = `${friend.firstName} ${friend.lastName}`.toLowerCase();
        return (
          friend.username.toLowerCase().includes(query) ||
          fullName.includes(query)
        );
      })
      .filter((friend) => (onlineOnly ? friend.isOnline : true))
      .sort(
        (a, b) =>
          (b.lastSeen?.getTime?.() || 0) - (a.lastSeen?.getTime?.() || 0),
      );
  }, [friends, search, onlineOnly]);

  return (
    <>
      <div className="flex-1 p-4 bg-gray-100 flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Friends</h2>
          <button
            onClick={() => setRequestsPanelOpen(true)}
            className="mb-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white px-4 py-2 transition relative"
          >
            Запросы в друзья
            {friendRequests.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow">
                {friendRequests.length}
              </span>
            )}
          </button>
        </div>

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
                {filteredFriends.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Друзья не найдены
                    </td>
                  </tr>
                ) : (
                  filteredFriends.map((friend) => (
                    <tr key={friend.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={friend.avatarUrl}
                              alt={friend.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            {friend.isOnline && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {friend.firstName} {friend.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{friend.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <span
                          className={
                            friend.isOnline ? "text-green-600 font-medium" : ""
                          }
                        >
                          {formatLastSeen(
                            friend.lastSeen || new Date(),
                            friend.isOnline || false,
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openDeleteModal(friend)}
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
          Всего друзей: {filteredFriends.length}
        </div>
      </div>

      <>
        {/* Затемнение */}
        <div
          className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
            requestsPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setRequestsPanelOpen(false)}
        />

        {/* панель */}
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${
            requestsPanelOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Запросы</h3>
              <button
                onClick={() => setRequestsPanelOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X />
              </button>
            </div>

            {/* Список заявок */}
            <div className="flex-1 overflow-y-auto p-4">
              {friendRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <UserX size={100} />
                  <p className="text-lg font-medium">Нет новых заявок</p>
                  <p className="text-sm mt-1">
                    Когда кто-то захочет добавить вас в друзья, заявки
                    отобразятся здесь
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {friendRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    >
                      <img
                        src={request.avatarUrl}
                        alt={request.username}
                        className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {request.firstName} {request.lastName}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          @{request.username}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition"
                        >
                          Принять
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(request.id)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 active:bg-gray-400 transition"
                        >
                          Отклонить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </>

      <ConfirmModal
        isOpen={modalOpen}
        userName={
          friendToDelete
            ? `${friendToDelete.firstName} ${friendToDelete?.lastName}`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default FriendsList;
