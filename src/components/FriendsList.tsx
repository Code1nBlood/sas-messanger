import React, { useState, useMemo, useEffect } from "react";
import { authService } from "../services/authService";

type Friend = {
  id: number;
  userId: number;
  friendId: number;
  status: string;
  friend?: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    lastSeen: Date;
    isOnline: boolean;
  };
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

const FriendsList: React.FC<{ currentUserId: string }> = ({ currentUserId }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [search, setSearch] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState<Friend | null>(null);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const data = await authService.getFriends();
        console.log('Friends API response:', JSON.stringify(data, null, 2));
        const currentId = parseInt(currentUserId);
        const friendsWithUsers = data.map((item: any) => {
          // Определяем, кто из user/friend является собеседником (не текущим пользователем)
          const otherUser =
            item.userId === currentId ? item.friend : item.user;
          return {
            id: item.id,
            userId: item.userId,
            friendId: item.friendId,
            status: item.status,
            friend: {
              id: otherUser?.id,
              username: otherUser?.username || "unknown",
              firstName: otherUser?.firstName || otherUser?.username || "",
              lastName: otherUser?.lastName || otherUser?.surname || "",
              avatarUrl: otherUser?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.username || "User")}&background=3b82f6&color=fff&size=40`,
              lastSeen: new Date(),
              isOnline: false,
            },
          };
        });
        setFriends(friendsWithUsers);
      } catch (error) {
        console.error("Failed to load friends:", error);
      }
    };

    loadFriends();
  }, []);

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
        if (!friend.friend) return false;

        const query = search.toLowerCase();
        const fullName =
          `${friend.friend.firstName} ${friend.friend.lastName}`.toLowerCase();
        return (
          friend.friend.username.toLowerCase().includes(query) ||
          fullName.includes(query)
        );
      })
      .filter((friend) => (onlineOnly ? friend.friend?.isOnline : true))
      .sort(
        (a, b) =>
          (b.friend?.lastSeen?.getTime?.() || 0) -
          (a.friend?.lastSeen?.getTime?.() || 0),
      );
  }, [friends, search, onlineOnly]);

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
                              src={friend.friend?.avatarUrl}
                              alt={friend.friend?.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            {friend.friend?.isOnline && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {friend.friend?.firstName}{" "}
                              {friend.friend?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{friend.friend?.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <span
                          className={
                            friend.friend?.isOnline
                              ? "text-green-600 font-medium"
                              : ""
                          }
                        >
                          {formatLastSeen(
                            friend.friend?.lastSeen || new Date(),
                            friend.friend?.isOnline || false,
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

      <ConfirmModal
        isOpen={modalOpen}
        userName={
          friendToDelete
            ? `${friendToDelete.friend?.firstName} ${friendToDelete?.friend?.lastName}`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
};

export default FriendsList;
