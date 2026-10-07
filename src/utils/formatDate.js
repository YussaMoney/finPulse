function formatDate(date = new Date()) {
  return `${new Date(date).toLocaleString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
}

export default formatDate;
