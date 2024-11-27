export const formatDate = (dateString: string): string => {
  const date = new Date(dateString); // Converte a string em um objeto Date

  const day = String(date.getDate()).padStart(2, "0"); // Obtém o dia e adiciona zero à esquerda se necessário
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Obtém o mês (indexado em 0) e adiciona zero à esquerda
  const year = date.getFullYear(); // Obtém o ano

  return `${day}/${month}/${year}`; // Retorna no formato DD/MM/YYYY
};
