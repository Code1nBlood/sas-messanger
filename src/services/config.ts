export const isMockMode = () => {
  const saved = localStorage.getItem("useMockData");
  if (saved === null) return true; // По умолчанию true
  return saved === "true";
};

export const setMockMode = (value: boolean) => {
  localStorage.setItem("useMockData", String(value));
};
