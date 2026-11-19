/**
 * Currency utility strictly for Nigerian Naira (₦)
 */

export function formatNaira(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "₦0";
  }
  return "₦" + Math.round(amount).toLocaleString("en-NG");
}

export function formatNairaWithKobo(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "₦0.00";
  }
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    currencyDisplay: "narrowSymbol",
  }).format(amount);
}

export function calculateDiscountPercent(basePrice: number, comparePrice?: number | null): number {
  if (!comparePrice || comparePrice <= basePrice) return 0;
  return Math.round(((comparePrice - basePrice) / comparePrice) * 100);
}

