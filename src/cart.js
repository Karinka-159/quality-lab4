export function calculateTotal(items) {
  if (!Array.isArray(items)) {
    throw new Error("Items must be an array");
  }
  if (items.some((item) => item.price < 0)) {
    throw new Error("Price cannot be negative");
  }
  return items.reduce((sum, item) => sum + item.price, 0);
}

export function applyDiscount(total, discount) {
  if (discount < 0 || discount > 100) {
    throw new Error("Discount must be between 0 and 100");
  }
  return total * (1 - discount / 100);
}

export function formatCurrency(amount, currency) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
  }).format(amount);
}

export function validateEmail(email) {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
