import React, { useState } from "react";
import { User } from "../types/user";
import { Avatar } from "./Avatar";

interface ProfileModalProps {
  currentUser: User;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ currentUser, onClose }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingSurname, setIsEditingSurname] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingIdentifier, setIsEditingIdentifier] = useState(false);

  const [name, setName] = useState(currentUser.name || "");
  const [surname, setSurname] = useState(currentUser.surname || "");
  const [about, setAbout] = useState(currentUser.about || "");
  const [identifier, setIdentifier] = useState(
    currentUser.email ? `@${currentUser.email.split("@")[0]}` : "@user"
  );

  const handleSave = () => {
    // Отправка даных в бек TODO
    setIsEditingName(false);
    setIsEditingSurname(false);
    setIsEditingAbout(false);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-950/55"
         style={{ left: '80px' }}> 
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-lg mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Профиль</h2>

        <div className="flex flex-col items-center mb-6">
          <Avatar title={currentUser.name || "N/A"} avatarUrl={currentUser.avatarUrl} size="lg" />
          {/* Идентификатор */}
          <div className="flex items-center mt-3">
            {isEditingIdentifier ? (
              <input
                type="text"
                value={identifier.startsWith('@') ? identifier.substring(1) : identifier}
                onChange={(e) => setIdentifier(`@${e.target.value}`)}
                onBlur={handleSave}
                className="p-1 border border-gray-300 rounded-md text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <span className="text-xl font-semibold">{identifier}</span>
            )}
            <button onClick={() => setIsEditingIdentifier(!isEditingIdentifier)} className="ml-2 p-1 text-blue-500 hover:text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.827-2.828z" />
              </svg>
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
              <span className="flex-1 ml-4 text-gray-800">{name || "Не указано"}</span>
            )}
            <button onClick={() => setIsEditingName(!isEditingName)} className="ml-2 p-1 text-blue-500 hover:text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.827-2.828z" />
              </svg>
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
              <span className="flex-1 ml-4 text-gray-800">{surname || "Не указана"}</span>
            )}
            <button onClick={() => setIsEditingSurname(!isEditingSurname)} className="ml-2 p-1 text-blue-500 hover:text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.827-2.828z" />
              </svg>
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
              <span className="flex-1 ml-4 text-gray-800">{about || "Расскажите о себе..."}</span>
            )}
            <button onClick={() => setIsEditingAbout(!isEditingAbout)} className="ml-2 p-1 text-blue-500 hover:text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.827-2.828z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
