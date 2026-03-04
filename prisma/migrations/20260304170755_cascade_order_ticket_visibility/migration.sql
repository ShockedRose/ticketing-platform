-- CreateEnum
CREATE TYPE "TicketVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'HIDDEN');

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_fkey";

-- AlterTable
ALTER TABLE "ticket_types" ADD COLUMN     "visibility" "TicketVisibility" NOT NULL DEFAULT 'HIDDEN';

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
