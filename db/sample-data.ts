export type SeedTicketType = {
	name: string;
	sale_starts_at: Date;
	sale_ends_at: Date;
	base_price: number;
	currency: "USD";
	visibility: "PRIVATE" | "PUBLIC";
	is_active: boolean;
	tickets_to_create: number;
};

export type SeedPromoCode = {
	code: string;
	discount_type: "FIXED" | "PERCENTAGE";
	discount_value: number;
	starts_at: Date | null;
	ends_at: Date | null;
	max_redemptions: number | null;
	is_active: boolean;
};

export const ticketTypesSeed: SeedTicketType[] = [
	{
		name: "Student",
		sale_starts_at: new Date("2026-03-09T00:00:00.000Z"),
		sale_ends_at: new Date("2026-04-23T23:59:59.000Z"),
		base_price: 1,
		currency: "USD",
		visibility: "PRIVATE",
		is_active: true,
		tickets_to_create: 30,
	},
	{
		name: "General - Early Bird",
		sale_starts_at: new Date("2026-03-04T00:00:00.000Z"),
		sale_ends_at: new Date("2026-03-21T23:59:59.000Z"),
		base_price: 3,
		currency: "USD",
		visibility: "PUBLIC",
		is_active: true,
		tickets_to_create: 50,
	},
	{
		name: "General - Regular",
		sale_starts_at: new Date("2026-03-01T00:00:00.000Z"),
		sale_ends_at: new Date("2026-04-22T23:59:59.000Z"),
		base_price: 5,
		currency: "USD",
		visibility: "PUBLIC",
		is_active: true,
		tickets_to_create: 130,
	},
	{
		name: "Corporative - Early Bird",
		sale_starts_at: new Date("2026-03-04T00:00:00.000Z"),
		sale_ends_at: new Date("2026-03-21T23:59:59.000Z"),
		base_price: 9,
		currency: "USD",
		visibility: "PUBLIC",
		is_active: true,
		tickets_to_create: 20,
	},
	{
		name: "Corporative - Regular",
		sale_starts_at: new Date("2026-03-21T00:00:00.000Z"),
		sale_ends_at: new Date("2026-04-22T23:59:59.000Z"),
		base_price: 15,
		currency: "USD",
		visibility: "PUBLIC",
		is_active: true,
		tickets_to_create: 20,
	},
];

const generalRegularTicketType = ticketTypesSeed.find(
	(ticketType) => ticketType.name === "General - Regular",
);

if (!generalRegularTicketType) {
	throw new Error("General - Regular ticket type not found in seed data.");
}

export const promoCodesSeed: SeedPromoCode[] = [
	{
		code: "SAVE20",
		discount_type: "FIXED",
		discount_value: 20,
		starts_at: null,
		ends_at: null,
		max_redemptions: null,
		is_active: true,
	},
	{
		code: "GENERALREGULARFREE",
		discount_type: "FIXED",
		discount_value: generalRegularTicketType.base_price,
		starts_at: null,
		ends_at: null,
		max_redemptions: 1,
		is_active: true,
	},
	{
		code: "SAVE40PERCENT",
		discount_type: "PERCENTAGE",
		discount_value: 40,
		starts_at: null,
		ends_at: null,
		max_redemptions: null,
		is_active: true,
	},
];
