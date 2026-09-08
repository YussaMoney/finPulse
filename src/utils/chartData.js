export function getIncomeExpenseTotals(transactions) {
  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

  return {
    income,
    expenses,
  };
}

export function getCategoryTotals(transactions) {
  // We'll implement this later.
}
