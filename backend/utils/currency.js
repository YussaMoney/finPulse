export const EXCHANGE_RATES_TO_USD = {
  $: 1.0,
  "€": 0.92,
  "£": 0.78,
  "₹": 83.5,
  "₦": 1650.0,
};

export const SUPPORTED_CURRENCIES = Object.keys(EXCHANGE_RATES_TO_USD);

export function convertAmount(amount, fromSymbol, toSymbol) {
  if (!amount || fromSymbol === toSymbol) return amount;

  const amountInUSD = amount / EXCHANGE_RATES_TO_USD[fromSymbol];
  const converted = amountInUSD * EXCHANGE_RATES_TO_USD[toSymbol];

  if (toSymbol === "₦") return Math.round(converted);
  return Math.round(converted * 100) / 100;
}
