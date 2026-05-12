import React, { useState, useRef } from "react";
import { User } from "../types/user";
import { Avatar } from "./Avatar";
import { X, PenLine } from "lucide-react";
import { authService } from "../services/authService";

interface ProfileModalProps {
  currentUser: User;
  onClose: () => void;
  onLogout: () => void;
  onAvatarChange: (newAvatarUrl: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  currentUser,
  onClose,
  onLogout,
  onAvatarChange,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingSurname, setIsEditingSurname] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingIdentifier, setIsEditingIdentifier] = useState(false);

  const [name, setName] = useState(currentUser.name || "");
  const [surname, setSurname] = useState(currentUser.surname || "");
  const [about, setAbout] = useState(currentUser.about || "");
  const [identifier, setIdentifier] = useState(
    currentUser.email ? `@${currentUser.email.split("@")[0]}` : "@user",
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    // Отправка даных в бек TODO
    setIsEditingName(false);
    setIsEditingSurname(false);
    setIsEditingAbout(false);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-gray-950/55"
      style={{ left: "80px" }}
    >
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-lg mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg"
        >
          <X />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Профиль</h2>

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar
              title={currentUser.name || "N/A"}
              avatarUrl={currentUser.avatarUrl}
              size="lg"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute -bottom-0.5 -right-0.5 bg-blue-500 text-white rounded-full p-1.5 shadow-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-wait"
              title="Изменить аватар"
            >
              <PenLine size={16} />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setIsUploadingAvatar(true);
              try {
                const result = await authService.setAvatar(file);
                onAvatarChange(result.avatarUrl);
              } catch (err: any) {
                alert(`Ошибка загрузки аватара: ${err.message || err}`);
              } finally {
                setIsUploadingAvatar(false);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }
            }}
          />
          {/* Идентификатор */}
          <div className="flex items-center mt-3">
            {isEditingIdentifier ? (
              <input
                type="text"
                value={
                  identifier.startsWith("@")
                    ? identifier.substring(1)
                    : identifier
                }
                onChange={(e) => setIdentifier(`@${e.target.value}`)}
                onBlur={handleSave}
                className="p-1 border border-gray-300 rounded-md text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <span className="text-xl font-semibold">{identifier}</span>
            )}
            <button
              onClick={() => setIsEditingIdentifier(!isEditingIdentifier)}
              className="ml-2 p-1 text-blue-500 hover:text-blue-700"
            >
              <PenLine />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Имя */}
          <div className="flex items-center justify-between">
            <label className="block text-gray-700 font-medium">Имя:</label>
            {isEditingName ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSave}
                className="flex-1 ml-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <span className="flex-1 ml-4 text-gray-800">
                {name || "Не указано"}
              </span>
            )}
            <button
              onClick={() => setIsEditingName(!isEditingName)}
              className="ml-2 p-1 text-blue-500 hover:text-blue-700"
            >
              <PenLine />
            </button>
          </div>

          {/* Фамилия */}
          <div className="flex items-center justify-between">
            <label className="block text-gray-700 font-medium">Фамилия:</label>
            {isEditingSurname ? (
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                onBlur={handleSave}
                className="flex-1 ml-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <span className="flex-1 ml-4 text-gray-800">
                {surname || "Не указана"}
              </span>
            )}
            <button
              onClick={() => setIsEditingSurname(!isEditingSurname)}
              className="ml-2 p-1 text-blue-500 hover:text-blue-700"
            >
              <PenLine />
            </button>
          </div>

          {/* О себе */}
          <div className="flex items-center justify-between">
            <label className="block text-gray-700 font-medium">О себе:</label>
            {isEditingAbout ? (
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                onBlur={handleSave}
                rows={3}
                className="flex-1 ml-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            ) : (
              <span className="flex-1 ml-4 text-gray-800">
                {about || "Расскажите о себе..."}
              </span>
            )}
            <button
              onClick={() => setIsEditingAbout(!isEditingAbout)}
              className="ml-2 p-1 text-blue-500 hover:text-blue-700"
            >
              <PenLine />
            </button>
          </div>
        </div>

        {/* Кнопка выхода */}
        <button
          onClick={onLogout}
          className="mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};
