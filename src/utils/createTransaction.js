export default function createTransaction({ description, amount, category }) {
  return {
    id: Date.now(),
    description,
    amount,
    category,
    date: new Date().toISOString(),
  };
}
