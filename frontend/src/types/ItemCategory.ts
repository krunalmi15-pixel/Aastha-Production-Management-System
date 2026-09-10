export const ITEM_CATEGORIES = [
  "DD",
  "SH",
  "AUTO",
  "DIALIT",
  "WASSCOVER",
] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];
