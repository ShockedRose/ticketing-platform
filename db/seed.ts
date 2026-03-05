import { PrismaClient } from "@prisma/client";
import { promoCodesSeed, ticketTypesSeed } from "./sample-data";

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
		data: ticketTypesSeed.map(({ tickets_to_create, ...type }) => type),
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

	const ticketTypesByName = new Map(ticketTypes.map((type) => [type.name, type]));

	for (const seedType of ticketTypesSeed) {
		const ticketType = ticketTypesByName.get(seedType.name);
		if (!ticketType) {
			throw new Error(`Ticket type '${seedType.name}' was not created.`);
		}

		for (let i = 0; i < seedType.tickets_to_create; i += 1) {
			ticketsData.push({
				ticket_type_id: ticketType.id,
				status: "available",
				base_price: Number(ticketType.base_price),
				currency: ticketType.currency,
				reserved_until: null,
			});
		}
	}

	await prisma.ticket.createMany({ data: ticketsData });
	await prisma.promoCode.createMany({ data: promoCodesSeed });

	console.log(
		`Database seeded successfully: ${ticketTypes.length} ticket types, ${ticketsData.length} tickets, and ${promoCodesSeed.length} promo codes.`,
	);

	await prisma.$disconnect();
}

main().catch(async (error) => {
	console.error("Seed failed:", error);
	process.exitCode = 1;
});
