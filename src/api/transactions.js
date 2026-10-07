import { request } from "./client";

export function getTransactions() {
  return request("/transactions");
}

export function createTransaction({ description, amount, category }) {
  return request("/transactions", { method: "POST", body: { description, amount, category } });
}

export function updateTransaction(id, { description, amount, category }) {
  return request(`/transactions/${id}`, {
    method: "PUT",
    body: { description, amount, category },
  });
}

export function deleteTransaction(id) {
  return request(`/transactions/${id}`, { method: "DELETE" });
}

export function clearTransactions() {
  return request("/transactions", { method: "DELETE" });
}

export function loadSampleTransactions() {
  return request("/transactions/sample", { method: "POST" });
}

export function convertCurrency(to) {
  return request("/transactions/convert", { method: "POST", body: { to } });
}
