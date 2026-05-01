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
  let date: Date;

  if (typeof value === "string") {
    const trimmed = value.trim();
    const hasTimeZone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(trimmed);
    date = new Date(hasTimeZone ? trimmed : `${trimmed}Z`);
  } else {
    date = new Date(value ?? Date.now());
  }

  if (Number.isNaN(date.getTime())) {
    date = new Date();
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}