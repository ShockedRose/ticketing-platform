import { RegistrationFlow } from "@/components/registration-flow";
import { getTicketTiers } from "@/lib/actions/ticket.actions";

export default async function RegisterPage() {
  const ticketTypes = await getTicketTiers();

  return <RegistrationFlow ticketTiers={ticketTypes} />;
}
