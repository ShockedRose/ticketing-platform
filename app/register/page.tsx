import { RegistrationFlow } from "@/components/registration-flow";
import { getTicketTiers } from "@/lib/actions/ticket.actions";

export default async function RegisterPage() {
  const tiers = await getTicketTiers();

  return <RegistrationFlow ticketTiers={tiers} />;
}
