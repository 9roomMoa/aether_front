export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const month = date.toLocaleDateString("ko-KR", { month: "2-digit" }).replace(".", "");
  const day = date.toLocaleDateString("ko-KR", { day: "2-digit" }).replace(".", "");

  return `${month} ${day}`;
};