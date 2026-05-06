import { useState } from "react";
import { User, Database, DatabaseZap } from "lucide-react";
import { isMockMode, setMockMode } from "../services/config";

type AuthFormProps = {
  onLogin: (loginIdentifier: string, password: string) => void;
  onRegister: (name: string, email: string, password: string) => void;
};

export function AuthForm({ onLogin, onRegister }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateForm = () => {
    let isValid = true;

    setNameError("");
    setEmailError("");
    setPasswordError("");

    // Валидации
    if (!isLogin && name.trim() === "") {
      setNameError("Логин не может быть пустым.");
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isLogin) {
      if (!emailRegex.test(email)) {
        setEmailError("Пожалуйста, введите корректный Email.");
        isValid = false;
      }
    } else {
      // при login валидация
      if (email.includes("@")) {
        // если есть собакен
        if (!emailRegex.test(email)) {
          setEmailError("Пожалуйста, введите корректный Email.");
          isValid = false;
        }
      } else if (email.trim() === "") {
        setEmailError("Пожалуйста, введите логин или Email.");
        isValid = false;
      }
    }

    if (password.length < 6) {
      setPasswordError("Пароль должен содержать не менее 6 символов.");
      isValid = false;
    }

    return isValid;
  };

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isLogin) {
      onLogin(email, password);
    } else {
      onRegister(name, email, password);
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="flex w-full max-w-md flex-col items-center px-6">
        <h1 className="mb-12 text-4xl font-bold text-slate-900">
          SAS Messenger
        </h1>

        {/* Иконка пользователя */}
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <User className="h-12 w-12" />
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {!isLogin && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Логин"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
              required
            />
          )}
          {nameError && (
            <p className="text-red-500 text-xs mt-1">{nameError}</p>
          )}

          <input
            type={isLogin ? "text" : "email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isLogin ? "Логин или Email" : "Email"}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            required
          />
          {emailError && (
            <p className="text-red-500 text-xs mt-1">{emailError}</p>
          )}

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
            required
          />
          {passwordError && (
            <p className="text-red-500 text-xs mt-1">{passwordError}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>

          {isLogin && (
            <button
              type="button"
              onClick={async () => {
                setMockMode(true);
                // задержка чтобы localStorage обновился
                setTimeout(() => {
                  onLogin("Admin", "password");
                }, 10);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              <DatabaseZap size={18} />
              Войти через Mock (без сервера)
            </button>
          )}
        </form>

        {/* вход/регистрация */}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-sm text-slate-500 transition hover:text-slate-700"
        >
          {isLogin
            ? "Нет аккаунта? Зарегистрироваться"
            : "Уже есть аккаунт? Войти"}
        </button>

        {/* Разделитель */}
        <div className="my-6 flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-slate-200"></div>
          <span className="text-xs text-slate-400">или</span>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        {/* Кнопка Google */}
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Войти с помощью Google
        </button>
      </div>
    </div>
  );
}
