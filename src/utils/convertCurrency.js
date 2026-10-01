export const EXCHANGE_RATES_TO_USD = {
  "$": 1.0,
  "€": 0.92,
  "£": 0.78,
  "₹": 83.5,
  "₦": 1650.0,
};

export function convertAmount(amount, fromSymbol, toSymbol) {
  if (!amount || fromSymbol === toSymbol) return amount;
  const fromRate = EXCHANGE_RATES_TO_USD[fromSymbol] || 1.0;
  const toRate = EXCHANGE_RATES_TO_USD[toSymbol] || 1.0;

  const amountInUSD = amount / fromRate;
  const converted = amountInUSD * toRate;

  if (toSymbol === "₦") {
    return Math.round(converted);
  }
  return Math.round(converted * 100) / 100;
}
