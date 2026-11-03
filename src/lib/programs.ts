// Everything a learner can register and pay for. Prices come from the client's
// sales documents and are charged in naira (Paystack amounts are in kobo).
export type Program = {
  id: string;
  group:
    | "school-of-growth"
    | "fiction-writing"
    | "consultation"
    | "launch-spotlight";
  name: string;
  amount: number;
  price: string;
  period: string;
  // Optional Paystack plan code: when set, checkout creates a subscription.
  planEnv?: string;
  billingCycles?: number;
  returnPath: string;
  // Where a paid learner continues (e.g. choosing a consultation time).
  successPath?: string;
  // Launch Spotlight asks for the book on the form.
  requiresBook?: boolean;
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
    returnPath: "/sog",
  },
  {
    id: "sog-builder",
    group: "school-of-growth",
    name: "School of Growth — Builder (Pay Once)",
    amount: 75_000_00,
    price: "₦75,000",
    period: "per year",
    planEnv: "PAYSTACK_PLAN_SOG_BUILDER",
    returnPath: "/sog",
  },
  {
    id: "sog-visionary",
    group: "school-of-growth",
    name: "School of Growth — Visionary",
    amount: 55_000_00,
    price: "₦55,000",
    period: "every quarter (founding price)",
    planEnv: "PAYSTACK_PLAN_SOG_VISIONARY",
    returnPath: "/sog",
  },
  {
    id: "fiction-waitlist",
    group: "fiction-writing",
    name: "Write Fiction Like Great Movies — Waitlist",
    amount: 27_500_00,
    price: "₦27,500",
    period: "one-time waitlist price",
    returnPath: "/fiction-course",
  },
  {
    id: "author-consultation",
    group: "consultation",
    name: "Author Business Consultation",
    amount: 101_250_00,
    price: "₦101,250",
    period: "60 minutes · one-on-one · online",
    returnPath: "/consult",
    successPath: "/consult/book",
  },
  ...(
    [
      ["basic", "Basic", 25_000_00, "₦25,000"],
      ["standard", "Standard", 35_000_00, "₦35,000"],
      ["elite", "Elite", 52_000_00, "₦52,000"],
    ] as const
  ).map(([id, tier, amount, price]) => ({
    id: `spotlight-${id}`,
    group: "launch-spotlight" as const,
    name: `Launch Spotlight — ${tier}`,
    amount,
    price,
    period: "12 months live",
    returnPath: "/spotlight",
    requiresBook: true,
  })),
];
// The enum is stable on server and client; unavailable configurations are
// rejected by the server before any registration or charge is created.
export const programIds: [string, ...string[]] = [
  "sog-builder-quarterly",
  ...programs.map((p) => p.id),
];
export function builderQuarterly(): Program | undefined {
  const naira = Number(process.env.SOG_BUILDER_QUARTERLY_AMOUNT_NAIRA);
  const amount = Math.round(naira * 100);
  if (
    !Number.isFinite(naira) ||
    naira <= 0 ||
    !Number.isSafeInteger(amount) ||
    !/^PLN_[a-zA-Z0-9]+$/.test(
      process.env.PAYSTACK_PLAN_SOG_BUILDER_QUARTERLY || "",
    )
  )
    return;
  return {
    id: "sog-builder-quarterly",
    group: "school-of-growth",
    name: "School of Growth — Builder (Pay x4)",
    amount,
    price: formatNaira(amount),
    period: "every quarter",
    planEnv: "PAYSTACK_PLAN_SOG_BUILDER_QUARTERLY",
    billingCycles: 4,
    returnPath: "/sog",
  };
}
export function enrollmentPrograms() {
  const quarterly = builderQuarterly();
  return programs.flatMap((program) =>
    program.id === "sog-builder" && quarterly ? [program, quarterly] : [program],
  );
}
export function getProgram(id: string) {
  return id === "sog-builder-quarterly"
    ? builderQuarterly()
    : programs.find((p) => p.id === id);
}
export function formatNaira(kobo: number) {
  return `₦${(kobo / 100).toLocaleString("en-NG")}`;
}
