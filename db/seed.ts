import { PrismaClient } from "@prisma/client";

type TicketStatus = "available" | "reserved" | "sold";

const ticketTypesSeed = [
	{
		name: "Early Bird",
		description: "Limited early release tickets",
		sale_starts_at: new Date("2026-02-01T00:00:00.000Z"),
		sale_ends_at: new Date("2026-03-15T23:59:59.000Z"),
		base_price: 99.0,
		currency: "USD",
		is_active: true,
	},
	{
		name: "General Admission",
		description: "Standard conference ticket",
		sale_starts_at: new Date("2026-03-16T00:00:00.000Z"),
		sale_ends_at: new Date("2026-06-20T23:59:59.000Z"),
		base_price: 149.0,
		currency: "USD",
		is_active: true,
	},
	{
		name: "Last Minute",
		description: "Final phase ticket release",
		sale_starts_at: new Date("2026-06-21T00:00:00.000Z"),
		sale_ends_at: new Date("2026-07-01T23:59:59.000Z"),
		base_price: 199.0,
		currency: "USD",
		is_active: true,
	},
];

function randomStatus(): TicketStatus {
	const n = Math.random();
	if (n < 0.6) return "available";
	if (n < 0.85) return "sold";
	return "reserved";
}

function randomReservedUntil(status: TicketStatus): Date | null {
	if (status !== "reserved") return null;

	const now = Date.now();
	const hoursAhead = 1 + Math.floor(Math.random() * 24);
	return new Date(now + hoursAhead * 60 * 60 * 1000);
}

function randomTypeIndex(total: number): number {
	return Math.floor(Math.random() * total);
}

async function main() {
	const prisma = new PrismaClient();

	// Delete in order to respect foreign key constraints
	await prisma.attendee.deleteMany();
	await prisma.orderItem.deleteMany();
	await prisma.payment.deleteMany();
	await prisma.promoRedemption.deleteMany();
	await prisma.order.deleteMany();
	await prisma.ticket.deleteMany();
	await prisma.promoCode.deleteMany();
	await prisma.buyer.deleteMany();
	await prisma.ticketType.deleteMany();

	// Create ticket types
	await prisma.ticketType.createMany({
		data: ticketTypesSeed,
	});

	const ticketTypes = await prisma.ticketType.findMany({
		orderBy: { id: "asc" },
	});

	if (ticketTypes.length === 0) {
		throw new Error("No ticket types were created. Seeding aborted.");
	}

	const ticketsData: Array<{
		ticket_type_id: bigint;
		status: string;
		base_price: number;
		currency: string;
		reserved_until: Date | null;
	}> = [];

	for (let i = 0; i < 50; i += 1) {
		const type = ticketTypes[randomTypeIndex(ticketTypes.length)];
		const status = randomStatus();

		ticketsData.push({
			ticket_type_id: type.id,
			status,
			base_price: Number(type.base_price),
			currency: type.currency,
			reserved_until: randomReservedUntil(status),
		});
	}

	await prisma.ticket.createMany({ data: ticketsData });

	console.log(
		`Database seeded successfully: ${ticketTypes.length} ticket types and ${ticketsData.length} tickets.`,
	);

	await prisma.$disconnect();
}

main().catch(async (error) => {
	console.error("Seed failed:", error);
	process.exitCode = 1;
});
