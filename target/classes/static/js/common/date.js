/* 날짜 포맷 */
function formatDate(value) {
  if (!value) return "";
  if (typeof value === "string") {
    return value.replace("T", " ").replace(/\.\d+$/, "");
  }
  return String(value);
}
