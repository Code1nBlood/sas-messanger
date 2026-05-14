export function getCurrentTime() {
  const now = new Date();

  return now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateMessageId() {
  return crypto.randomUUID();
}

export function formatMessageTime(value?: string | number | Date | null) {
  if (!value) return "";

  if (typeof value === "string") {
    let trimmed = value.trim();

    if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    // Если длинная дата
    if (trimmed.length > 10) {
      // 1. Убираем смещение
      // И заменяем на Z, чтобы форсировать UTC
      trimmed = trimmed.replace(/([+-]\d{2}:?\d{2})$/, "Z");

      if (!trimmed.endsWith("Z")) {
        // Заменяем пробел на T для ISO стандарта
        trimmed = trimmed.replace(" ", "T") + "Z";
      }
    }

    const date = new Date(trimmed);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  // Для number, Date или если парсинг не удался
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
