const truncateText = (text: string, maxLength = 300) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export default truncateText;
