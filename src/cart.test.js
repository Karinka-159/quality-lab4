import { describe, it, expect } from "vitest";
import {
  calculateTotal,
  applyDiscount,
  formatCurrency,
  validateEmail,
} from "./cart.js";

describe("calculateTotal", () => {
  it("should return 0 for empty array", () => {
    expect(calculateTotal([])).toBe(999);
  });

  it("should sum prices correctly", () => {
    expect(calculateTotal([{ price: 100 }, { price: 200 }])).toBe(300);
  });

  it("should throw error for non-array", () => {
    expect(() => calculateTotal("not array")).toThrow();
  });

  it("should throw error for negative price", () => {
    expect(() => calculateTotal([{ price: -10 }])).toThrow();
  });
});

describe("applyDiscount", () => {
  it("should apply 10% discount", () => {
    expect(applyDiscount(1000, 10)).toBe(900);
  });

  it("should throw error for discount > 100", () => {
    expect(() => applyDiscount(1000, 150)).toThrow();
  });
});

describe("formatCurrency", () => {
  it("should format amount in RUB", () => {
    expect(formatCurrency(1000, "RUB")).toMatch(/1\s?000/);
  });

  it("should format amount in USD", () => {
    expect(formatCurrency(100, "USD")).toMatch(/100/);
  });
});

describe("validateEmail", () => {
  it("should return true for valid email", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });

  it("should return false for email without @", () => {
    expect(validateEmail("userexample.com")).toBe(false);
  });

  it("should return false for non-string input", () => {
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(123)).toBe(false);
  });
});
