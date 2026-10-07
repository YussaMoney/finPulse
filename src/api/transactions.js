const API_URL = `${import.meta.env.VITE_API_URL.replace(/\/+$/, "")}/transactions`;

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export function getTransactions() {
  return fetch(API_URL).then(handleResponse);
}

export function createTransaction({ description, amount, category }) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, amount, category }),
  }).then(handleResponse);
}

export function updateTransaction(id, { description, amount, category }) {
  return fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, amount, category }),
  }).then(handleResponse);
}

export function deleteTransaction(id) {
  return fetch(`${API_URL}/${id}`, { method: "DELETE" }).then(handleResponse);
}
