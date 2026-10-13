const rwf = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** 19000 → "RWF 19,000" */
export function formatRWF(amount: number) {
  return `RWF ${rwf.format(amount)}`;
}
