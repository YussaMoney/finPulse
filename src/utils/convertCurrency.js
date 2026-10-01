export const EXCHANGE_RATES_TO_USD = {
  "$": 1.0,     // US Dollar
  "€": 0.92,    // Euro
  "£": 0.78,    // British Pound
  "₹": 83.5,    // Indian Rupee
  "₦": 1650.0,  // Nigerian Naira
};

export function convertAmount(amount, fromSymbol, toSymbol) {
  if (!amount || fromSymbol === toSymbol) return amount;
  const fromRate = EXCHANGE_RATES_TO_USD[fromSymbol] || 1.0;
  const toRate = EXCHANGE_RATES_TO_USD[toSymbol] || 1.0;

  const amountInUSD = amount / fromRate;
  const converted = amountInUSD * toRate;

  // Round NGN/INR to whole numbers or 2 decimals depending on magnitude
  if (toSymbol === "₦") {
    return Math.round(converted);
  }
  return Math.round(converted * 100) / 100;
}
