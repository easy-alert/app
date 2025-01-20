export const convertCostToInteger = (cost: string): number => {
  let normalizedCost = cost.replace(",", ".");
  let floatCost = parseFloat(normalizedCost);
  if (isNaN(floatCost)) {
    floatCost = 0;
  }
  return Math.round(floatCost * 100);
};
