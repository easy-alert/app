export const convertCostToInteger = (cost: string): number => {
  const normalizedCost = cost
    .replace(/[^\d,.-]/g, "")
    .replace(",", "")
    .replace(".", "");

  let floatCost = parseFloat(normalizedCost);

  if (isNaN(floatCost)) {
    floatCost = 0;
  }

  return Math.round(floatCost);
};
