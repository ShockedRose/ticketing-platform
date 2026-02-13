import { PrismaClient } from "@prisma/client";
import {
	sampleTicketTiers,
	sampleDiscountCodes,
	sampleUsers,
} from "./sample-data";

async function main() {
	const prisma = new PrismaClient();

	// Delete in order to respect foreign key constraints
	await prisma.orderItem.deleteMany();
	await prisma.attendee.deleteMany();
	await prisma.order.deleteMany();
	await prisma.discountCode.deleteMany();
	await prisma.ticketTier.deleteMany();
	await prisma.account.deleteMany();
	await prisma.session.deleteMany();
	await prisma.verificationToken.deleteMany();
	await prisma.user.deleteMany();

	// Create ticket tiers
	await prisma.ticketTier.createMany({ data: sampleTicketTiers });

	// Create users
	await prisma.user.createMany({ data: sampleUsers });

	// Create discount codes (REPUBLIC26 is restricted to Alpha tier)
	const alphaTier = await prisma.ticketTier.findUnique({
		where: { slug: "alpha" },
	});

	for (const dc of sampleDiscountCodes) {
		await prisma.discountCode.create({
			data: {
				...dc,
				ticketTierId: dc.code === "REPUBLIC26" ? alphaTier?.id : null,
			},
		});
	}

	console.log("Database seeded successfully!");
}

main();
