// Everything a learner can register and pay for. Prices come from the client's
// sales documents and are charged in naira (Paystack amounts are in kobo).
export type Program = {
  id: string;
  group: "school-of-growth" | "fiction-writing";
  name: string;
  amount: number;
  price: string;
  period: string;
  // Optional Paystack plan code: when set, checkout creates a subscription.
  planEnv?: string;
  returnPath: string;
};
export const programs: Program[] = [
  {
    id: "sog-riser",
    group: "school-of-growth",
    name: "School of Growth — Riser",
    amount: 12_500_00,
    price: "₦12,500",
    period: "every quarter",
    planEnv: "PAYSTACK_PLAN_SOG_RISER",
    returnPath: "/school-of-growth",
  },
  {
    id: "sog-builder",
    group: "school-of-growth",
    name: "School of Growth — Builder",
    amount: 75_000_00,
    price: "₦75,000",
    period: "per year",
    planEnv: "PAYSTACK_PLAN_SOG_BUILDER",
    returnPath: "/school-of-growth",
  },
  {
    id: "sog-visionary",
    group: "school-of-growth",
    name: "School of Growth — Visionary",
    amount: 55_000_00,
    price: "₦55,000",
    period: "every quarter (founding price)",
    planEnv: "PAYSTACK_PLAN_SOG_VISIONARY",
    returnPath: "/school-of-growth",
  },
  {
    id: "fiction-waitlist",
    group: "fiction-writing",
    name: "Write Fiction Like Great Movies — Waitlist",
    amount: 27_500_00,
    price: "₦27,500",
    period: "one-time waitlist price",
    returnPath: "/fiction-writing",
  },
];
export const programIds = programs.map((p) => p.id) as [string, ...string[]];
export function getProgram(id: string) {
  return programs.find((p) => p.id === id);
}
export function formatNaira(kobo: number) {
  return `₦${(kobo / 100).toLocaleString("en-NG")}`;
}
